CREATE PROCEDURE [dbo].[usp_RequestedTask_Insert_NotificationResponse]
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

    DECLARE @JSONString NVARCHAR(MAX) = NULL;

    BEGIN TRANSACTION
    IF EXISTS (SELECT TaskId FROM @udt_NotificationResponse)
    BEGIN

        ---- ADD ALL PREVIOUS NotificationId ID IN A LIST
        --DECLARE @IdList VARCHAR(MAX) = NULL;
        --IF EXISTS(SELECT * FROM @udt_NotificationResponse)
        --BEGIN
        --    ;WITH DATA1 AS 
        --    (
        --        SELECT R.NotificationId
        --        FROM [dbo].[Trn_TaskNotificationResponse] R WITH(NOLOCK), @udt_NotificationResponse udt
        --         WHERE R.TaskId = udt.TaskId AND R.IsActive = 1
        --    )
        --    SELECT @IdList = CONCAT(@IdList,',',NotificationId)
        --    FROM DATA1
        --END       

        SET @JSONString = (
        SELECT
            R.ReqNotificationId,
            R.ServiceUrl,
            R.ConversationId,
            R.ActivityId
        FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK), @udt_NotificationResponse udt
        WHERE R.TaskId = udt.TaskId AND R.IsActive = 1
        FOR JSON AUTO
        );

        
        UPDATE R
        SET R.IsActive = 0
        FROM [dbo].[Trn_RequestedTaskNotificationResponse] R, @udt_NotificationResponse udt
        WHERE R.TaskId = udt.TaskId AND R.IsActive = 1


        INSERT INTO [dbo].[Trn_RequestedTaskNotificationResponse]
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
            @Status,
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

        SET @JSONString = (
        SELECT
            R.ReqNotificationId,
            R.ServiceUrl,
            R.ConversationId,
            R.ActivityId
        FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK), @udt_NotificationResponse udt
        WHERE R.TaskId = @TaskId AND R.IsActive = 1
        FOR JSON AUTO
        );

        UPDATE R
        SET R.IsActive = 0
        FROM [dbo].[Trn_RequestedTaskNotificationResponse] R
        WHERE R.TaskId = @TaskId AND R.IsActive = 1

        INSERT INTO [dbo].[Trn_RequestedTaskNotificationResponse]
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
        @JSONString				   AS ReferenceNo
END
