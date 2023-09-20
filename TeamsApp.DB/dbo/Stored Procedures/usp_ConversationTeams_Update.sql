CREATE PROCEDURE [dbo].[usp_ConversationTeams_Update]
	@ActivityId NVARCHAR(200)=NULL,
	@ConversationId  NVARCHAR(200),
	@ServiceUrl NVARCHAR(200)=NULL,
	@TeamId  NVARCHAR(200)=NULL,
	@TeamName NVARCHAR(100)=NULL,
	@TeamAadGroupId NVARCHAR(100)=NULL,
	@BotInstalledOn DATETIME NULL,
	@AppName NVARCHAR(100)=NULL,
	@Active BIT =1
AS
BEGIN

	UPDATE dbo.[Trn_ConversationsTeams]
	SET ActivityId=@ActivityId,
		ServiceUrl=@ServiceUrl,
		TeamId=@TeamId,
		TeamName=@TeamName,
		BotInstalledOn=DATEADD(minute,330,GETUTCDATE()),
		TeamAadGroupId=@TeamAadGroupId,
		AppName=@AppName,
		Active=@Active,
		ConversationId=@ConversationId
	WHERE TeamId=@TeamId and AppName=@AppName
	
	IF @@ERROR<>0
	BEGIN
		SELECT 
			'Something went wrong, unable to update conversation'	AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END

	SELECT 
		'Conversation data updated successfully!'			AS	[Message],
		''								AS ErrorMessage,
		1								AS [Status],
		@ConversationId								AS Id,
		@ConversationId					AS ReferenceNo
END
