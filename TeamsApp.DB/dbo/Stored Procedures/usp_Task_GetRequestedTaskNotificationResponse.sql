CREATE PROCEDURE [dbo].[usp_Task_GetRequestedTaskNotificationResponse]
(
    @TaskId BIGINT = NULL,
	@Status NVARCHAR(50) = NULL
)
AS
BEGIN

	DECLARE @JSONString NVARCHAR(MAX) = NULL;

	IF(@TaskId IS NOT NULL AND @TaskId > 0)
    BEGIN

        BEGIN TRANSACTION       

		IF EXISTS (SELECT R.ReqNotificationId FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK) WHERE R.TaskId = @TaskId AND R.IsActive = 1)
        BEGIN
            
            SET @JSONString = (
                SELECT
                R.ReqNotificationId,
                R.ServiceUrl,
                R.ConversationId,
                R.ActivityId
                FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK)
                WHERE R.ReqNotificationId IN (SELECT R.ReqNotificationId FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK) WHERE R.TaskId = @TaskId AND R.IsActive = 1)
            FOR JSON AUTO
            );

            UPDATE R
                SET R.IsActive = 0,
                R.[Status] = @Status
            FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK)
            WHERE R.ReqNotificationId IN (SELECT R.ReqNotificationId FROM [dbo].[Trn_RequestedTaskNotificationResponse] R WITH(NOLOCK) WHERE R.TaskId = @TaskId AND R.IsActive = 1)

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

        COMMIT TRANSACTION
        SELECT 
        'Insert executed'          AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        ''				           AS Id,
        @JSONString				   AS ReferenceNo

	END

END
