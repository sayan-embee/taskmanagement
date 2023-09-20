CREATE PROCEDURE [dbo].[usp_MstStatus_GetAll]

AS
BEGIN

	SELECT
		TS.StatusId
		,TS.StatusName
		,TS.StatusCode
		,TS.SortOrder
	FROM dbo.[Mst_TaskStatus] TS WITH (NOLOCK)
	ORDER BY TS.SortOrder ASC

END