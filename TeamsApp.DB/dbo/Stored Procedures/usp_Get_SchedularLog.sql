CREATE PROCEDURE [dbo].[usp_Get_SchedularLog]
(
	@FromDate DATETIME = NULL,
	@ToDate DATETIME = NULL,
	@TriggerCode NVARCHAR(50),
    @Type NVARCHAR(50)
)
AS
BEGIN
    
    IF (@Type = 'CHECK')
    BEGIN
	    SELECT TOP 1
            [RunId],
            [IsSuccess],
            [Message],
            [CreatedOnIST],
            [CreatedOnUTC],
            [ExecutionTimeInSecs],
            [TriggerCode],
            [ReferenceInfo]
        FROM [dbo].[Trn_SchedularLog] WITH(NOLOCK)
        WHERE TriggerCode = @TriggerCode
        AND CONVERT(DATE, [CreatedOnIST], 103) = CONVERT(DATE, (DATEADD(MINUTE, 330, GETUTCDATE())), 103)
        ORDER BY [CreatedOnIST] DESC
    END

	IF (@Type = 'GET')
    BEGIN
	    SELECT
            [RunId],
            [IsSuccess],
            [Message],
            [CreatedOnIST],
            [CreatedOnUTC],
            [ExecutionTimeInSecs],
            [TriggerCode],
            [ReferenceInfo]
        FROM [dbo].[Trn_SchedularLog] WITH(NOLOCK)
        WHERE TriggerCode = @TriggerCode
        AND (@FromDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) >= CONVERT(DATE, @FromDate, 103))
        AND (@ToDate IS NULL OR CONVERT(DATE, [CreatedOnIST], 103) <= CONVERT(DATE, @ToDate, 103))
    END

END
