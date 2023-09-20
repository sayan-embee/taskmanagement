CREATE PROCEDURE [dbo].[usp_ConversationTeams_Insert]
@ActivityId NVARCHAR(200)=NULL,
	@ConversationId  NVARCHAR(200),
	@RecipientId  NVARCHAR(200)=NULL,
	@RecipientName  NVARCHAR(200)=NULL,
	@ServiceUrl NVARCHAR(200)=NULL,
	@TenantId  UNIQUEIDENTIFIER=NULL,
	@TeamId   NVARCHAR(200),
	@TeamAadGroupId   NVARCHAR(200),
	@TeamName NVARCHAR(100)=NULL,
	@BotInstalledOn DATETIME NULL,
	@AppName NVARCHAR(100)=NULL
AS
BEGIN
	INSERT INTO dbo.[Trn_ConversationsTeams]
	(
		ActivityId,ConversationId,RecipientId,RecipientName,ServiceUrl,TenantId,BotInstalledOn,AppName,Active,TeamAadGroupId,TeamId,TeamName
	)
	VALUES
	(
		@ActivityId,@ConversationId,@RecipientId,@RecipientName,@ServiceUrl,@TenantId,DATEADD(minute,330,GETUTCDATE()),@AppName,1,@TeamAadGroupId,@TeamId,@TeamName
	)
	
	IF @@ERROR<>0
	BEGIN
		SELECT 
			'Something went wrong, unable to insert Conversation team data'	AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END

	SELECT 
		'Conversation data saved successfully!'			AS	[Message],
		''								AS ErrorMessage,
		1								AS [Status],
		1					AS Id,
		@ConversationId					AS ReferenceNo
END