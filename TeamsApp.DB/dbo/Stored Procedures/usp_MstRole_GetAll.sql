CREATE PROCEDURE [dbo].[usp_MstRole_GetAll]

AS
BEGIN

	SELECT
		R.RoleId
		,R.RoleName
		,R.RoleCode
	FROM dbo.[Mst_Role] R WITH (NOLOCK)
	ORDER BY R.RoleId ASC

END
