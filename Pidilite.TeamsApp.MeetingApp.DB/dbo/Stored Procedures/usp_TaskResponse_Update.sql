CREATE PROCEDURE [dbo].[usp_TaskResponse_Update]
	@Id BIGINT = NULL
AS
BEGIN
	BEGIN TRANSACTION
			UPDATE dbo.[TaskNotificationResponseDetails] 
			SET Active = 0
			WHERE TaskId = @Id
			IF @@ERROR<>0
			BEGIN
		    ROLLBACK TRANSACTION
		    SELECT 
			    'Something went wrong, unable to add meeting occurrence'	AS [Message],
			    ''						AS ErrorMessage,
			    0						AS [Status],
			    @Id				AS Id,
			    ''						AS ReferenceNo
		    RETURN 
	    END

	COMMIT TRANSACTION
	SELECT 
		'Response updated successfully'							AS	[Message],
		''																						AS ErrorMessage,
		1																						AS [Status],
		@Id																				AS Id,
		''																						AS ReferenceNo
END
