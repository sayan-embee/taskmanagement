CREATE PROCEDURE [dbo].[usp_Emails_GetByRequestIdList]
(
	@RequestIdList NVARCHAR(MAX)
)
AS
BEGIN

	SELECT 
        [ReqEmailNotificationId],
        TE.[TaskId],
        TE.[RequestId],
        [EmailSubject],
        [EmailBody],
        [ToRecipient],
        [CcRecipient],
        [FromRecipient],
        [Status],
        [IsSent],
        TE.[CreatedOnIST],
        TE.[CreatedOnUTC],
        TE.[TransactionId],
        CASE WHEN CONVERT(DATE,DATEADD(MINUTE, 330, GETUTCDATE()),103) > (CONVERT(DATE, TD.CurrentTargetDate, 103)) AND TD.StatusId != 3 THEN 1 ELSE 0 END AS 'IsOverdue'
    FROM [dbo].[Trn_RequestedTaskEmailNotification] TE WITH(NOLOCK)
    INNER JOIN [dbo].[Trn_TaskDetails] TD WITH(NOLOCK) ON TD.TaskId = TE.TaskId
    WHERE TE.[TaskId] IN (
        SELECT CAST(value AS INT)
        FROM STRING_SPLIT(@RequestIdList, ',')
    )
    AND TE.IsSent IS NULL

END
