CREATE TYPE [dbo].[UDT_TaskNotificationResponse] AS TABLE
(
	 TaskId BIGINT NOT NULL DEFAULT 0, 
    MeetingId BIGINT NOT NULL DEFAULT 0, 
    ActivityId NVARCHAR(50) NULL, 
    UserADID NVARCHAR(50) NULL, 
    UserName NVARCHAR(50) NULL, 
    [Status] NVARCHAR(50) NULL,
    ConversationId NVARCHAR(300) NULL, 
    ReplyToId NVARCHAR(50) NULL, 
    ServiceUrl NVARCHAR(100) NULL,
    TimeZone NVARCHAR(100) NULL
)