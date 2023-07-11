CREATE PROCEDURE [dbo].[usp_Conversation_Get]
(
	@ConversationId NVARCHAR(200)=NULL,
	@UserId UNIQUEIDENTIFIER =NULL
)
AS
BEGIN
	SELECT 
		V.ActivityId,
		V.BotInstalledOn,
		V.ConversationId,
		V.RecipientId,
		V.RecipientName,
		V.ServiceUrl,
		V.UserEmail,
		V.TenantId,
		V.UserId,
		V.UserName,
		V.UserPrincipalName

	FROM dbo.Trn_Conversations V WITH(NOLOCK)
	WHERE V.ConversationId=CASE WHEN ISNULL(@ConversationId,'')='' THEN  V.ConversationId ELSE @ConversationId END
	--AND V.UserId=CASE WHEN ISNULL(@UserId,'')='' THEN  V.UserId ELSE @UserId END
	AND V.UserId=CASE WHEN @UserId IS NULL  THEN  V.UserId ELSE @UserId END

END