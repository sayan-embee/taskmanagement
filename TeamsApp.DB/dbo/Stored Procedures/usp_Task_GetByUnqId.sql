CREATE PROCEDURE [dbo].[usp_Task_GetByUnqId]
(
	@TaskUnqId UNIQUEIDENTIFIER = NULL
)
AS
BEGIN

	SELECT
        [TaskId],
        [TaskRefNo],
        [TaskUnqId],
        T.[StatusId],
        S.[StatusName],
        T.[PriorityId],
        P.[PriorityName],
        T.[RoleId],
        R.[RoleName],
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
    FROM [dbo].[Trn_TaskDetails] T WITH(NOLOCK)
    INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId
    INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId
    INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId
    WHERE T.TaskUnqId = @TaskUnqId
END