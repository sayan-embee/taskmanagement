CREATE PROCEDURE [dbo].[usp_FileExtension_GetAll]
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
	ORDER BY ExtName

END