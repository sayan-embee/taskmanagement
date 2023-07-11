CREATE PROCEDURE [dbo].[usp_FileExtension_Insert]
	@Name NVARCHAR(100),
	@Active BIT,
	@CreatedBy NVARCHAR(100)=NULL,
	@CreatedByEmail NVARCHAR(100)=NULL
AS
BEGIN

	IF EXISTS(SELECT 1 FROM dbo.[Mst_FileExtension] WITH(NOLOCK) WHERE ExtName=@Name)
	BEGIN
		SELECT 
			'Duplicate File Extension'	AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END

	INSERT INTO dbo.[Mst_FileExtension]
	(
		ExtName,Active,CreatedBy,CreatedByEmail,CreatedOn
	)
	VALUES
	(
		@Name,@Active,@CreatedBy,@CreatedByEmail,GETUTCDATE()
	)
	
	IF @@ERROR<>0
	BEGIN
		SELECT 
			'Something went wrong, unable to insert File Extension'		AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END

	SELECT 
		'File Extension inserted successfully'			AS	[Message],
		''								AS ErrorMessage,
		1								AS [Status],
		@@IDENTITY		AS Id,
		'1'							AS ReferenceNo
END
