CREATE PROCEDURE [dbo].[usp_Task_Remove_FileResponse]
(
	@Id BIGINT = NULL
)
AS 
BEGIN

	DECLARE @JSONString NVARCHAR(MAX) = NULL;

	IF EXISTS (SELECT * FROM [dbo].[Trn_TaskFileDetails] F WITH(NOLOCK) WHERE @Id IS NOT NULL AND @Id > 0 AND F.FileId = @Id AND F.IsActive = 1)
	BEGIN

		BEGIN TRANSACTION
		
		UPDATE [dbo].[Trn_TaskFileDetails]
		SET
		IsActive = 0
		WHERE FileId = @Id

		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Invalid Id / File not found' AS [Message],
				''					          AS ErrorMessage,
				0						      AS [Status],
				@Id				              AS Id,
				''						      AS ReferenceNo
			RETURN
		END


		SET @JSONString = (
			SELECT
				[FileId],
				[TaskId],
				[RoleId],
				[FileName],
				[UnqFileName],
				[FileDesc],
				[FileUrl],
				[FileSize],
				[ContentType],
				[IsActive],
				[CreatedOnIST],
				[CreatedOnUTC],
				[CreatedByName],
				[CreatedByEmail],
				[CreatedByUPN],
				[CreatedByADID],
				[UpdatedOnIST],
				[UpdatedOnUTC],
				[UpdatedByName],
				[UpdatedByEmail],
				[UpdatedByUPN],
				[UpdatedByADID],
				[TransactionId]
				FROM [dbo].[Trn_TaskFileDetails] WITH(NOLOCK)
				WHERE TaskId = @Id AND IsActive = 1 
			ORDER BY [FileId] DESC
		FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
		);

		COMMIT TRANSACTION
		SELECT 
			'File removed'				 AS [Message],
			''						     AS ErrorMessage,
			1					         AS [Status],
			@Id							 AS Id,
			@JSONString					 AS ReferenceNo

	END
	ELSE
	BEGIN
		SELECT 
            'Invalid Id / File not found'       AS [Message],
            ''						            AS ErrorMessage,
            0					                AS [Status],
            @Id				                    AS Id,
            ''									AS ReferenceNo
        RETURN
	END

END
