CREATE PROCEDURE [dbo].[usp_Task_GetByIdListView]
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



        SELECT
            P.[ProgressId],
            P.[TaskId],
            [RoleId],
            [ProgressRemarks],
            [UpdatedOnIST],
            [UpdatedOnUTC],
            [UpdatedByName],
            [UpdatedByEmail],
            [UpdatedByUPN],
            [UpdatedByADID],
            [AssignId],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [AssignmentType]
        FROM [dbo].[Trn_TaskProgressDetails] P WITH(NOLOCK) 
        INNER JOIN [dbo].[Trn_TaskAssignmentDetails] A WITH(NOLOCK) ON A.ProgressId = P.ProgressId
        WHERE P.TaskId = @Id
        ORDER BY P.ProgressId DESC


        SELECT
            P.[ProgressId],
            P.[TaskId],
            P.[RoleId],
            [ProgressRemarks],
            [UpdatedOnIST],
            [UpdatedOnUTC],
            [UpdatedByName],
            [UpdatedByEmail],
            [UpdatedByUPN],
            [UpdatedByADID],
            [HistoryId],
            [StatusId],
            [PriorityId],
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
        FROM [dbo].[Trn_TaskProgressDetails] P WITH(NOLOCK) 
        INNER JOIN [dbo].[Trn_TaskHistoryDetails] H WITH(NOLOCK) ON H.ProgressId = P.ProgressId
        WHERE P.TaskId = @Id
        ORDER BY P.ProgressId DESC

END

END
