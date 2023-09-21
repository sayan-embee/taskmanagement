CREATE PROCEDURE [dbo].[usp_Task_GetAll]
(
    @LoggedInUserEmail NVARCHAR(100) = NULL,
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @RoleId INT = NULL,
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

    --SELECT
    --    RoleId,
    --    RoleName,
    --    RoleCode
    --FROM @temp_table
    
	SELECT
        temp.RoleId AS 'LoggedInUserRoleId',
        temp.RoleName AS 'LoggedInUserRoleName',
        T.[TaskId],
        T.[TaskRefNo],
        T.[StatusId],
        S.[StatusName],
        T.[PriorityId],
        P.[PriorityName],
        T.[RoleId],
        R.[RoleName],
        T.[ParentTaskId],
        T.[IsActive],
        T.[CreatedOnIST],
        T.[CreatedByName],
        T.[CreatedByEmail],
        T.[TaskSubject],
        T.[TaskDesc],
        T.[InitialTargetDate],
        T.[CurrentTargetDate],
        T.[AssignerName],
        T.[AssignerEmail],
        T.[AssigneeName],
        T.[AssigneeEmail],
        CASE
            WHEN T.[StatusId] <> 3 THEN
            CASE
                WHEN DATEADD(MINUTE ,300, T.[CurrentTargetDate]) > GETUTCDATE() THEN
                    CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, T.[CurrentTargetDate])) AS NVARCHAR(50)) + ' days remaining'
                WHEN DATEADD(MINUTE ,300, T.[CurrentTargetDate]) = GETUTCDATE() THEN
                    CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, T.[CurrentTargetDate])) AS NVARCHAR(50)) + ' due today'
                ELSE
                    CAST(DATEDIFF(DAY, DATEADD(MINUTE ,300, T.[CurrentTargetDate]), GETUTCDATE()) AS NVARCHAR(50)) + ' days overdue'
                END
            ELSE '-'
        END AS 'ElapsedDays'
    FROM [dbo].[Trn_TaskDetails] T WITH(NOLOCK)

    INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId

    INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId

    INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId

    LEFT OUTER JOIN @temp_table temp ON temp.TaskId = T.TaskId

    WHERE
    (
        [AssignerEmail] = @LoggedInUserEmail
        OR [AssigneeEmail] = @LoggedInUserEmail
        OR [CoordinatorEmail] = @LoggedInUserEmail
        OR [CollaboratorEmail] = @LoggedInUserEmail
    )

    AND (@StatusId IS NULL OR T.[StatusId] = @StatusId)
    AND (@PriorityId IS NULL OR T.[PriorityId] = @PriorityId)
    AND (@RoleId IS NULL OR T.[RoleId] = @RoleId)
    --AND (@ParentTaskId IS NULL OR T.[ParentTaskId] = @ParentTaskId)
    AND (@TaskSubject IS NULL OR T.[TaskSubject] = @TaskSubject)
    AND (@FromDate IS NULL OR T.[CurrentTargetDate] >= @FromDate)
    AND (@ToDate IS NULL OR T.[CurrentTargetDate] <= @ToDate)

    ORDER BY T.[CurrentTargetDate]

END
