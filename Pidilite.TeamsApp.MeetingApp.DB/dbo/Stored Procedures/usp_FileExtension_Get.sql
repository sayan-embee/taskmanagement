CREATE PROCEDURE [dbo].[usp_FileExtension_Get]
	@Id INT 
AS
BEGIN

	SELECT 
		ExtId,
		ExtName,
		Active,
		CreatedBy,
		CreatedByEmail,
		CreatedOn,
		UpdatedBy,
		UpdatedByEmail,
		UpdatedOn
	FROM dbo.Mst_FileExtension WITH(NOLOCK)
	WHERE ExtId=@Id

END
