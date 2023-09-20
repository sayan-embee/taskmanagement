CREATE PROCEDURE [dbo].[usp_Check_MeetingDetailsBeforeUpdate]
	@SeriesMasterId NVARCHAR(500)=NULL
AS
BEGIN
	IF EXISTS (SELECT MeetingId FROM Trn_MeetingDetails WHERE SeriesMasterId = @SeriesMasterId AND IsConducted = 1 AND IsActive = 1)
	BEGIN
		SELECT
		MeetingId
		,ParentMeetingId
		,EventId
		,StartDateTime
		,EndDateTime
		FROM dbo.[Trn_MeetingDetails]
		WHERE SeriesMasterId = @SeriesMasterId 
		AND IsConducted = 0 
		AND IsActive = 1
	END
END
