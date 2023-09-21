CREATE TABLE [dbo].[Trn_TaskEmailNotification]
(
	[EmailNotificationId] INT NOT NULL PRIMARY KEY IDENTITY,
	[TaskId] BIGINT NULL,
	[EmailSubject] NVARCHAR(MAX) NULL,
	[EmailBody] NVARCHAR(MAX) NULL,
	[ToRecipient] NVARCHAR(MAX) NULL,
	[CcRecipient] NVARCHAR(MAX) NULL,
	[FromRecipient] NVARCHAR(MAX) NULL,
	[Status] NVARCHAR(50) NULL,
    [IsSent] BIT NULL,
	[CreatedOnIST] DATETIME NULL, 
	[CreatedOnUTC] DATETIME NULL, 
)
