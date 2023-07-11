CREATE TABLE [dbo].[TaskNotificationResponseDetails]
(
	[NotificationId] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
    [TaskId] BIGINT NULL, 
    [MeetingId] BIGINT NULL, 
    [ActivityId] NVARCHAR(50) NULL, 
    [UserADID] NVARCHAR(50) NULL, 
    [UserName] NVARCHAR(50) NULL, 
    [Status] NVARCHAR(50) NULL, 
    [ConversationId] NVARCHAR(300) NULL, 
    [ReplyToId] NVARCHAR(50) NULL, 
    [ServiceUrl] NVARCHAR(100) NULL, 
    [Active] BIT NULL,
    [NotificationDateTime] DATETIME NULL, 
    [NotificationDateTimeUTC] DATETIME NULL
)
