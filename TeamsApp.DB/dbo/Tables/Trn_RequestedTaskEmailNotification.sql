CREATE TABLE [dbo].[Trn_RequestedTaskEmailNotification]
(
	[ReqEmailNotificationId] INT NOT NULL PRIMARY KEY IDENTITY,
	[RequestId] INT NULL,
	[TaskId] BIGINT NULL,
	[TransactionId] UNIQUEIDENTIFIER NULL,
	[EmailSubject] NVARCHAR(MAX) NULL,
	[EmailBody] NVARCHAR(MAX) NULL,
	[ToRecipient] NVARCHAR(MAX) NULL,
	[CcRecipient] NVARCHAR(MAX) NULL,
	[FromRecipient] NVARCHAR(MAX) NULL,
	[Status] NVARCHAR(50) NULL,
    [IsSent] BIT NULL,
	[CreatedOnIST] DATETIME NULL, 
	[CreatedOnUTC] DATETIME NULL, 
	[SentOnIST] DATETIME NULL, 
	[SentOnUTC] DATETIME NULL
)
