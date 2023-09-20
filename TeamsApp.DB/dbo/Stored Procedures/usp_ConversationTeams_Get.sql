CREATE PROCEDURE [dbo].[usp_ConversationTeams_Get]
(
	@ConversationId NVARCHAR(200)=NULL,
	@TeamId NVARCHAR(200)=NULL,
	@TeamAadGroupId NVARCHAR(200)=NULL,
	@AppName NVARCHAR(50)=NULL
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
		V.TenantId,
		V.AppName,
		v.TeamAadGroupId,
		v.TeamId,
		v.TeamName

	FROM dbo.Trn_ConversationsTeams V 
	WHERE V.ConversationId=CASE WHEN ISNULL(@ConversationId,'')='' THEN  V.ConversationId ELSE @ConversationId END
	AND V.TeamId=CASE WHEN @TeamId IS NULL  THEN  V.TeamId ELSE @TeamId END
	AND V.TeamAadGroupId=CASE WHEN @TeamAadGroupId IS NULL  THEN  V.TeamAadGroupId ELSE @TeamAadGroupId END
	AND V.AppName=CASE WHEN @AppName IS NULL  THEN  V.AppName ELSE @AppName END
END
