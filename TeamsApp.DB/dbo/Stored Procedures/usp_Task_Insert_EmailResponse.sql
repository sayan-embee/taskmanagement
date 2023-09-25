CREATE PROCEDURE [dbo].[usp_Task_Insert_EmailResponse]
(
	@udt_EmailResponse udt_TaskEmailResponse NULL READONLY
)
AS 
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
