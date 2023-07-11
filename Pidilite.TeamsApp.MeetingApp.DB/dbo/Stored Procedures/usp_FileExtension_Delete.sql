CREATE PROCEDURE [dbo].[usp_FileExtension_Delete]
	@ExtId INT = NULL
AS
BEGIN
	BEGIN TRANSACTION
		DELETE FROM dbo.[Mst_FileExtension] WHERE ExtId = @ExtId
		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to delete file extension'	AS [Message],
				''																											AS ErrorMessage,
				0																											AS [Status],
				@ExtId																								AS Id,
				''																											AS ReferenceNo
			RETURN 
		END
	COMMIT TRANSACTION
	SELECT 
		'Extension deleted successfully'							AS	[Message],
		''																						AS ErrorMessage,
		1																						AS [Status],
		@ExtId																			AS Id,
		''																						AS ReferenceNo
END