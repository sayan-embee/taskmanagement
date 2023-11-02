CREATE PROCEDURE [dbo].[usp_Task_GetByUnqId]
(
    @TaskId BIGINT,
	@TaskUnqId UNIQUEIDENTIFIER = NULL
)
AS
BEGIN

	SELECT
        T.[TaskId],
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
        [CollaboratorADID],
        PR.[UpdatedOnIST],
        PR.[UpdatedByName],
        CASE WHEN CONVERT(DATE,DATEADD(MINUTE, 330, GETUTCDATE()),103) > (CONVERT(DATE, T.CurrentTargetDate, 103)) AND T.StatusId != 3 THEN 1 ELSE 0 END AS 'IsOverdue'
    FROM [dbo].[Trn_TaskDetails] T WITH(NOLOCK)
    INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId
    INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId
    INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId
    LEFT JOIN [dbo].[Trn_TaskProgressDetails] PR ON PR.TaskId = T.TaskId AND PR.TransactionId = T.TransactionId
    WHERE
    (@TaskId > 0 AND T.TaskId = @TaskId AND T.TaskUnqId = @TaskUnqId)
    OR
    (@TaskId <= 0 AND T.TaskUnqId = @TaskUnqId)
END