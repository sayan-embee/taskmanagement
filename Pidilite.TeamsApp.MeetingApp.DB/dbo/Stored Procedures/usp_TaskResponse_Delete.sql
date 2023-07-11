CREATE PROCEDURE [dbo].[usp_TaskResponse_Delete]
	@Id BIGINT = NULL
AS
BEGIN
	BEGIN TRANSACTION
			DELETE FROM dbo.[TaskNotificationResponseDetails] WHERE TaskId = @Id
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
		'Response deleted successfully'							AS	[Message],
		''																						AS ErrorMessage,
		1																						AS [Status],
		@Id																				AS Id,
		''																						AS ReferenceNo
END