CREATE PROCEDURE [dbo].[usp_RequestedTask_GetAll]
(
    @RequestId BIGINT = NULL,
    @RequestedUserName NVARCHAR(100) = NULL,
    @RequestedUserEmail NVARCHAR(100) = NULL,
    @LoggedInUserEmail NVARCHAR(100) = NULL,
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @ParentTaskId BIGINT = NULL,
    @TaskSubject NVARCHAR(200) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
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

    INSERT INTO @temp_table EXEC usp_Task_CheckRole_ByTaskId @Id = 0, @Email = @LoggedInUserEmail

    SELECT
        temp.RoleId AS 'LoggedInUserRoleId',
        temp.RoleName AS 'LoggedInUserRoleName',
        R.[RequestId],
        R.[RequestRefNo],
        R.[TaskId],
        R.[ProgressId],        
        R.[StatusId],
        S.[StatusName],
        R.[PriorityId],
        P.[PriorityName],
        R.[RequestorRoleId],
		CASE WHEN R.[RequestorRoleId] IS NOT NULL THEN (SELECT RL.RoleName FROM [dbo].[Mst_Role] RL WITH(NOLOCK) WHERE RL.RoleId = R.[RequestorRoleId]) ELSE NULL END AS 'RequestorRoleName',
        R.[ApproverRoleId],
        CASE WHEN R.[ApproverRoleId] IS NOT NULL THEN (SELECT RL.RoleName FROM [dbo].[Mst_Role] RL WITH(NOLOCK) WHERE RL.RoleId = R.[ApproverRoleId]) ELSE NULL END AS 'ApproverRoleName',
        R.[ParentTaskId],
        R.[IsActive],
        R.[IsCancelled],
        R.[CreatedOnIST],
        R.[CreatedOnUTC],
        R.[CreatedByName],
        R.[CreatedByEmail],
        R.[CreatedByUPN],
        R.[CreatedByADID],
        R.[TaskSubject],
        R.[TaskDesc],
        R.[CurrentTargetDate],
        R.[TransactionId],
        R.[IsApproved],
        R.[RequestRemarks],
        R.[ApprovalRemarks],
        R.[UpdatedOnIST],
        R.[UpdatedOnUTC],
        R.[UpdatedByName],
        R.[UpdatedByEmail],
        R.[UpdatedByUPN],
        R.[UpdatedByADID]
    FROM
    [dbo].[Trn_Request_TaskDetails] R WITH(NOLOCK)

    INNER JOIN [dbo].[Trn_TaskDetails] T WITH(NOLOCK) ON T.TaskId = R.TaskId

    LEFT OUTER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = R.StatusId

    LEFT OUTER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = R.PriorityId

    LEFT OUTER JOIN @temp_table temp ON temp.TaskId = T.TaskId

    WHERE
    (@RequestId IS NULL OR R.RequestId = @RequestId)
    AND (IsCancelled IS NULL OR IsCancelled = 0)
    AND (
            T.[AssignerEmail] = @LoggedInUserEmail
            OR T.[AssigneeEmail] = @LoggedInUserEmail
            OR T.[CoordinatorEmail] = @LoggedInUserEmail
            OR T.[CollaboratorEmail] = @LoggedInUserEmail
        )
    AND (@RequestedUserEmail IS NULL OR R.[CreatedByEmail] = @RequestedUserEmail)
    AND (@RequestedUserName IS NULL OR R.CreatedByName LIKE @RequestedUserName + '%')
    AND (@StatusId IS NULL OR R.[StatusId] = @StatusId)
    AND (@PriorityId IS NULL OR R.[PriorityId] = @PriorityId)
    --AND (@ParentTaskId IS NULL OR T.[ParentTaskId] = @ParentTaskId)
    --AND (@TaskSubject IS NULL OR R.[TaskSubject] LIKE @TaskSubject + '%')
    AND (@FromDate IS NULL OR CONVERT(DATE, R.[CreatedOnIST], 103) >= @FromDate)
    AND (@ToDate IS NULL OR CONVERT(DATE, R.[CreatedOnIST], 103) <= @ToDate)

    ORDER BY RequestId

END