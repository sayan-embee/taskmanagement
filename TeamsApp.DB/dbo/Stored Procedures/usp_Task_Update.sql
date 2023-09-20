CREATE PROCEDURE [dbo].[usp_Task_Update]
(
    @TaskId BIGINT = NULL,
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @RoleId INT = NULL,
    @ParentTaskId BIGINT = NULL,
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(50) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL,
    @TaskSubject NVARCHAR(200) = NULL,
    @TaskDesc NVARCHAR(500) = NULL,
    @CurrentTargetDate DATETIME = NULL,
    @AssignerName NVARCHAR(100) = NULL,
    @AssignerEmail NVARCHAR(100) = NULL,
    @AssignerUPN NVARCHAR(50) = NULL,
    @AssignerADID NVARCHAR(50) = NULL,
    --@AssigneeName NVARCHAR(100) = NULL,
    --@AssigneeEmail NVARCHAR(100) = NULL,
    --@AssigneeUPN NVARCHAR(50) = NULL,
    --@AssigneeADID NVARCHAR(50) = NULL,
    @CoordinatorName NVARCHAR(100) = NULL,
    @CoordinatorEmail NVARCHAR(100) = NULL,
    @CoordinatorUPN NVARCHAR(50) = NULL,
    @CoordinatorADID NVARCHAR(50) = NULL,
    @CollaboratorName NVARCHAR(100) = NULL,
    @CollaboratorEmail NVARCHAR(100) = NULL,
    @CollaboratorUPN NVARCHAR(50) = NULL,
    @CollaboratorADID NVARCHAR(50) = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL
)
AS
BEGIN

DECLARE @ProgressId BIGINT = 0;
DECLARE @HistoryId BIGINT = 0;
DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();

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
        @ProgressRemarks,
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @UpdatedByName,
        @UpdatedByEmail,
        @UpdatedByUPN,
        @UpdatedByADID
        ,@TransactionId
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
		    'Update task failed'        AS [Message],
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
            [StatusId] = ISNULL(@StatusId,StatusId),
            [PriorityId] =  ISNULL(@PriorityId,PriorityId),
            [RoleId] = ISNULL(@RoleId,RoleId),
            [ParentTaskId] = ISNULL(@ParentTaskId,ParentTaskId),
            [TaskSubject] = ISNULL(@TaskSubject,TaskSubject),
            [TaskDesc] = ISNULL(@TaskDesc,TaskDesc),
            [CurrentTargetDate] = ISNULL(@CurrentTargetDate,CurrentTargetDate),
            [AssignerName] = ISNULL(@AssignerName,AssignerName),
            [AssignerEmail] = ISNULL(@AssignerEmail,AssignerEmail),
            [AssignerUPN] = ISNULL(@AssignerUPN,AssignerUPN),
            [AssignerADID] = ISNULL(@AssignerADID,AssignerADID),
            [CoordinatorName] = ISNULL(@CoordinatorName,CoordinatorName),
            [CoordinatorEmail] = ISNULL(@CoordinatorEmail,CoordinatorEmail),
            [CoordinatorUPN] = ISNULL(@CoordinatorUPN,CoordinatorUPN),
            [CoordinatorADID] = ISNULL(@CoordinatorADID,CoordinatorADID),
            [CollaboratorName] = ISNULL(@CollaboratorName,CollaboratorName),
            [CollaboratorEmail] = ISNULL(@CollaboratorEmail,CollaboratorEmail),
            [CollaboratorUPN] = ISNULL(@CollaboratorUPN,CollaboratorUPN),
            [CollaboratorADID] = ISNULL(@CollaboratorADID,CollaboratorADID),
            [TransactionId] = @TransactionId
        WHERE [TaskId] = @TaskId
    END


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

    COMMIT TRANSACTION
    SELECT 
        'Update task executed'     AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        @TaskId				       AS Id,
        ''				           AS ReferenceNo

END
