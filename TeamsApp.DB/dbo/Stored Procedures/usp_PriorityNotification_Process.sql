CREATE PROCEDURE [dbo].[usp_PriorityNotification_Process]
(
	@FromDate DATETIME = NULL,
	@ToDate DATETIME = NULL
)
AS
BEGIN

	DECLARE @temp_table TABLE
	(
	  TaskId INT DEFAULT 0,
	  PriorityId INT DEFAULT 0,
	  CurrentTargetDate DATETIME NULL,
	  ElapsedDays NVARCHAR(50) NULL,
	  IsOverdue BIT NULL
	)

	DECLARE @TodayDate DATETIME = CONVERT(DATE, (DATEADD(MINUTE, 330, GETUTCDATE())), 103);

	DECLARE @High_AlertDays INT = 0;
	DECLARE @Medium_AlertDays INT = 0;
	DECLARE @Low_AlertDays INT = 0;

	SET @High_AlertDays = ISNULL((SELECT P.NotificationDays FROM dbo.[Mst_TaskPriority] P WITH(NOLOCK) WHERE P.PriorityId = 1),0)
	SET @Medium_AlertDays = ISNULL((SELECT P.NotificationDays FROM dbo.[Mst_TaskPriority] P WITH(NOLOCK) WHERE P.PriorityId = 2),0)
	SET @Low_AlertDays = ISNULL((SELECT P.NotificationDays FROM dbo.[Mst_TaskPriority] P WITH(NOLOCK) WHERE P.PriorityId = 3),0)

	DECLARE @High_AlertDate DATETIME = CONVERT(DATE, (DATEADD(MINUTE, 330, GETUTCDATE())) + @High_AlertDays, 103);
	DECLARE @Medium_AlertDate DATETIME = CONVERT(DATE, (DATEADD(MINUTE, 330, GETUTCDATE())) + @Medium_AlertDays, 103);
	DECLARE @Low_AlertDate DATETIME = CONVERT(DATE, (DATEADD(MINUTE, 330, GETUTCDATE())) + @Low_AlertDays, 103);

	--SELECT @High_AlertDate;
	--SELECT @Medium_AlertDate;
	--SELECT @Low_AlertDate;

	INSERT INTO @temp_table
	(
		TaskId,
		PriorityId,
		CurrentTargetDate,
		ElapsedDays,
		IsOverdue
	)
	SELECT
		TD.TaskId,
		TD.PriorityId,
		TD.CurrentTargetDate,
		CASE
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) > CONVERT(DATE, GETUTCDATE(), 103) THEN
			CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, TD.[CurrentTargetDate])) AS NVARCHAR(50)) + ' day(s) remaining'
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) = CONVERT(DATE, GETUTCDATE(), 103) THEN
			CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, TD.[CurrentTargetDate])) AS NVARCHAR(50)) + ' day(s) remaining / due today'
		ELSE
			CAST(DATEDIFF(DAY, DATEADD(MINUTE ,300, TD.[CurrentTargetDate]), GETUTCDATE()) AS NVARCHAR(50)) + ' day(s) overdue'
		END AS 'ElapsedDays',
		CASE
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) > CONVERT(DATE, GETUTCDATE(), 103) THEN 0
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) = CONVERT(DATE, GETUTCDATE(), 103) THEN 0
		ELSE 1
		END AS 'IsOverdue'
	FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
	WHERE TD.StatusId != 3
	AND TD.PriorityId = 3
	AND @Low_AlertDate >= (CONVERT(DATE, Td.CurrentTargetDate, 103)) 
	AND (@FromDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) >= CONVERT(DATE, @FromDate, 103))
    AND (@ToDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) <= CONVERT(DATE, @ToDate, 103))

	INSERT INTO @temp_table
	(
		TaskId,
		PriorityId,
		CurrentTargetDate,
		ElapsedDays,
		IsOverdue
	)
	SELECT
		TD.TaskId,
		TD.PriorityId,
		TD.CurrentTargetDate,
		CASE
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) > CONVERT(DATE, GETUTCDATE(), 103) THEN
			CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, TD.[CurrentTargetDate])) AS NVARCHAR(50)) + ' day(s) remaining'
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) = CONVERT(DATE, GETUTCDATE(), 103) THEN
			CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, TD.[CurrentTargetDate])) AS NVARCHAR(50)) + ' day(s) remaining / due today'
		ELSE
			CAST(DATEDIFF(DAY, DATEADD(MINUTE ,300, TD.[CurrentTargetDate]), GETUTCDATE()) AS NVARCHAR(50)) + ' day(s) overdue'
		END AS 'ElapsedDays',
		CASE
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) > CONVERT(DATE, GETUTCDATE(), 103) THEN 0
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) = CONVERT(DATE, GETUTCDATE(), 103) THEN 0
		ELSE 1
		END AS 'IsOverdue'
	FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
	WHERE TD.StatusId != 3
	AND TD.PriorityId = 2
	AND @Medium_AlertDate >= (CONVERT(DATE, Td.CurrentTargetDate, 103))
	AND (@FromDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) >= CONVERT(DATE, @FromDate, 103))
    AND (@ToDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) <= CONVERT(DATE, @ToDate, 103))

	INSERT INTO @temp_table
	(
		TaskId,
		PriorityId,
		CurrentTargetDate,
		ElapsedDays,
		IsOverdue
	)
	SELECT
		TD.TaskId,
		TD.PriorityId,
		TD.CurrentTargetDate,
		CASE
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) > CONVERT(DATE, GETUTCDATE(), 103) THEN
			CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, TD.[CurrentTargetDate])) AS NVARCHAR(50)) + ' day(s) remaining'
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) = CONVERT(DATE, GETUTCDATE(), 103) THEN
			CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, TD.[CurrentTargetDate])) AS NVARCHAR(50)) + ' day(s) remaining / due today'
		ELSE
			CAST(DATEDIFF(DAY, DATEADD(MINUTE ,300, TD.[CurrentTargetDate]), GETUTCDATE()) AS NVARCHAR(50)) + ' day(s) overdue'
		END AS 'ElapsedDays',
		CASE
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) > CONVERT(DATE, GETUTCDATE(), 103) THEN 0
		WHEN CONVERT(DATE, (DATEADD(MINUTE ,300, TD.[CurrentTargetDate])), 103) = CONVERT(DATE, GETUTCDATE(), 103) THEN 0
		ELSE 1
		END AS 'IsOverdue'
	FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
	WHERE TD.StatusId != 3
	AND TD.PriorityId = 1
	AND @High_AlertDate >= (CONVERT(DATE, Td.CurrentTargetDate, 103))
	AND (@FromDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) >= CONVERT(DATE, @FromDate, 103))
    AND (@ToDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) <= CONVERT(DATE, @ToDate, 103))




	IF EXISTS (SELECT * FROM @temp_table)
	BEGIN
		
		UPDATE TD
		SET TD.OverdueDays = ISNULL(TD.OverdueDays,0) + 1,
		TD.OverdueDaysUpdatedOn = @TodayDate
		FROM dbo.[Trn_TaskDetails] TD
		INNER JOIN @temp_table temp ON temp.TaskId = TD.TaskId
		WHERE ISNULL(temp.IsOverdue, 0) = 1
		AND (TD.OverdueDays IS NULL OR
		NOT EXISTS (SELECT 1 FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = TD.TaskId AND CONVERT(DATE, OverdueDaysUpdatedOn, 103) = @TodayDate))


		UPDATE TD
		SET TD.NoOfTargetDateMissed = CASE WHEN TD.NoOfTargetDateMissed IS NULL THEN 1 
										WHEN TD.NoOfTargetDateMissed IS NOT NULL THEN
											CASE WHEN @TodayDate > CONVERT(DATE, TD.CurrentTargetDate, 103) AND CONVERT(DATE, TD.CurrentTargetDate, 103) > TD.LastMissedTargetDate THEN TD.NoOfTargetDateMissed + 1 END
											ELSE TD.NoOfTargetDateMissed
										END,
		TD.LastMissedTargetDate = CASE WHEN TD.NoOfTargetDateMissed IS NULL THEN TD.CurrentTargetDate 
										WHEN TD.NoOfTargetDateMissed IS NOT NULL THEN
											CASE WHEN @TodayDate > CONVERT(DATE, TD.CurrentTargetDate, 103) AND CONVERT(DATE, TD.CurrentTargetDate, 103) > TD.LastMissedTargetDate THEN TD.CurrentTargetDate END
											ELSE TD.LastMissedTargetDate
										END
		FROM dbo.[Trn_TaskDetails] TD
		INNER JOIN @temp_table temp ON temp.TaskId = TD.TaskId
		WHERE ISNULL(temp.IsOverdue, 0) = 1

	END



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
		T.[CurrentTargetDate],
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
		temp.IsOverdue,
		temp.ElapsedDays
	FROM @temp_table temp
	INNER JOIN [dbo].[Trn_TaskDetails] T WITH(NOLOCK) ON temp.TaskId = T.TaskId
	INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId
    INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId
    INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId
    LEFT JOIN [dbo].[Trn_TaskProgressDetails] PR ON PR.TaskId = T.TaskId AND PR.TransactionId = T.TransactionId
	
END
