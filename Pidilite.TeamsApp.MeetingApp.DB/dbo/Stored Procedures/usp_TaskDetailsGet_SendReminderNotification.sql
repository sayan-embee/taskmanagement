CREATE PROCEDURE [dbo].[usp_TaskDetailsGet_SendReminderNotification]
AS
DECLARE @reminderDay DATETIME  = NULL;
BEGIN
SET @reminderDay = DATEADD(day, 2, GETDATE());
SELECT
	TD.TaskId
	,TD.MeetingId
	,TD.TaskContext
	,TD.TaskClosureDate
	,TD.TaskPriority
	,TD.ActionTakenBy
	,TD.AssignedTo
	,TD.AssignedToADID
	,TD.TaskStatus
	FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
	WHERE
	-- to check whether task closure date matches with the reminder day
	(CONVERT(DATE, TD.TaskClosureDate, 103)) = (CONVERT(DATE, @reminderDay, 103))
	AND
	-- to check whether task is closed or not
	TD.TaskStatus != 'Closed'
	AND
	-- to check whether task is present or not in task response table on today's date
	TD.TaskId NOT IN
	(
		SELECT TaskId FROM dbo.[TaskNotificationResponseDetails] WITH(NOLOCK) 
		WHERE (CONVERT(DATE, NotificationDateTime, 103)) = (CONVERT(DATE, GETDATE(), 103))
		AND Active = 1
		AND [Status] = 'Reminder'
	)

END