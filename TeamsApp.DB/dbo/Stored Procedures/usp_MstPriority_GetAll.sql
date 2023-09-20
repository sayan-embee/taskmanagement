CREATE PROCEDURE [dbo].[usp_MstPriority_GetAll]

AS
BEGIN

	SELECT
		TP.PriorityId
		,TP.PriorityName
		,TP.PriorityCode
		,TP.SortOrder
	FROM dbo.[Mst_TaskPriority] TP WITH (NOLOCK)
	ORDER BY TP.SortOrder ASC

END
