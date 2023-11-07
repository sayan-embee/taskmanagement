﻿CREATE TABLE [dbo].[Trn_RequestedTaskNotificationResponse]
(
	[ReqNotificationId] INT NOT NULL PRIMARY KEY IDENTITY,
	TaskId BIGINT NULL,
	[TransactionId] UNIQUEIDENTIFIER NULL,
	ReplyToId NVARCHAR(100) NULL,
	ActivityId NVARCHAR(100) NULL,
	ConversationId NVARCHAR(500) NULL,
	ServiceUrl NVARCHAR(100) NULL,
	UserName NVARCHAR(100) NULL,
	UserADID NVARCHAR(100) NULL,
	[Status] NVARCHAR(50) NULL,	
	[CreatedOnIST] DATETIME NULL, 
	[CreatedOnUTC] DATETIME NULL, 
    [IsActive] BIT NULL
)
