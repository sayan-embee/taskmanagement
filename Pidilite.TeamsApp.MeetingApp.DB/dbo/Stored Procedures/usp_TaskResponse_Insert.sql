CREATE PROCEDURE [dbo].[usp_TaskResponse_Insert]
    @Response UDT_TaskNotificationResponse READONLY
AS
    BEGIN
    DECLARE @NotificationId BIGINT = NULL
     BEGIN TRANSACTION
        INSERT INTO dbo.[TaskNotificationResponseDetails]
        (
        TaskId
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
        )
        SELECT
        TaskId
        ,MeetingId
        ,ActivityId
        ,UserADID
        ,UserName
        ,[Status]
        ,ConversationId
        ,ReplyToId
        ,ServiceUrl
        ,1
        ,(GETUTCDATE() AT TIME ZONE 'UTC' AT TIME ZONE TimeZone)
        ,GETUTCDATE()
        FROM @Response

        IF @@ERROR<>0
	    BEGIN
		    ROLLBACK TRANSACTION
		    SELECT 
			    'Something went wrong, unable to add task notification response'               AS [Message],
			    ''						                                                                            AS ErrorMessage,
			    0						                                                                            AS [Status],
			    0					                                                                                AS Id,
			    ''						                                                                            AS ReferenceNo
		    RETURN 
	    END

     SET @NotificationId = @@IDENTITY
     COMMIT TRANSACTION
    SELECT 
		'Task notification response inserted successfully'       AS  [Message],
		''								                                              AS ErrorMessage,
		1								                                              AS [Status],
		@NotificationId					                              AS Id,
        ''                                                                           AS ReferenceNo
END

