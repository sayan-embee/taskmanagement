CREATE PROCEDURE [dbo].[usp_FileExtension_Update]
	@Id INT,
	@Name NVARCHAR(100),
	@Active BIT,
	@UpdatedBy NVARCHAR(100)=NULL,
	@UpdatedByEmail NVARCHAR(100)=NULL
AS
BEGIN

	IF EXISTS(SELECT 1 FROM dbo.[Mst_FileExtension] WITH(NOLOCK) WHERE ExtName=@Name AND ExtId!=@Id)
	BEGIN
		SELECT 
			'Duplicate File Extension'	AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END

	UPDATE dbo.[Mst_FileExtension]
	SET ExtName=@Name,
		Active=@Active,
		UpdatedBy=@UpdatedBy,
		UpdatedByEmail=@UpdatedByEmail,
		UpdatedOn=GETUTCDATE()
	WHERE ExtId=@Id
	
	IF @@ERROR<>0
	BEGIN
		SELECT 
			'Something went wrong, unable to update File Extension'	AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END

	SELECT 
		'File Extension updated successfully'			AS	[Message],
		''								AS ErrorMessage,
		1								AS [Status],
		@Id						AS Id,
		'1'							AS ReferenceNo
END
