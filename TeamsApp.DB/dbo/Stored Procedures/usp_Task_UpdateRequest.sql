CREATE PROCEDURE [dbo].[usp_Task_UpdateRequest]
(
    @RequestId BIGINT,
    @TaskId BIGINT,
    @StatusId INT,
    @PriorityId INT,
    @RoleId INT,
    @ParentTaskId BIGINT,
    @UpdatedByName NVARCHAR(100),
    @UpdatedByEmail NVARCHAR(100),
    @UpdatedByUPN NVARCHAR(100),
    @UpdatedByADID NVARCHAR(50),
    @TaskSubject NVARCHAR(200),
    @TaskDesc NVARCHAR(500),
    @CurrentTargetDate DATETIME,
    @RequestRemarks NVARCHAR(500),
    @IsCancelled BIT
)
AS
BEGIN

    DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();
    DECLARE @TaskUnqId AS UNIQUEIDENTIFIER = NULL;
    DECLARE @JSONString NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT RequestId FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE RequestId = @RequestId)
    BEGIN
        
        IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
        BEGIN

        IF EXISTS (SELECT 1 FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE RequestId = @RequestId AND TaskId = @TaskId AND (IsActive = 0 OR ISNULL(IsCancelled,0) = 1))
        BEGIN
            SELECT 
            'Invalid Request Id / Already action taken'                                     AS [Message],
            ''					                                                            AS ErrorMessage,
            0						                                                        AS [Status],
            0				                                                                AS Id,
            ''						                                                        AS ReferenceNo
            RETURN
        END

        BEGIN TRANSACTION

            SELECT @TaskUnqId = TaskUnqId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId
            SELECT @TransactionId = TransactionId FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE RequestId = @RequestId

            UPDATE [dbo].[Trn_Request_TaskDetails]
            SET TaskSubject = ISNULL(@TaskSubject, TaskSubject),
            TaskDesc = ISNULL(@TaskDesc, TaskDesc),
            CurrentTargetDate = ISNULL(@CurrentTargetDate, CurrentTargetDate),
            RequestRemarks = ISNULL(@RequestRemarks, RequestRemarks),
            StatusId = ISNULL(@StatusId, StatusId),
            PriorityId = ISNULL(@PriorityId, PriorityId),
            ParentTaskId = ISNULL(@ParentTaskId, ParentTaskId),
            IsCancelled = ISNULL(@IsCancelled, IsCancelled),
            UpdatedOnIST = DATEADD(MINUTE, 330, GETUTCDATE()),
            UpdatedOnUTC = GETUTCDATE(),
            UpdatedByName = @UpdatedByName,
            UpdatedByEmail = @UpdatedByEmail,
            UpdatedByUPN = @UpdatedByUPN,
            UpdatedByADID = @UpdatedByADID
            WHERE RequestId = @RequestId

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
            WHERE RQ.RequestId = @RequestId
            FOR JSON AUTO
            );


            COMMIT TRANSACTION
            SELECT
                'Request task executed'    AS [Message],
                ''						   AS ErrorMessage,
                1					       AS [Status],
                @RequestId				   AS Id,
                @JSONString				   AS ReferenceNo,
                @TaskUnqId                 AS GuidId,
                @TransactionId             AS TransactionId

        END
        ELSE
        BEGIN
            SELECT 
            'Associated task details not found'                                             AS [Message],
            ''					                                                            AS ErrorMessage,
            0						                                                        AS [Status],
            0				                                                                AS Id,
            ''						                                                        AS ReferenceNo
            RETURN
        END

    END
    ELSE
    BEGIN
        SELECT 
        'Request details not found'                                                     AS [Message],
        ''					                                                            AS ErrorMessage,
        0						                                                        AS [Status],
        0				                                                                AS Id,
        ''						                                                        AS ReferenceNo
        RETURN
    END

END
