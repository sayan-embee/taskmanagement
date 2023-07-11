CREATE TABLE [dbo].[Trn_Conversations]
(
	[ConversationId] NVARCHAR(200) NOT NULL PRIMARY KEY, 
    [UserId] UNIQUEIDENTIFIER NOT NULL, 
    [UserName] NVARCHAR(100) NULL, 
    [UserEmail] NVARCHAR(100) NULL, 
    [ActivityId] NVARCHAR(200) NOT NULL, 
    [TenantId] UNIQUEIDENTIFIER NULL, 
    [ServiceUrl] NVARCHAR(200) NULL, 
    [BotInstalledOn] DATETIME NULL, 
    [RecipientId] NVARCHAR(200) NULL, 
    [RecipientName] NVARCHAR(100) NULL, 
    [UserPrincipalName] NVARCHAR(100) NULL
)
