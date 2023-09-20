CREATE PROCEDURE [dbo].[usp_Task_Reassign]
(
    @TaskId BIGINT = NULL,
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(50) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL,
    @AssigneeName NVARCHAR(100) = NULL,
    @AssigneeEmail NVARCHAR(100) = NULL,
    @AssigneeUPN NVARCHAR(50) = NULL,
    @AssigneeADID NVARCHAR(50) = NULL,
    @RoleId INT = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL
)
AS
BEGIN

DECLARE @ProgressId BIGINT = 0;
DECLARE @HistoryId BIGINT = 0;
DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId AND AssigneeEmail = @AssigneeEmail)
BEGIN
    SELECT 
        'Cannot assign to same person'      AS [Message],
        ''						            AS ErrorMessage,
        0					                AS [Status],
        @TaskId				                AS Id,
        ''				                    AS ReferenceNo
    RETURN
END

BEGIN TRANSACTION

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
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
        ISNULL(@ProgressRemarks, 'Task Reassigned'),
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
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    SET @ProgressId = @@IDENTITY;

    IF(@ProgressId > 0)
    BEGIN
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
        FROM [dbo].[Trn_TaskDetails] WITH (NOLOCK) WHERE [TaskId] = @TaskId
    END

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    SET @HistoryId = @@IDENTITY;
    
    IF(@HistoryId > 0)
    BEGIN
        UPDATE [dbo].[Trn_TaskDetails]
        SET
            [RoleId] = ISNULL(@RoleId,RoleId),
            [AssigneeName] = ISNULL(@AssigneeName,AssigneeName),
            [AssigneeEmail] = ISNULL(@AssigneeEmail,AssigneeEmail),
            [AssigneeUPN] = ISNULL(@AssigneeUPN,AssigneeUPN),
            [AssigneeADID] = ISNULL(@AssigneeADID,AssigneeADID),
            [TransactionId] = @TransactionId
        WHERE [TaskId] = @TaskId


        INSERT INTO [dbo].[Trn_TaskAssignmentDetails] 
         (
            [TaskId],
            [ProgressId],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [AssignmentType],
            [TransactionId]
        )
        SELECT
            [TaskId],
            @ProgressId,
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            'RE-ASSIGNED',
            TransactionId
        FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
         WHERE [TaskId] = @TaskId AND @ProgressId > 0 AND @HistoryId > 0

    END


    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

END

    COMMIT TRANSACTION
    SELECT 
        'Reassign Task executed'     AS [Message],
        ''						     AS ErrorMessage,
        1					         AS [Status],
        @TaskId				         AS Id,
        ''				             AS ReferenceNo

END