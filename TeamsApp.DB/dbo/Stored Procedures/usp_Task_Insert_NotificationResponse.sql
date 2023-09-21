CREATE PROCEDURE [dbo].[usp_Task_Insert_NotificationResponse]
(
    @ReplyToId NVARCHAR(100) = NULL,
    @ActivityId NVARCHAR(100) = NULL,
    @ConversationId NVARCHAR(500) = NULL,
    @ServiceUrl NVARCHAR(100) = NULL,
    @UserName NVARCHAR(100) = NULL,
    @UserADID NVARCHAR(100) = NULL,
    @Status NVARCHAR(50) = NULL,
    @TaskId BIGINT = NULL,

    @udt_NotificationResponse udt_TaskNotificationResponse NULL READONLY
)
AS
BEGIN
    BEGIN TRANSACTION
    IF EXISTS (SELECT TaskId FROM @udt_NotificationResponse)
    BEGIN
        
        UPDATE T
        SET T.IsActive = 0
        FROM [dbo].[Trn_TaskNotificationResponse] T,
        @udt_NotificationResponse udt
        WHERE T.TaskId = udt.TaskId

        INSERT INTO [dbo].[Trn_TaskNotificationResponse]
        (
            [ReplyToId],
            [ActivityId],
            [ConversationId],
            [ServiceUrl],
            [UserName],
            [UserADID],
            [Status],
            [TaskId],
            CreatedOnIST,
            CreatedOnUTC,
            IsActive
        )
        SELECT
            udt.ReplyToId,
            udt.ActivityId,
            udt.ConversationId,
            udt.ServiceUrl,
            udt.UserName,
            udt.UserADID,
            udt.[Status],
            udt.TaskId,
            DATEADD(MINUTE, 330, GETUTCDATE()),
            GETUTCDATE(),
            1
        FROM @udt_NotificationResponse udt

        IF @@ERROR<>0
        BEGIN
	        ROLLBACK TRANSACTION
	        SELECT 
		        'Insert failed'         AS [Message],
		        ''					    AS ErrorMessage,
		        0						AS [Status],
		        0				        AS Id,
		        ''						AS ReferenceNo
	        RETURN
    END
    END
    ELSE
    BEGIN

        UPDATE T
        SET T.IsActive = 0
        FROM [dbo].[Trn_TaskNotificationResponse] T
        WHERE T.TaskId = @TaskId

        INSERT INTO [dbo].[Trn_TaskNotificationResponse]
        (
            [ReplyToId],
            [ActivityId],
            [ConversationId],
            [ServiceUrl],
            [UserName],
            [UserADID],
            [Status],
            [TaskId]
        )
        VALUES
        (
            @ReplyToId,
            @ActivityId,
            @ConversationId,
            @ServiceUrl,
            @UserName,
            @UserADID,
            @Status,
            @TaskId
        )
    END

    COMMIT TRANSACTION
    SELECT 
        'Insert executed'          AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        @@IDENTITY				   AS Id,
        ''				           AS ReferenceNo
END

