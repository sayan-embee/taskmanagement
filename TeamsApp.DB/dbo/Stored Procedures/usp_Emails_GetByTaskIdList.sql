CREATE PROCEDURE [dbo].[usp_Emails_GetByTaskIdList]
(
	@TaskIdList NVARCHAR(MAX)
)
AS
BEGIN

	SELECT 
        [EmailNotificationId],
        TE.[TaskId],
        [EmailSubject],
        [EmailBody],
        [ToRecipient],
        [CcRecipient],
        [FromRecipient],
        [Status],
        [IsSent],
        TE.[CreatedOnIST],
        TE.[CreatedOnUTC],
        TE.[TransactionId]
    FROM [dbo].[Trn_TaskEmailNotification] TE WITH(NOLOCK)
    INNER JOIN [dbo].[Trn_TaskDetails] TD WITH(NOLOCK) ON TD.TaskId = TE.TaskId AND TD.TransactionId = TE.TransactionId
    WHERE TE.[TaskId] IN (
        SELECT CAST(value AS BIGINT)
        FROM STRING_SPLIT(@TaskIdList, ',')
    )
    AND TE.IsSent IS NULL

END
