CREATE PROCEDURE [dbo].[usp_Task_Insert]
(
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @RoleId INT = NULL,
    @ParentTaskId BIGINT = NULL,
    @CreatedByName NVARCHAR(100) = NULL,
    @CreatedByEmail NVARCHAR(100) = NULL,
    @CreatedByUPN NVARCHAR(50) = NULL,
    @CreatedByADID NVARCHAR(50) = NULL,
    @TaskSubject NVARCHAR(200) = NULL,
    @TaskDesc NVARCHAR(500) = NULL,
    @InitialTargetDate DATETIME = NULL,
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

    @udt_TaskAssignee udt_TaskAssignee NULL READONLY
)
AS
BEGIN

DECLARE @TaskUnqId AS UNIQUEIDENTIFIER = NEWID ();
DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();

BEGIN TRANSACTION

IF NOT EXISTS (SELECT * FROM @udt_TaskAssignee)
BEGIN
    INSERT INTO [dbo].[Trn_TaskDetails] 
    (
        [TaskUnqId],
        [StatusId],
        [PriorityId],
        [RoleId],
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
        [InitialTargetDate],
        [CurrentTargetDate],
        [AssignerName],
        [AssignerEmail],
        [AssignerUPN],
        [AssignerADID],
        --[AssigneeName],
        --[AssigneeEmail],
        --[AssigneeUPN],
        --[AssigneeADID],
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
    VALUES 
    (
        @TaskUnqId,
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
        @InitialTargetDate,
        @InitialTargetDate,
        @AssignerName,
        @AssignerEmail,
        @AssignerUPN,
        @AssignerADID,
        --@AssigneeName,
        --@AssigneeEmail,
        --@AssigneeUPN,
        --@AssigneeADID,
        @CoordinatorName,
        @CoordinatorEmail,
        @CoordinatorUPN,
        @CoordinatorADID,
        @CollaboratorName,
        @CollaboratorEmail,
        @CollaboratorUPN,
        @CollaboratorADID,
        @TransactionId
    )

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Create task failed'    AS [Message],
		    ''					    AS ErrorMessage,
		    0						AS [Status],
		    0				        AS Id,
		    ''						AS ReferenceNo
	    RETURN
    END

END
ELSE
BEGIN

    INSERT INTO [dbo].[Trn_TaskDetails] 
    (
        [TaskUnqId],
        [StatusId],
        [PriorityId],
        [RoleId],
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
        @TaskUnqId,
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
        @InitialTargetDate,
        @InitialTargetDate,
        @AssignerName,
        @AssignerEmail,
        @AssignerUPN,
        @AssignerADID,
        udt.AssigneeName,
        udt.AssigneeEmail,
        udt.AssigneeUPN,
        udt.AssigneeADID,
        @CoordinatorName,
        @CoordinatorEmail,
        @CoordinatorUPN,
        @CoordinatorADID,
        @CollaboratorName,
        @CollaboratorEmail,
        @CollaboratorUPN,
        @CollaboratorADID,
        @TransactionId
    FROM @udt_TaskAssignee udt

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Create task failed'    AS [Message],
		    ''					    AS ErrorMessage,
		    0						AS [Status],
		    0				        AS Id,
		    ''						AS ReferenceNo
	    RETURN
    END

END



    -- UPDATE REF NO
    UPDATE [dbo].[Trn_TaskDetails]
    SET TaskRefNo = FORMAT(TaskId,'000000')
    WHERE TaskUnqId = @TaskUnqId

    DECLARE @ProgressId BIGINT = 0;
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
    SELECT
        [TaskId],
        @RoleId,
        'Task Created & Assigned',
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @CreatedByName,
        @CreatedByEmail,
        @CreatedByUPN,
        @CreatedByADID
        ,@TransactionId
    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
     WHERE TaskUnqId = @TaskUnqId

     SET @ProgressId = @@IDENTITY;


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
        'ASSIGNED',
        @TransactionId
    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
     WHERE TaskUnqId = @TaskUnqId AND @ProgressId > 0


    -- ADD ALL TASK ID IN A LIST
    DECLARE @IdList VARCHAR(100) = NULL;
    IF EXISTS(SELECT * FROM @udt_TaskAssignee)
    BEGIN
        ;WITH DATA1 AS 
        (
            SELECT TaskId
            FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
             WHERE TaskUnqId = @TaskUnqId
        )
        SELECT @IdList = CONCAT(@IdList,',',TaskId)
        FROM DATA1
    END



    COMMIT TRANSACTION
    SELECT 
        'Create task executed'     AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        @@IDENTITY				   AS Id,
        @IdList				       AS ReferenceNo

END
