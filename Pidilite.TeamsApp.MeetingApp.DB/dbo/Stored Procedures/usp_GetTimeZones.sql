CREATE PROCEDURE [dbo].[usp_GetTimeZones]
AS
BEGIN
	
SELECT TimeZoneId AS Id
,TimeZoneName AS [Name]
,TimeZoneDescription AS [Description]	
FROM Mst_TimeZone WITH(NOLOCK)
ORDER BY SortOrder

END