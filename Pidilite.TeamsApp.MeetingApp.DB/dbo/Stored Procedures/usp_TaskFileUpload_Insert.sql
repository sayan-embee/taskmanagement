CREATE PROCEDURE [dbo].[usp_TaskFileUpload_Insert]

	@TaskReferenceNo UNIQUEIDENTIFIER = NULL,
	@FileUpload UDT_TaskFileUpload READONLY

AS
BEGIN

	DECLARE @FileId BIGINT = NULL
	DECLARE @TaskId BIGINT = ( SELECT TOP 1 TaskId FROM @FileUpload )

	BEGIN TRANSACTION
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

		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to upload files'	AS [Message],
				''												AS ErrorMessage,
				0												AS [Status],
				@TaskReferenceNo			AS Id,
				''												AS ReferenceNo
			RETURN 
		END

		SET @FileId = @@IDENTITY

		IF(@TaskReferenceNo IS NOT NULL)
		BEGIN
		INSERT INTO dbo.[Trn_TaskFileUpload]
	    (
			MeetingId
			,TaskId
			,[FileName]
			,FileUrl
			,ContentType
		)
		SELECT
			FU.MeetingId
			,TD.TaskId
			,FU.[FileName]
			,FU.FileUrl
			,FU.ContentType
		FROM @FileUpload FU, dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
		WHERE TD.TaskReferenceNo = @TaskReferenceNo
		AND TD.TaskId != @TaskId

		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to upload files'	AS [Message],
				''												AS ErrorMessage,
				0												AS [Status],
				@TaskReferenceNo			AS Id,
				''												AS ReferenceNo
			RETURN 
		END
	END

COMMIT TRANSACTION
	SELECT 
		'Files uploded successfully'				AS	[Message],
		''								            AS ErrorMessage,
		1								            AS [Status],
		@FileId								AS Id,
		''					                        AS ReferenceNo
END
