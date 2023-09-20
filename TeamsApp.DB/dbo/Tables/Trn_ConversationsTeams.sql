CREATE TABLE [dbo].[Trn_ConversationsTeams]
(
	[ConversationId] NVARCHAR(200) NOT NULL PRIMARY KEY, 
    [TeamId] NVARCHAR(200) NOT NULL, 
    [TeamName] NVARCHAR(100) NULL, 
    [TeamAadGroupId] NVARCHAR(100) NULL, 
    [ActivityId] NVARCHAR(200) NOT NULL, 
    [TenantId] UNIQUEIDENTIFIER NULL, 
    [ServiceUrl] NVARCHAR(200) NULL, 
    [BotInstalledOn] DATETIME NULL, 
    [RecipientId] NVARCHAR(200) NULL, 
    [RecipientName] NVARCHAR(100) NULL, 
    [AppName] NVARCHAR(50) NULL, 
    [Active] BIT NULL DEFAULT 1,
    BotRemovedOn DATETIME NULL
)
