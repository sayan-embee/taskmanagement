CREATE PROCEDURE [dbo].[usp_Task_InsertRequest]
(
    @TaskId BIGINT,
    @StatusId INT,
    @PriorityId INT,
    @RoleId INT,
    @ParentTaskId BIGINT,
    @CreatedByName NVARCHAR(100),
    @CreatedByEmail NVARCHAR(100),
    @CreatedByUPN NVARCHAR(100),
    @CreatedByADID NVARCHAR(50),
    @TaskSubject NVARCHAR(200),
    @TaskDesc NVARCHAR(500),
    @CurrentTargetDate DATETIME,
    @RequestRemarks NVARCHAR(500)
)
AS
BEGIN

    DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();
    DECLARE @TaskUnqId AS UNIQUEIDENTIFIER = NULL;
    DECLARE @JSONString NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
    BEGIN

    IF EXISTS (SELECT RequestId FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId AND IsActive = 1 AND ISNULL(IsCancelled,0) != 1)
    BEGIN
        SELECT 
        'Pending request(s) exist'                                                      AS [Message],
        ''					                                                            AS ErrorMessage,
        0						                                                        AS [Status],
        0				                                                                AS Id,
        ''						                                                        AS ReferenceNo
        RETURN
    END

    BEGIN TRANSACTION

        SELECT @TaskUnqId = TaskUnqId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId

	    INSERT INTO [dbo].[Trn_Request_TaskDetails]
        (
            [TaskId],
            [StatusId],
            [PriorityId],
            [RequestorRoleId],
            [ParentTaskId],
            [IsActive],
            [CreatedOnIST],
            [CreatedOnUTC],
            [CreatedByName],
            [CreatedByEmail],
            [CreatedByUPN],
            [CreatedByADID],
            [TaskSubject],
            [TaskDesc],
            [CurrentTargetDate],
            [TransactionId],
            [RequestRemarks]
        )
        VALUES 
        (
            @TaskId,
            @StatusId,
            @PriorityId,
            @RoleId,
            @ParentTaskId,
            1,
            DATEADD(MINUTE, 330, GETUTCDATE()),
            GETUTCDATE(),
            @CreatedByName,
            @CreatedByEmail,
            @CreatedByUPN,
            @CreatedByADID,
            @TaskSubject,
            @TaskDesc,
            @CurrentTargetDate,
            @TransactionId,
            @RequestRemarks
        )

        IF @@ERROR<>0
        BEGIN
	        ROLLBACK TRANSACTION
	        SELECT 
		        'Request task failed'   AS [Message],
		        ''					    AS ErrorMessage,
		        0						AS [Status],
		        0				        AS Id,
		        ''						AS ReferenceNo
	        RETURN
        END


        -- UPDATE REF NO
        UPDATE [dbo].[Trn_Request_TaskDetails]
        SET RequestRefNo = 'REQ-' + CAST(FORMAT(@@IDENTITY,'000000') AS NVARCHAR(100))
        WHERE RequestId = @@IDENTITY


        -- ADD ALL TASK ID IN A LIST
        --DECLARE @IdList VARCHAR(MAX) = NULL;
        --;WITH DATA1 AS 
        --(
        --    SELECT TaskId
        --    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
        --        WHERE TaskId = @TaskId
        --)
        --SELECT @IdList = CONCAT(@IdList,',',TaskId)
        --FROM DATA1

        SET @JSONString = (
        SELECT
            RQ.RequestId,
            RQ.CurrentTargetDate AS 'CurrentTargetDate',
            T.[TaskId],
            T.[TaskRefNo],
            T.[TaskUnqId],
            T.[StatusId],
            S.[StatusName],
            T.[PriorityId],
            P.[PriorityName],
            RQ.[RequestorRoleId] AS 'RoleId',
            R.[RoleName],
            T.[ParentTaskId],
            T.[IsActive],
            T.[CreatedOnIST],
            T.[CreatedOnUTC],
            T.[CreatedByName],
            T.[CreatedByEmail],
            T.[CreatedByUPN],
            T.[CreatedByADID],
            T.[TaskSubject],
            T.[TaskDesc],
            [InitialTargetDate],
            T.[CurrentTargetDate] AS 'InitialTargetDate',
            T.[AssignerName],
            T.[AssignerEmail],
            T.[AssignerUPN],
            T.[AssignerADID],
            T.[AssigneeName],
            T.[AssigneeEmail],
            T.[AssigneeUPN],
            T.[AssigneeADID],
            T.[CoordinatorName],
            T.[CoordinatorEmail],
            T.[CoordinatorUPN],
            T.[CoordinatorADID],
            T.[CollaboratorName],
            T.[CollaboratorEmail],
            T.[CollaboratorUPN],
            T.[CollaboratorADID],
            RQ.[UpdatedOnIST],
            RQ.[UpdatedByName],
            CASE WHEN CONVERT(DATE,DATEADD(MINUTE, 330, GETUTCDATE()),103) > (CONVERT(DATE, T.CurrentTargetDate, 103)) AND T.StatusId != 3 THEN 1 ELSE 0 END AS 'IsOverdue'
        FROM [dbo].[Trn_Request_TaskDetails] RQ WITH(NOLOCK)
        INNER JOIN [dbo].[Trn_TaskDetails] T WITH(NOLOCK) ON T.TaskId = RQ.TaskId
        INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId
        INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId
        INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId
        WHERE RQ.RequestId = @@IDENTITY
        FOR JSON AUTO
        );


        COMMIT TRANSACTION
        SELECT
            'Request task executed'    AS [Message],
            ''						   AS ErrorMessage,
            1					       AS [Status],
            @@IDENTITY				   AS Id,
            @JSONString				   AS ReferenceNo,
            @TaskUnqId                 AS GuidId,
            @TransactionId             AS TransactionId

    END

END
