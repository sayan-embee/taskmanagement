CREATE PROCEDURE [dbo].[usp_MeetingFileUpload_AnchorUpdate]

	@UpdateMeetingId BIGINT = 0,
	@CurrentMeetingId BIGINT = 0,
	@IsSeries BIT = 0,
	@IsMeetingUpdate BIT = 0,
	@FileId BIGINT = NULL,
	@FileUpload UDT_MeetingFileUpload READONLY

AS
BEGIN

	DECLARE @FileReferenceNo AS UNIQUEIDENTIFIER = NEWID()
	DECLARE @MeetingId BIGINT = 0
	SET @MeetingId = ( SELECT TOP 1 MeetingId  FROM @FileUpload )

	IF(ISNULL(@MeetingId,0) = 0)
	BEGIN
		SET @MeetingId = @UpdateMeetingId
	END
	
	BEGIN TRANSACTION

	IF(@IsSeries = 1)
	BEGIN -- @IsSeries = 1

		IF EXISTS ( SELECT TOP 1 MeetingId FROM @FileUpload )
		BEGIN --FILE EXISTS IN @FileUpload
			INSERT INTO dbo.[Trn_MeetingFileUpload]
				(
					MeetingId
					,[FileName]
					,FileUrl
					,FileReferenceNo
					,ContentType					
					,IsActive
				)
				SELECT
					MD.MeetingId
					,FU.[FileName]
					,FU.FileUrl
					,@FileReferenceNo
					,FU.ContentType
					,1
				FROM @FileUpload FU,
				dbo.[Trn_MeetingDetails] MD WITH(NOLOCK)
				WHERE
				(
					MD.MeetingId = @MeetingId
					OR
					MD.ParentMeetingId = @MeetingId
				)
				AND MD.IsActive = 1
			IF @@ERROR<>0
			BEGIN
				ROLLBACK TRANSACTION
				SELECT 
					'Something went wrong, unable to upload files for series update'	AS [Message],
					''												AS ErrorMessage,
					0												AS [Status],
					@MeetingId							AS Id,
					''												AS ReferenceNo
				RETURN 
			END
		END --FILE EXISTS IN @FileUpload
	END -- @IsSeries = 1
	ELSE  
	BEGIN -- @IsSeries = 0
		INSERT INTO dbo.[Trn_MeetingFileUpload]
			(
				MeetingId
				,[FileName]
				,FileUrl
				,ContentType
				,FileReferenceNo
				,IsActive
			)
			SELECT
				MeetingId
				,[FileName]
				,FileUrl
				,ContentType
				,@FileReferenceNo
				,1
			FROM @FileUpload
       
		SET @FileId = @@IDENTITY

		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to upload files for single update'	AS [Message],
				''												AS ErrorMessage,
				0												AS [Status],
				@MeetingId							AS Id,
				''												AS ReferenceNo
			RETURN 
		END
	END  -- @IsSeries = 0

	IF(@IsMeetingUpdate = 1)
		BEGIN --@IsMeetingUpdate = 1
			INSERT INTO dbo.[Trn_MeetingFileUpload]
				(
					MeetingId
					,[FileName]
					,FileUrl
					,FileReferenceNo
					,ContentType
					,IsActive
				)
				SELECT
					MD.MeetingId
					,MFU.[FileName]
					,MFU.FileUrl
					,ISNULL(MFU.FileReferenceNo,@FileReferenceNo)
					,MFU.ContentType
					,1
				FROM dbo.[Trn_MeetingFileUpload] MFU,
				dbo.[Trn_MeetingDetails] MD WITH(NOLOCK)
				WHERE
				MD.IsActive = 1
				AND
				(MD.MeetingId = @CurrentMeetingId OR MD.ParentMeetingId = @CurrentMeetingId)
				AND
				MFU.IsActive = 1
				AND
				MFU.MeetingId =
				(
					SELECT TOP 1 MD2.MeetingId FROM  dbo.[Trn_MeetingDetails] MD2 
					WHERE (MD2.MeetingId = @UpdateMeetingId OR MD2.ParentMeetingId = @UpdateMeetingId)
					AND MD2.IsActive = 1
					AND CONVERT(DATE,MD2.StartDateTime,103) = CONVERT(DATE,MD.StartDateTime,103)
					ORDER BY MD2.UpdatedOn DESC
				)
				ORDER BY MD.MeetingId
			IF @@ERROR<>0
			BEGIN
				ROLLBACK TRANSACTION
				SELECT 
					'Something went wrong, unable to upload files for series update'	AS [Message],
					''												AS ErrorMessage,
					0												AS [Status],
					@MeetingId							AS Id,
					''												AS ReferenceNo
				RETURN 
			END
		END --@IsMeetingUpdate = 1

		-- INACTIVE PREVIOUS ANCHOR MEETINGS
		UPDATE dbo.[Trn_MeetingDetails]
		SET IsActive = 0
		WHERE MeetingId = @UpdateMeetingId OR ParentMeetingId = @UpdateMeetingId AND IsActive=1

	--Meeting Files
	SELECT
	MFU.FileId
	,MFU.MeetingId
	,MFU.[FileName]
	,MFU.FileUrl
	,MFU.ContentType
	FROM dbo.[Trn_MeetingFileUpload] MFU
	WHERE MFU.MeetingId = @MeetingId
	AND MFU.IsActive = 1

	COMMIT TRANSACTION
	SELECT 
	'Files uploaded successfully'				AS	[Message],
	''																	AS ErrorMessage,
	1																	AS [Status],
	@MeetingId												AS Id,
	''																	AS ReferenceNo
END
