CREATE PROCEDURE [dbo].[usp_TaskResponse_Get]
    @Id BIGINT = 0
AS
BEGIN
    SELECT NotificationId
          ,TaskId
          ,MeetingId
          ,ActivityId
          ,UserADID
          ,UserName
          ,[Status]
          ,ConversationId
          ,ReplyToId
          ,ServiceUrl
          ,Active
          ,NotificationDateTime
          ,NotificationDateTimeUTC
      FROM dbo.[TaskNotificationResponseDetails] WITH(NOLOCK)
      WHERE TaskId = @Id
      AND Active = 1

END

