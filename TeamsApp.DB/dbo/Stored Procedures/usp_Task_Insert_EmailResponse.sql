CREATE PROCEDURE [dbo].[usp_Task_Insert_EmailResponse]
(
	@udt_EmailResponse udt_TaskEmailResponse NULL READONLY
)
AS
BEGIN
	-- FOR REQUESTED TASKS
	IF EXISTS(SELECT * FROM @udt_EmailResponse udt WHERE udt.RequestId IS NOT NULL AND udt.RequestId > 0)
	BEGIN
		UPDATE T
		SET IsSent = udt.IsSent,
		SentOnIST = DATEADD(MINUTE, 330, GETUTCDATE()),
		SentOnUTC = GETUTCDATE()
		FROM [dbo].[Trn_RequestedTaskEmailNotification] T WITH (NOLOCK),
		@udt_EmailResponse udt
		WHERE udt.RequestId > 0 AND T.TaskId = udt.TaskId AND T.RequestId = udt.RequestId
	END
	-- FOR REGULAR TASKS
	ELSE
	BEGIN
		UPDATE T
		SET IsSent = udt.IsSent,
		SentOnIST = DATEADD(MINUTE, 330, GETUTCDATE()),
		SentOnUTC = GETUTCDATE()
		FROM [dbo].[Trn_TaskEmailNotification] T WITH (NOLOCK),
		@udt_EmailResponse udt
		WHERE T.TaskId = udt.TaskId
		AND T.TransactionId = udt.TransactionId
	END

END