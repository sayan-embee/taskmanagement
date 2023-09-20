CREATE PROCEDURE [dbo].[usp_Task_GetById]
(
	@Id BIGINT = NULL,
    @Email NVARCHAR(100) = NULL
)
AS
BEGIN

DECLARE @temp_table TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0,
  RoleName NVARCHAR(50) NULL,
  RoleCode NVARCHAR(50) NULL
)

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @Id)
BEGIN

    INSERT INTO @temp_table EXEC usp_Task_CheckRole_ByTaskId @Id = @Id, @Email = @Email

    SELECT
        RoleId,
        RoleName,
        RoleCode
    FROM @temp_table

    
	SELECT
        [TaskId],
        [TaskRefNo],
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
        [CollaboratorADID]
    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @Id

    --IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskProgressDetails] WITH(NOLOCK) WHERE TaskId = @Id)
    --BEGIN

        SELECT
            [ProgressId],
            [TaskId],
            [RoleId],
            [ProgressRemarks],
            [UpdatedOnIST],
            [UpdatedOnUTC],
            [UpdatedByName],
            [UpdatedByEmail],
            [UpdatedByUPN],
            [UpdatedByADID]
        FROM [dbo].[Trn_TaskProgressDetails] WITH(NOLOCK) WHERE TaskId = @Id
        ORDER BY ProgressId DESC
    --END

    --IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskAssignmentDetails] WITH(NOLOCK) WHERE TaskId = @Id)
    --BEGIN

        SELECT
            [AssignId],
            [TaskId],
            [ProgressId],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [AssignmentType]
        FROM [dbo].[Trn_TaskAssignmentDetails] WITH(NOLOCK) WHERE TaskId = @Id
        --ORDER BY AssignId DESC
    --END

    --IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskHistoryDetails] WITH(NOLOCK) WHERE TaskId = @Id)
    --BEGIN

        SELECT
            [HistoryId],
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
            [CollaboratorADID]
        FROM [dbo].[Trn_TaskHistoryDetails] WITH(NOLOCK) WHERE TaskId = @Id
        --ORDER BY HistoryId DESC
    --END

END

END