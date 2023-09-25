CREATE PROCEDURE [dbo].[usp_Emails_GetByTaskIdList]
(
	@TaskIdList NVARCHAR(MAX)
)
AS
BEGIN

	SELECT 
        [EmailNotificationId],
        [TaskId],
        [EmailSubject],
        [EmailBody],
        [ToRecipient],
        [CcRecipient],
        [FromRecipient],
        [Status],
        [IsSent],
        [CreatedOnIST],
        [CreatedOnUTC],
        [TransactionId]
    FROM [dbo].[Trn_TaskEmailNotification]
    WHERE [TaskId] IN (
        SELECT CAST(value AS BIGINT)
        FROM STRING_SPLIT(@TaskIdList, ',')
    );

END
