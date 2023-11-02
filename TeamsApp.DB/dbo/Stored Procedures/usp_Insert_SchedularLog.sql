CREATE PROCEDURE [dbo].[usp_Insert_SchedularLog]
(
	@IsSuccess BIT,
    @TriggerCode NVARCHAR(50),
    @ExecutionTimeInSecs INT,
    @ReferenceInfo NVARCHAR(MAX),
    @Message NVARCHAR(MAX)   
)
AS
BEGIN

    BEGIN TRANSACTION

        INSERT INTO [dbo].[Trn_SchedularLog] 
        (
            [IsSuccess],
            [Message],
            [CreatedOnIST],
            [CreatedOnUTC],
            [ExecutionTimeInSecs],
            [TriggerCode],
            [ReferenceInfo]
        )
        VALUES
        (
            @IsSuccess,
            @Message,
            DATEADD(MINUTE, 330, GETUTCDATE()),
            GETUTCDATE(),
            @ExecutionTimeInSecs,
            @TriggerCode,
            @ReferenceInfo
        )

        IF @@ERROR<>0
        BEGIN
	        ROLLBACK TRANSACTION
	        SELECT 
		        'Schedular log failed'  AS [Message],
		        ''					    AS ErrorMessage,
		        0						AS [Status],
		        0				        AS Id,
		        ''						AS ReferenceNo
	        RETURN
        END

    COMMIT TRANSACTION
    SELECT 
        'Schedular log executed'   AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        @@IDENTITY				   AS Id,
        ''				           AS ReferenceNo

END
