CREATE PROCEDURE [dbo].[usp_Task_CheckRole_ByTaskId]
(
	@Id BIGINT = NULL,
    @Email NVARCHAR(100) = NULL
)
AS
BEGIN

    SELECT
    [TaskId],
        CASE
            WHEN [AssignerEmail] = @Email THEN 1
            WHEN [AssigneeEmail] = @Email THEN 2
            WHEN [CoordinatorEmail] = @Email THEN 3
            WHEN [CollaboratorEmail] = @Email THEN 4
            ELSE 0
        END AS RoleId,
        R.RoleName,
        R.RoleCode
    FROM [dbo].[Trn_TaskDetails] AS T WITH (NOLOCK)
    LEFT JOIN [dbo].[Mst_Role] AS R WITH (NOLOCK) ON
        CASE
            WHEN [AssignerEmail] = @Email THEN 1
            WHEN [AssigneeEmail] = @Email THEN 2
            WHEN [CoordinatorEmail] = @Email THEN 3
            WHEN [CollaboratorEmail] = @Email THEN 4
            ELSE 0
        END = R.RoleId
    WHERE
    (
        [AssignerEmail] = @Email
        OR [AssigneeEmail] = @Email
        OR [CoordinatorEmail] = @Email
        OR [CollaboratorEmail] = @Email
    )
    AND ((@Id = 0) OR (TaskId = @Id))

END
