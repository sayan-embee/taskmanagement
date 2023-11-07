CREATE PROCEDURE [dbo].[usp_Task_ActionOnRequest]
(
    @RequestId BIGINT,
    @TaskId BIGINT,
    @RoleId INT,
    @UpdatedByName NVARCHAR(100),
    @UpdatedByEmail NVARCHAR(100),
    @UpdatedByUPN NVARCHAR(100),
    @UpdatedByADID NVARCHAR(50),
    @ApprovalRemarks NVARCHAR(500),
    @IsApproved BIT
)
AS
BEGIN

    DECLARE @ProgressId BIGINT = 0;
    DECLARE @HistoryId BIGINT = 0;
    DECLARE @CurrentTargetDate DATETIME;
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
            SELECT @TransactionId = TransactionId, @CurrentTargetDate = CurrentTargetDate FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE RequestId = @RequestId

            UPDATE [dbo].[Trn_Request_TaskDetails]
            SET IsApproved = ISNULL(@IsApproved, IsApproved),
            IsActive = 0,
            ApproverRoleId = ISNULL(@RoleId, ApproverRoleId),
            ApprovalRemarks = ISNULL(@ApprovalRemarks, ApprovalRemarks),
            UpdatedOnIST = DATEADD(MINUTE, 330, GETUTCDATE()),
            UpdatedOnUTC = GETUTCDATE(),
            @UpdatedByName = @UpdatedByName,
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





            IF(@IsApproved = 1)
            BEGIN
                
                INSERT INTO [dbo].[Trn_TaskProgressDetails] 
                (
                    [TaskId],
                    [RoleId],
                    [ProgressRemarks],
                    [UpdatedOnIST],
                    [UpdatedOnUTC],
                    [UpdatedByName],
                    [UpdatedByEmail],
                    [UpdatedByUPN],
                    [UpdatedByADID],
                    [TransactionId]
                ) 
                VALUES 
                (
                    @TaskId,
                    @RoleId,
                    'Date Extension Requested & Approved',
                    DATEADD(MINUTE, 330, GETUTCDATE()),
                    GETUTCDATE(),
                    @UpdatedByName,
                    @UpdatedByEmail,
                    @UpdatedByUPN,
                    @UpdatedByADID,
                    @TransactionId
                )

                IF @@ERROR<>0
                BEGIN
	                ROLLBACK TRANSACTION
	                SELECT 
		                'Update task failed'        AS [Message],
		                ''					        AS ErrorMessage,
		                0						    AS [Status],
		                0				            AS Id,
		                ''						    AS ReferenceNo
	                RETURN
                END

                SET @ProgressId = @@IDENTITY;

                IF(@ProgressId > 0)
                BEGIN

                    
                    UPDATE [dbo].[Trn_Request_TaskDetails]
                    SET ProgressId = @ProgressId
                    WHERE RequestId = @RequestId AND TransactionId = @TransactionId

                    IF @@ERROR<>0
                    BEGIN
	                    ROLLBACK TRANSACTION
	                    SELECT 
		                    'Update task failed'    AS [Message],
		                    ''					    AS ErrorMessage,
		                    0						AS [Status],
		                    0				        AS Id,
		                    ''						AS ReferenceNo
	                    RETURN
                    END


                    INSERT INTO [dbo].[Trn_TaskHistoryDetails]
                    (
                        [TaskId],
                        [ProgressId],        
                        [StatusId],
                        [PriorityId],
                        [RoleId],
                        [TaskRefNo],
                        [TaskUnqId],
                        [ParentTaskId],
                        [TaskSubject],
                        [TaskDesc],
                        [InitialTargetDate],
                        [CurrentTargetDate],
                        [AssignerName],
                        [AssignerEmail],
                        [AssignerUPN],
                        [AssignerADID],
                        [AssigneeName],
                        [AssigneeEmail],
                        [AssigneeUPN],
                        [AssigneeADID],
                        [CoordinatorName],
                        [CoordinatorEmail],
                        [CoordinatorUPN],
                        [CoordinatorADID],
                        [CollaboratorName],
                        [CollaboratorEmail],
                        [CollaboratorUPN],
                        [CollaboratorADID],
                        [TransactionId]
                    )
                    SELECT
                        [TaskId],
                        @ProgressId,        
                        [StatusId],
                        [PriorityId],
                        [RoleId],
                        [TaskRefNo],
                        [TaskUnqId],
                        [ParentTaskId],
                        [TaskSubject],
                        [TaskDesc],
                        [InitialTargetDate],
                        [CurrentTargetDate],
                        [AssignerName],
                        [AssignerEmail],
                        [AssignerUPN],
                        [AssignerADID],
                        [AssigneeName],
                        [AssigneeEmail],
                        [AssigneeUPN],
                        [AssigneeADID],
                        [CoordinatorName],
                        [CoordinatorEmail],
                        [CoordinatorUPN],
                        [CoordinatorADID],
                        [CollaboratorName],
                        [CollaboratorEmail],
                        [CollaboratorUPN],
                        [CollaboratorADID],
                        @TransactionId
                    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE [TaskId] = @TaskId

                    IF @@ERROR<>0
                    BEGIN
	                    ROLLBACK TRANSACTION
	                    SELECT 
		                    'Update task failed'        AS [Message],
		                    ''					        AS ErrorMessage,
		                    0						    AS [Status],
		                    0				            AS Id,
		                    ''						    AS ReferenceNo
	                    RETURN
                    END

                    SET @HistoryId = @@IDENTITY;
                END               

                IF(@HistoryId > 0)
                BEGIN
                    UPDATE [dbo].[Trn_TaskDetails]
                    SET [CurrentTargetDate] = ISNULL(@CurrentTargetDate,CurrentTargetDate),
                        [TransactionId] = @TransactionId,
                        [NoOfExtensionRequested] = ISNULL([NoOfExtensionRequested], 0) + 1
                    WHERE [TaskId] = @TaskId

                    IF @@ERROR<>0
                    BEGIN
	                    ROLLBACK TRANSACTION
	                    SELECT 
		                    'Update task failed'    AS [Message],
		                    ''					    AS ErrorMessage,
		                    0						AS [Status],
		                    0				        AS Id,
		                    ''						AS ReferenceNo
	                    RETURN
                    END
                END              

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
                --RQ.CurrentTargetDate AS 'CurrentTargetDate',
                T.[TaskId],
                T.[TaskRefNo],
                T.[TaskUnqId],
                T.[StatusId],
                S.[StatusName],
                T.[PriorityId],
                P.[PriorityName],
                RQ.[ApproverRoleId] AS 'RoleId',
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
                T.[InitialTargetDate] AS 'InitialTargetDate',
                T.[CurrentTargetDate] AS 'CurrentTargetDate',
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
                'Action on requested task executed'     AS [Message],
                ''						                AS ErrorMessage,
                1					                    AS [Status],
                @RequestId				                AS Id,
                @JSONString				                AS ReferenceNo,
                @TaskUnqId                              AS GuidId,
                @TransactionId                          AS TransactionId

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
