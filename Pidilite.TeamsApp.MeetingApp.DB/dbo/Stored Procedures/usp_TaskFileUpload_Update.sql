CREATE PROCEDURE [dbo].[usp_TaskFileUpload_Update]
	@FileUpload UDT_TaskFileUpload READONLY
AS
BEGIN

	DECLARE @FileId BIGINT = NULL
	DECLARE @TaskId BIGINT = ( SELECT TaskId FROM @FileUpload )

	BEGIN TRANSACTION

		DELETE FROM dbo.[Trn_TaskFileUpload] WHERE TaskId = @TaskId
		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to update previous files'	AS [Message],
				''														AS ErrorMessage,
				0														AS [Status],
				@TaskId										AS Id,
				''														AS ReferenceNo

			RETURN 
		END

        INSERT INTO dbo.[Trn_TaskFileUpload]
	    (
			MeetingId
			,TaskId
			,[FileName]
			,FileUrl
			,ContentType
		)
		SELECT
			MeetingId
			,TaskId
			,[FileName]
			,FileUrl
			,ContentType
		FROM @FileUpload

		SET @FileId = @@IDENTITY

		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to upload files'	AS [Message],
				''												AS ErrorMessage,
				0												AS [Status],
				@TaskId											AS Id,
				''												AS ReferenceNo

			RETURN 
		END

COMMIT TRANSACTION
	SELECT 
		'Files uploded successfully'				AS	[Message],
		''								            AS ErrorMessage,
		1								            AS [Status],
		@FileId								AS Id,
		''					                        AS ReferenceNo
END

