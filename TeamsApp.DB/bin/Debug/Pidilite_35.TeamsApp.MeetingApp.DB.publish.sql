﻿/*
Deployment script for PidiliteMeetingAppPhase2

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar DatabaseName "PidiliteMeetingAppPhase2"
:setvar DefaultFilePrefix "PidiliteMeetingAppPhase2"
:setvar DefaultDataPath "C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\"
:setvar DefaultLogPath "C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\"

GO
:on error exit
GO
/*
Detect SQLCMD mode and disable script execution if SQLCMD mode is not supported.
To re-enable the script after enabling SQLCMD mode, execute the following:
SET NOEXEC OFF; 
*/
:setvar __IsSqlCmdEnabled "True"
GO
IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
    BEGIN
        PRINT N'SQLCMD mode must be enabled to successfully execute this script.';
        SET NOEXEC ON;
    END


GO
USE [$(DatabaseName)];


GO
PRINT N'Altering Procedure [dbo].[usp_Dashboard_DivisionHead_MeetingDetails]...';


GO
ALTER PROCEDURE [dbo].[usp_Dashboard_DivisionHead_MeetingDetails]
@DivisionName VARCHAR(100),
	@FromDate DATETIME,
	@ToDate DATETIME
AS
--DECLARE @DivisionName VARCHAR(MAX)= 'Corporate,IT',
--	@FromDate DATETIME,
--	@ToDate DATETIME
--------------------------------
--EXEC usp_Dashboard_DivisionHead_MeetingDetails 'Corporate,IT', NULL, NULL
--------------------------------
BEGIN
DECLARE @MeetingData AS TABLE
	(
		MeetingId BIGINT,
		MeetingTypeId INT,
		TypeName VARCHAR(100),
		MeetingTitleId INT,
		MeetingTitle VARCHAR(500),
		AnchorEmail VARCHAR(100),
		OrganiserEmail VARCHAR(100),
		StartDateTime DATETIME,
		EndDateTime DATETIME,
		DivisionId INT,
		DivisionName VARCHAR(100),
		AnchorDivisionId INT,
		AnchorDivisionName VARCHAR(100),
		VerticalId INT,
		VerticalName VARCHAR(100),
		MeetingStatus VARCHAR(100),
		IsConducted INT
	)
	INSERT INTO @MeetingData
	(
		MeetingId
		,MeetingTypeId
		,TypeName
		,MeetingTitleId
		,MeetingTitle
		,AnchorEmail
		,OrganiserEmail
		,StartDateTime
		,EndDateTime
		,DivisionId 
		,DivisionName
		,AnchorDivisionId
		,AnchorDivisionName
		,VerticalId 
		,VerticalName 
		,MeetingStatus
		,IsConducted
	)
	SELECT 
		MD.MeetingId
		,MD.MeetingTypeId
		,MType.TypeName
		,MD.MeetingTitleId
		,MD.MeetingTitle
		,MD.AnchorEmail
		,MD.OrganiserEmail
		,MD.StartDateTime
		,MD.EndDateTime
		,MD.DivisionId 
		,MD.DivisionName
		,MD.AnchorDivisionId
		,MD.AnchorDivisionName
		,MD.VerticalId 
		,MD.VerticalName 
		,MD.MeetingStatus
		,MD.IsConducted
	FROM dbo.[Trn_MeetingDetails] MD WITH(NOLOCK)
	INNER JOIN dbo.Mst_MeetingType MType ON MD.MeetingTypeId = MType.TypeId
	WHERE (CONVERT(DATE,MD.StartDateTime,103) >= CONVERT(DATE,@FromDate,103) OR @FromDate IS NULL)
    AND (CONVERT(DATE,MD.StartDateTime,103) <= CONVERT(DATE,@ToDate,103) OR @ToDate IS NULL)
    --AND  (MD.AnchorEmail = @UserEmail OR MD.OrganiserEmail = @UserEmail )
	--AND (MD.DivisionName IN (SELECT value FROM STRING_SPLIT(@DivisionName, ',')) OR @DivisionName IS NULL)--@DivisionName
	AND (MD.AnchorDivisionName IN (SELECT value FROM STRING_SPLIT(@DivisionName, ',')) OR @DivisionName IS NULL)--@DivisionName
	--OR 
	--MeetingId IN (SELECT MeetingId FROM Trn_MeetingParticipants P WHERE P.ParticipantEmail = @UserEmail and Active = 1))
	--AND MD.IsActive=1
    ORDER BY MD.StartDateTime,MD.EndDateTime,MD.CreatedOn DESC


	IF (SELECT COUNT(0) FROM @MeetingData)>0
		BEGIN

		--------------------Group By Division Start------------------------
			DECLARE @TEMPDivision AS TABLE
			(		
					DivisionId INT,
					DivisionName VARCHAR(100),
					TotalMeeting INT DEFAULT 0,
					TotalScheduledMeeting INT DEFAULT 0,
					TotalConductedMeetings		 INT DEFAULT 0,
					TotalDocumentUploaded			 INT DEFAULT 0,
					TotalCancelledMeeting			 INT DEFAULT 0
			)

			INSERT INTO @TEMPDivision(DivisionId,DivisionName)
			SELECT DISTINCT DivisionId,DivisionName
			FROM Mst_Division WHERE DivisionName IN (SELECT value FROM STRING_SPLIT(@DivisionName, ',')) OR @DivisionName IS NULL

			UPDATE @TEMPDivision
			SET TotalMeeting=X.CNT
			FROM @TEMPDivision T,

			(SELECT COUNT(*) CNT,AnchorDivisionName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			--WHERE AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail
			GROUP BY AnchorDivisionName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			--WHERE T.DivisionName = X.DivisionName              
			WHERE T.DivisionName = X.AnchorDivisionName
			UPDATE @TEMPDivision
			SET TotalScheduledMeeting=X.CNT
			FROM @TEMPDivision T,
			(SELECT COUNT(*) CNT,AnchorDivisionName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' 
			GROUP BY AnchorDivisionName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.DivisionName = X.AnchorDivisionName   

			UPDATE @TEMPDivision
			SET TotalConductedMeetings=X.CNT
			FROM @TEMPDivision T,
			(SELECT COUNT(*) CNT,AnchorDivisionName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' 
			AND	IsConducted = 1
			GROUP BY AnchorDivisionName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.DivisionName = X.AnchorDivisionName  

			UPDATE @TEMPDivision
			SET TotalDocumentUploaded = X.CNT
			FROM @TEMPDivision T,
			(SELECT COUNT(*) CNT,AnchorDivisionName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData MDET
			INNER JOIN Trn_MeetingFileUpload FU ON MDET.MeetingId = FU.MeetingId
			GROUP BY AnchorDivisionName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId 
			WHERE T.DivisionName = X.AnchorDivisionName   

			UPDATE @TEMPDivision
			SET TotalCancelledMeeting=X.CNT
			FROM @TEMPDivision T,
			(SELECT COUNT(*) CNT,AnchorDivisionName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Cancelled'
			GROUP BY AnchorDivisionName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.DivisionName = X.AnchorDivisionName   
		--------------------Group By Division End------------------------

		--------------------Group By Vertical Start------------------------
		DECLARE @TEMPVertical AS TABLE
			(		
					DivisionId INT,
					DivisionName VARCHAR(100),
					VerticalId INT,
					VerticalName VARCHAR(100),
					TotalMeeting INT DEFAULT 0,
					TotalScheduledMeeting INT DEFAULT 0,
					TotalConductedMeetings		 INT DEFAULT 0,
					TotalDocumentUploaded			 INT DEFAULT 0,
					TotalCancelledMeeting			 INT DEFAULT 0
			)

			INSERT INTO @TEMPVertical(DivisionId,DivisionName,VerticalId,VerticalName)
			SELECT DISTINCT V.DivisionId,DivisionName,VerticalId,VerticalName
			FROM Mst_Vertical V INNER JOIN Mst_Division D ON V.DivisionId = D.DivisionId
			WHERE DivisionName IN (SELECT VALUE FROM STRING_SPLIT(@DivisionName, ',')) OR @DivisionName IS NULL

			UPDATE @TEMPVertical
			SET TotalMeeting=X.CNT
			FROM @TEMPVertical T,

			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			--WHERE AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail
			GROUP BY AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName   

			UPDATE @TEMPVertical
			SET TotalScheduledMeeting=X.CNT
			FROM @TEMPVertical T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' 
			GROUP BY AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName   

			UPDATE @TEMPVertical
			SET TotalConductedMeetings=X.CNT
			FROM @TEMPVertical T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' 
			AND IsConducted = 1
			GROUP BY AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName   

			UPDATE @TEMPVertical
			SET TotalDocumentUploaded = X.CNT
			FROM @TEMPVertical T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData MDET
			INNER JOIN Trn_MeetingFileUpload FU ON MDET.MeetingId = FU.MeetingId
			GROUP BY AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId 
			WHERE T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName   

			UPDATE @TEMPVertical
			SET TotalCancelledMeeting=X.CNT
			FROM @TEMPVertical T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Cancelled'
			GROUP BY AnchorDivisionName,VerticalName--MeetingTypeId,MeetingTitleId
			)
			X
			--WHERE T.MeetingTypeId=X.MeetingTypeId
			--AND T.MeetingTitleId=X.MeetingTitleId
			WHERE T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName  

		--------------------Group By Vertical End------------------------

		--------------------Group By Type of Meeting Start------------------------
		DECLARE @TEMPType AS TABLE
			(	
				DivisionId INT,
				DivisionName VARCHAR(100),
				VerticalId INT,
				VerticalName VARCHAR(100),
				MeetingTypeId INT,
				TypeName VARCHAR(100),
				TotalMeeting INT DEFAULT 0,
				TotalScheduledMeeting INT DEFAULT 0,
				TotalConductedMeetings		 INT DEFAULT 0,
				TotalDocumentUploaded			 INT DEFAULT 0,
				TotalCancelledMeeting			 INT DEFAULT 0
			)

			INSERT INTO @TEMPType(DivisionId,DivisionName,VerticalId,VerticalName,MeetingTypeId,TypeName)
			SELECT DISTINCT D.DivisionId,D.DivisionName,V.VerticalId,V.VerticalName,MT.TypeId AS MeetingTypeId,MT.TypeName
			FROM Mst_MeetingType MT
			INNER JOIN Trn_MeetingDetails MD ON MT.TypeId = MD.MeetingTypeId
			INNER JOIN Mst_Vertical V ON V.VerticalName = MD.VerticalName
			INNER JOIN Mst_Division D ON D.DivisionId = V.DivisionId
			WHERE MD.IsActive=1

			UPDATE @TEMPType
			SET TotalMeeting=X.CNT
			FROM @TEMPType T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			FROM @MeetingData 
			--WHERE AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName			
			--AND T.MeetingTitleId=X.MeetingTitleId

			UPDATE @TEMPType
			SET TotalScheduledMeeting=X.CNT
			FROM @TEMPType T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' 
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName			
			--AND T.MeetingTitleId=X.MeetingTitleId

			UPDATE @TEMPType
			SET TotalConductedMeetings=X.CNT
			FROM @TEMPType T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' AND
			IsConducted = 1
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName				
			--AND T.MeetingTitleId=X.MeetingTitleId

			UPDATE @TEMPType
			SET TotalDocumentUploaded = X.CNT
			FROM @TEMPType T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			FROM @MeetingData MDET
			INNER JOIN Trn_MeetingFileUpload FU ON MDET.MeetingId = FU.MeetingId
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName				
			--AND T.MeetingTitleId=X.MeetingTitleId 

			UPDATE @TEMPType
			SET TotalCancelledMeeting=X.CNT
			FROM @TEMPType T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Cancelled'
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId--,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName					
			--AND T.MeetingTitleId=X.MeetingTitleId
		--------------------Group By Type of Meeting End------------------------


		--------------------Group By Meeting Title Start------------------------
			DECLARE @TEMP AS TABLE
			(	
				DivisionId INT,
				DivisionName VARCHAR(100),
				VerticalId INT,
				VerticalName VARCHAR(100),
				MeetingTypeId INT,
				MeetingTitleId INT,
				TotalMeeting INT DEFAULT 0,
				TotalScheduledMeeting INT DEFAULT 0,
				TotalConductedMeetings		 INT DEFAULT 0,
				TotalDocumentUploaded			 INT DEFAULT 0,
				TotalCancelledMeeting			 INT DEFAULT 0
			)

			INSERT INTO @TEMP(DivisionId,DivisionName,VerticalId,VerticalName,MeetingTypeId,MeetingTitleId)
			SELECT DISTINCT D.DivisionId,D.DivisionName,V.VerticalId,V.VerticalName,MeetingTypeId,MeetingTitleId
			FROM Mst_MeetingTitle MT
			INNER JOIN Mst_Vertical V ON V.VerticalId = MT.VerticalId 
			INNER JOIN Mst_Division D ON D.DivisionId = V.DivisionId


			UPDATE @TEMP
			SET TotalMeeting=X.CNT
			FROM @TEMP T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			--WHERE AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.MeetingTitleId=X.MeetingTitleId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName			

			UPDATE @TEMP
			SET TotalScheduledMeeting=X.CNT
			FROM @TEMP T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' 
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.MeetingTitleId=X.MeetingTitleId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName			

			UPDATE @TEMP
			SET TotalConductedMeetings=X.CNT
			FROM @TEMP T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Scheduled' AND
			IsConducted = 1
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.MeetingTitleId=X.MeetingTitleId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName			

			UPDATE @TEMP
			SET TotalDocumentUploaded = X.CNT
			FROM @TEMP T,
			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			FROM @MeetingData MDET
			INNER JOIN Trn_MeetingFileUpload FU ON MDET.MeetingId = FU.MeetingId
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.MeetingTitleId=X.MeetingTitleId 
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName				

			UPDATE @TEMP
			SET TotalCancelledMeeting=X.CNT
			FROM @TEMP T,

			(SELECT COUNT(*) CNT,AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			FROM @MeetingData 
			WHERE --AnchorEmail = @UserEmail OR OrganiserEmail = @UserEmail AND 
			MeetingStatus = 'Cancelled'
			GROUP BY AnchorDivisionName,VerticalName,MeetingTypeId,MeetingTitleId
			)
			X
			WHERE T.MeetingTypeId=X.MeetingTypeId
			AND T.MeetingTitleId=X.MeetingTitleId
			AND T.VerticalName = X.VerticalName
			AND T.DivisionName = X.AnchorDivisionName   

			--------------------Group By Meeting Title End------------------------

			SELECT * FROM @TEMPDivision
			SELECT * FROM @TEMPVertical
			SELECT * FROM @TEMPType

			SELECT DISTINCT A.*,MT.MeetingTitle--,MDET.VerticalName,MDET.DivisionName--,MP.ParticipantName
			FROM @TEMP A
			INNER JOIN 	Mst_MeetingTitle MT WITH(NOLOCK) ON A.MeetingTitleId=MT.MeetingTitleId AND A.MeetingTypeId=MT.MeetingTypeId
			--INNER JOIN 	Mst_MeetingType T WITH(NOLOCK) ON T.TypeId=MT.MeetingTypeId
			INNER JOIN Trn_MeetingDetails MDET WITH(NOLOCK) ON MDET.MeetingTitleId = A.MeetingTitleId
			AND MDET.IsActive=1

		END
	ELSE
		BEGIN
		 SELECT 
			'No Data Found'	AS [Message],
			''						AS ErrorMessage,
			0						AS [Status],
			0						AS Id,
			''						AS ReferenceNo
		RETURN 
	END
END
GO
PRINT N'Altering Procedure [dbo].[usp_Dashboard_Personal_MeetingDetails]...';


GO
ALTER PROCEDURE [dbo].[usp_Dashboard_Personal_MeetingDetails]
@UserEmail VARCHAR(100),
	@FromDate DATETIME,
	@ToDate DATETIME
AS

BEGIN
DECLARE @MeetingData AS TABLE
	(
		MeetingId BIGINT,
		MeetingTypeId INT,
		TypeName VARCHAR(100),
		MeetingTitleId INT,
		MeetingTitle VARCHAR(500),
		AnchorEmail VARCHAR(100),
		OrganiserEmail VARCHAR(100),
		StartDateTime DATETIME,
		EndDateTime DATETIME,
		AnchorADID VARCHAR(100),
		IsConducted INT
	)
	INSERT INTO @MeetingData
	(
		MeetingId
		,MeetingTypeId
		,TypeName
		,MeetingTitleId
		,MeetingTitle
		,AnchorEmail
		,OrganiserEmail
		,StartDateTime
		,EndDateTime
		,AnchorADID
		,IsConducted
	)
	SELECT 
		MD.MeetingId
		,MD.MeetingTypeId
		,MType.TypeName
		,MD.MeetingTitleId
		,MD.MeetingTitle
		,MD.AnchorEmail
		,MD.OrganiserEmail
		,MD.StartDateTime
		,MD.EndDateTime
		,AnchorADID
		,MD.IsConducted
	FROM dbo.[Trn_MeetingDetails] MD WITH(NOLOCK)
	INNER JOIN dbo.Mst_MeetingType MType ON MD.MeetingTypeId = MType.TypeId
	WHERE (CONVERT(DATE,MD.StartDateTime,103) >= CONVERT(DATE,@FromDate,103) OR @FromDate IS NULL)
    AND (CONVERT(DATE,MD.StartDateTime,103) <= CONVERT(DATE,@ToDate,103)  OR @ToDate IS NULL)
    AND  (MD.AnchorEmail = @UserEmail OR MD.OrganiserEmail = @UserEmail
	OR 
	MeetingId IN (SELECT MeetingId FROM Trn_MeetingParticipants P WHERE P.ParticipantEmail = @UserEmail and Active = 1))
	AND MD.IsActive = 1
    ORDER BY MD.StartDateTime,MD.EndDateTime,MD.CreatedOn DESC

	-----------------Type Wise Grouping Start--------------------
	DECLARE @TypeTEMP AS TABLE
	(	MeetingTypeId INT,
		TypeName VARCHAR(100),
		TotalScheduledMeetingsAnchor INT DEFAULT 0,
		TotalConductedMeetingsAnchor INT DEFAULT 0,
		TotalDocumentUploaded		 INT DEFAULT 0,
		TotalParticipant			 INT DEFAULT 0,
		TotalTimeSpentAnchor		 VARCHAR(100),
		TotalAttendedParticipant	 INT DEFAULT 0,
		TotalTimeSpentParticipant	 VARCHAR(100)
	)

	--INSERT INTO @TypeTEMP(MeetingTypeId,TypeName)
	--SELECT DISTINCT TypeId AS MeetingTypeId,TypeName
	--FROM Trn_MeetingDetails--Mst_MeetingType
	INSERT INTO @TypeTEMP(MeetingTypeId,TypeName)
	SELECT DISTINCT MeetingTypeId,TypeName
	FROM @MeetingData--Mst_MeetingType

	--SELECT * FROM Mst_MeetingType
	--SELECT DISTINCT MeetingTypeId FROM Trn_MeetingDetails

	--SELECT * FROM Mst_MeetingTitle
	--SELECT DISTINCT MeetingTitleId FROM Trn_MeetingDetails

	UPDATE @TypeTEMP
	SET TotalScheduledMeetingsAnchor=X.CNT
	FROM @TypeTEMP T,
	(SELECT COUNT(*) CNT,MeetingTypeId--,MeetingTitleId
	FROM @MeetingData 
	WHERE AnchorEmail=@UserEmail
	GROUP BY MeetingTypeId--,MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	
	UPDATE @TypeTEMP
	SET TotalConductedMeetingsAnchor=X.CNT
	FROM @TypeTEMP T,
	(SELECT COUNT(*) CNT,MeetingTypeId--,MeetingTitleId
	FROM @MeetingData 
	
	WHERE AnchorEmail=@UserEmail 
	AND IsConducted = 1
	--AND (CONVERT(DATE,StartDateTime,103) < CONVERT(DATE,DATEADD(MINUTE,330,GETUTCDATE()),103))
	GROUP BY MeetingTypeId--,MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId

	UPDATE @TypeTEMP
	SET TotalDocumentUploaded = X.CNT
	FROM @TypeTEMP T,
	(SELECT COUNT(*) CNT,MeetingTypeId--,MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_MeetingFileUpload FU ON MDET.MeetingId = FU.MeetingId
	GROUP BY MeetingTypeId--,MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId

	UPDATE @TypeTEMP
	SET TotalParticipant = X.CNT
	FROM @TypeTEMP T,
	(SELECT COUNT(*) CNT,MDET.MeetingTypeId--,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	WHERE ParticipantEmail = @UserEmail
	GROUP BY MDET.MeetingTypeId--,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	
	-----TotalTimeSpentAnchor------
	

	UPDATE @TypeTEMP
	SET TotalTimeSpentAnchor = X.CNT
	FROM @TypeTEMP T,
	--(SELECT COUNT(*) CNT,MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	--FROM @MeetingData MDET
	--INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	--WHERE ParticipantEmail = @UserEmail
	--GROUP BY MDET.MeetingTypeId--,MDET.MeetingTitleId
	--)
	(SELECT CAST((CAST(SUM( DATEDIFF(minute, CS.StartDateTime, CS.EndDateTime)) AS FLOAT) / 60 )AS NUMERIC(18,2)) CNT,MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	INNER JOIN Trn_CallRecordSessions CS ON CS.CallRecordId = CR.Id
	--INNER JOIN Trn_MeetingParticipants MP ON CS.CallerADId = MP.ParticipantADID
	WHERE  CS.CallerADId = MDET.AnchorADID
	AND MDET.OrganiserEmail = @UserEmail
	--CS.CallerADId = MDET.AnchorADID
	GROUP BY MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	-----------

	-----TotalAttendedParticipant------
	UPDATE @TypeTEMP
	SET TotalAttendedParticipant = X.CNT
	FROM @TypeTEMP T,
	(
	SELECT COUNT (*) CNT,MDET.MeetingId,MDET.MeetingTypeId
	--,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	INNER JOIN Trn_CallRecordParticipants CP ON CR.Id = CP.CallRecordId
	INNER JOIN Trn_MeetingParticipants MP ON MP.MeetingId = MDET.MeetingId 
	AND MP.ParticipantADID = CP.ParticipantADId
	WHERE MP.ParticipantEmail = @UserEmail 
	AND MDET.AnchorEmail != @UserEmail
	--ParticipantEmail = @UserEmail
	GROUP BY MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId

	--SELECT COUNT (DISTINCT PARTICIPANTNAME) CNT,CR.MeetingId,MDET.MeetingTypeId
	--FROM 
	--@MeetingData MDET INNER JOIN Trn_CallRecords CR  ON CR.MeetingId = MDET.MeetingId	
	--INNER JOIN Trn_CallRecordParticipants CP ON CR.Id = CP.CallRecordId
	--GROUP BY CR.MeetingId,MDET.MeetingTypeId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId


	-----------

	-----TotalTimeSpentParticipant------
	--SELECT MP.MeetingId,CS.CallRecordId,CS.Id, CS.StartDateTime, CS.EndDateTime,MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	--FROM @MeetingData MDET
	--INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	--INNER JOIN Trn_CallRecordSessions CS ON CS.CallRecordId = CR.Id
	--INNER JOIN Trn_MeetingParticipants MP ON CS.CallerADId = MP.ParticipantADID AND MP.MeetingId=MDET.MeetingId
	--WHERE 
	--MP.ParticipantEmail = @UserEmail 
	--AND 
	--MDET.AnchorEmail != @UserEmail
	--AND CS.CallerADId != MDET.AnchorADID

	UPDATE @TypeTEMP
	SET TotalTimeSpentParticipant = X.CNT
	FROM @TypeTEMP T,
	--(SELECT COUNT(*) CNT,MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	--FROM @MeetingData MDET
	--INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	--WHERE ParticipantEmail = @UserEmail
	--GROUP BY MDET.MeetingTypeId--,MDET.MeetingTitleId
	--)
	(SELECT CAST((CAST(SUM( DATEDIFF(minute, CS.StartDateTime, CS.EndDateTime)) AS FLOAT) / 60 )AS NUMERIC(18,2)) 
	CNT,MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	INNER JOIN Trn_CallRecordSessions CS ON CS.CallRecordId = CR.Id
	INNER JOIN Trn_MeetingParticipants MP ON CS.CallerADId = MP.ParticipantADID AND MP.MeetingId=MDET.MeetingId
	WHERE 
	MP.ParticipantEmail = @UserEmail 
	AND 
	MDET.AnchorEmail != @UserEmail
	AND CS.CallerADId != MDET.AnchorADID
	
	GROUP BY MDET.MeetingId,MDET.MeetingTypeId--,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	-----------
	-----------------Type Wise Grouping End--------------------

	-----------------Title Wise Grouping Start--------------------
	DECLARE @TEMP AS TABLE
	(	MeetingTypeId INT,
		MeetingTitleId INT,
		MeetingTitle VARCHAR(MAX),
		TotalScheduledMeetingsAnchor INT DEFAULT 0,
		TotalConductedMeetingsAnchor INT DEFAULT 0,
		TotalDocumentUploaded		 INT DEFAULT 0,
		TotalParticipant			 INT DEFAULT 0,
		TotalTimeSpentAnchor		 VARCHAR(100),
		TotalAttendedParticipant	 INT DEFAULT 0,
		TotalTimeSpentParticipant	 VARCHAR(100)
	)

	--INSERT INTO @TEMP(MeetingTypeId,MeetingTitleId)
	--SELECT DISTINCT MeetingTypeId,MeetingTitleId
	--FROM Mst_MeetingTitle

	INSERT INTO @TEMP(MeetingTypeId,MeetingTitleId,MeetingTitle)
	SELECT DISTINCT MeetingTypeId,MeetingTitleId,MeetingTitle
	FROM Trn_MeetingDetails
	
	

	UPDATE @TEMP
	SET TotalScheduledMeetingsAnchor=X.CNT
	FROM @TEMP T,

	(SELECT COUNT(*) CNT,MeetingTypeId,MeetingTitleId
	FROM @MeetingData 
	WHERE AnchorEmail=@UserEmail
	GROUP BY MeetingTypeId,MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId

	UPDATE @TEMP
	SET TotalConductedMeetingsAnchor=X.CNT
	FROM @TEMP T,
	(SELECT COUNT(*) CNT,MeetingTypeId,MeetingTitleId
	FROM @MeetingData 
	WHERE AnchorEmail=@UserEmail 
	--AND (CONVERT(DATE,StartDateTime,103) < CONVERT(DATE,DATEADD(MINUTE,330,GETUTCDATE()),103))
	AND IsConducted = 1
	GROUP BY MeetingTypeId,MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId
	

	UPDATE @TEMP
	SET TotalDocumentUploaded = X.CNT
	FROM @TEMP T,
	(SELECT COUNT(*) CNT,MeetingTypeId,MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_MeetingFileUpload FU ON MDET.MeetingId = FU.MeetingId
	GROUP BY MeetingTypeId,MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId 

	UPDATE @TEMP
	SET TotalParticipant = X.CNT
	FROM @TEMP T,
	(SELECT COUNT(*) CNT,MDET.MeetingTypeId,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	WHERE ParticipantEmail = @UserEmail
	GROUP BY MDET.MeetingTypeId,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId 

	-----------TotalTimeSpentAnchor------------
	UPDATE @TEMP
	SET TotalTimeSpentAnchor = X.CNT
	FROM @TEMP T,
	--(SELECT COUNT(*) CNT,MDET.MeetingTypeId,MDET.MeetingTitleId
	--FROM @MeetingData MDET
	--INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	--WHERE ParticipantEmail = @UserEmail
	--GROUP BY MDET.MeetingTypeId,MDET.MeetingTitleId
	--)
	(SELECT CAST((CAST(SUM( DATEDIFF(minute, CS.StartDateTime, CS.EndDateTime)) AS FLOAT) / 60 )AS NUMERIC(18,2)) CNT,MDET.MeetingId,MDET.MeetingTypeId,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	INNER JOIN Trn_CallRecordSessions CS ON CS.CallRecordId = CR.Id
	--INNER JOIN Trn_MeetingParticipants MP ON CS.CallerADId = MP.ParticipantADID
	WHERE  CS.CallerADId = MDET.AnchorADID
	AND MDET.OrganiserEmail = @UserEmail
	--AND CR.MeetingId IN (MDET.MeetingId)
	--WHERE CS.CallerADId = MDET.AnchorADID
	GROUP BY MDET.MeetingId,MDET.MeetingTypeId,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId 
	-----------------------

	-----------TotalAttendedParticipant------------
	UPDATE @TEMP
	SET TotalAttendedParticipant = X.CNT
	FROM @TEMP T,
	(SELECT COUNT(DISTINCT MDET.MeetingId) CNT,MDET.MeetingId,MDET.MeetingTypeId,MDET.MeetingTitleId
	FROM @MeetingData MDET
	--INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	INNER JOIN Trn_CallRecordParticipants CP ON CR.Id = CP.CallRecordId
	INNER JOIN Trn_MeetingParticipants MP ON MP.MeetingId = MDET.MeetingId 
	AND MP.ParticipantADID = CP.ParticipantADId
	WHERE MP.ParticipantEmail = @UserEmail 
	AND MDET.AnchorEmail != @UserEmail 
	--ParticipantEmail = @UserEmail
	GROUP BY MDET.MeetingId,MDET.MeetingTypeId,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId 
	-----------------------

	-----------TotalTimeSpentParticipant------------
	UPDATE @TEMP
	SET TotalTimeSpentParticipant = X.CNT
	FROM @TEMP T,
	--(SELECT COUNT(*) CNT,MDET.MeetingTypeId,MDET.MeetingTitleId
	--FROM @MeetingData MDET
	--INNER JOIN Trn_MeetingParticipants MP ON MDET.MeetingId = MP.MeetingId
	--WHERE ParticipantEmail = @UserEmail
	--GROUP BY MDET.MeetingTypeId,MDET.MeetingTitleId
	--)
	(SELECT CAST((CAST(SUM( DATEDIFF(minute, CS.StartDateTime, CS.EndDateTime)) AS FLOAT) / 60 )AS NUMERIC(18,2)) CNT,MDET.MeetingId,MDET.MeetingTypeId,MDET.MeetingTitleId
	FROM @MeetingData MDET
	INNER JOIN Trn_CallRecords CR ON CR.MeetingId = MDET.MeetingId
	INNER JOIN Trn_CallRecordSessions CS ON CS.CallRecordId = CR.Id
	INNER JOIN Trn_MeetingParticipants MP ON CS.CallerADId = MP.ParticipantADID
	AND MP.MeetingId=MDET.MeetingId
	WHERE MP.ParticipantEmail = @UserEmail
	AND MDET.AnchorEmail != @UserEmail
	AND CS.CallerADId != MDET.AnchorADID
	--WHERE CS.CallerADId = MDET.AnchorADID
	GROUP BY MDET.MeetingId,MDET.MeetingTypeId,MDET.MeetingTitleId
	)
	X
	WHERE T.MeetingTypeId=X.MeetingTypeId
	AND T.MeetingTitleId=X.MeetingTitleId

	
	-----------------Title Wise Grouping Start--------------------

	SELECT * FROM @TypeTEMP
	SELECT A.*--,MT.MeetingTitle,T.TypeName--, MDET.MeetingId
	FROM @TEMP a

END
GO
PRINT N'Altering Procedure [dbo].[usp_MeetingDetails_SendMail]...';


GO
ALTER PROCEDURE [dbo].[usp_MeetingDetails_SendMail]
AS
DECLARE @emailDay DATETIME  = NULL;
BEGIN
SET @emailDay = DATEADD(day, 4, GETDATE());
SELECT
MD.MeetingId
,MD.MeetingTitle
,MD.StartDateTime
,MD.EndDateTime
,MD.LocationId
,MD.LocationName
,MD.CreatedBy
,MD.CreatedByEmail
,MD.AnchorName 
,MD.AnchorEmail 
,MD.AnchorADID
,MD.OrganiserName 
,MD.OrganiserEmail 
,MD.OrganiserADID
,MD.AllDayEvent
FROM dbo.[Trn_MeetingDetails] MD WITH(NOLOCK)
WHERE (CONVERT(VARCHAR,MD.StartDateTime,103)) = (CONVERT(VARCHAR, @emailDay, 103))
AND MD.MeetingStatus != 'Cancelled'
AND MD.IsActive = 1
AND
(
MD.MeetingId NOT IN
	(
	SELECT
	SPO.MeetingId
	FROM dbo.[MeetingSPOFileUploadResponse] SPO WITH(NOLOCK)
	WHERE SPO.IsActive = 1
	)
	OR
	MD.MeetingId NOT IN
	(
	SELECT
	MFU.MeetingId
	FROM dbo.[Trn_MeetingFileUpload] MFU WITH(NOLOCK)
	WHERE MFU.IsActive = 1
	)
)
END
GO
PRINT N'Altering Procedure [dbo].[usp_TaskDetails_GetAllPrev]...';


GO
ALTER PROCEDURE [dbo].[usp_TaskDetails_GetAllPrev]
	@MeetingId BIGINT,
	@TaskTitle NVARCHAR(250)=NULL, 
	@AssignedTo NVARCHAR(100)=NULL,
    @SeriesMasterId NVARCHAR(500)=NULL
AS
DECLARE @PrevMeetingId BIGINT = 0
DECLARE @PrevToPrevMeetingId BIGINT = 0
DECLARE @PrevMeetingDate DATETIME = 0
DECLARE @PrevToPrevMeetingDate DATETIME = 0
BEGIN
    
    IF(@SeriesMasterId IS NOT NULL)
    BEGIN
    -- BY MEETING ID

    --SET @PrevMeetingId = ( SELECT TOP 1 MeetingId
    --                        FROM dbo.[Trn_MeetingDetails] WITH(NOLOCK)
    --                        WHERE MeetingId < @MeetingId
    --                        AND SeriesMasterId = @SeriesMasterId
    --                        ORDER BY MeetingId DESC )

    --SET @PrevToPrevMeetingId = ( SELECT TOP 1 MeetingId
    --                                FROM dbo.[Trn_MeetingDetails] WITH(NOLOCK)
    --                                WHERE MeetingId < @PrevMeetingId
    --                                AND SeriesMasterId = @SeriesMasterId
    --                                ORDER BY MeetingId DESC )

 --   -- BY MEETING DATE UTC
 --   SELECT TOP 1 @PrevMeetingDate=CONVERT(DATE,M1.StartDateTimeUTC,103)
	--FROM dbo.[Trn_MeetingDetails] M1 WITH(NOLOCK)
	--WHERE CONVERT(DATE,M1.StartDateTimeUTC,103) <
	--(
 --       SELECT CONVERT(DATE,M2.StartDateTimeUTC,103)
 --       FROM dbo.[Trn_MeetingDetails] M2 WITH(NOLOCK)
	--    WHERE M2.MeetingId = @MeetingId
	--    AND M2.SeriesMasterId = @SeriesMasterId
	--)
	--AND M1.SeriesMasterId = @SeriesMasterId
	--ORDER BY CONVERT(DATE,M1.StartDateTimeUTC,103) DESC

	----SELECT @PrevMeetingDate

	--SELECT top 1 @PrevToPrevMeetingDate=CONVERT(DATE,M1.StartDateTimeUTC,103)
	--FROM dbo.[Trn_MeetingDetails] M1 WITH(NOLOCK)
	--WHERE CONVERT(DATE,M1.StartDateTimeUTC,103) <
	--@PrevMeetingDate
	--AND M1.SeriesMasterId = @SeriesMasterId
	--ORDER BY MeetingId DESC

	----SELECT @PrevTOPrevMeetingDate

     -- BY MEETING DATE LOCAL
    SELECT TOP 1 @PrevMeetingDate=CONVERT(DATE,M1.StartDateTime,103)
	FROM dbo.[Trn_MeetingDetails] M1 WITH(NOLOCK)
	WHERE CONVERT(DATE,M1.StartDateTime,103) <
	(
        SELECT CONVERT(DATE,M2.StartDateTime,103)
        FROM dbo.[Trn_MeetingDetails] M2 WITH(NOLOCK)
	    WHERE M2.MeetingId = @MeetingId
	    AND M2.SeriesMasterId = @SeriesMasterId
	)
	AND M1.SeriesMasterId = @SeriesMasterId
	ORDER BY CONVERT(DATE,M1.StartDateTime,103) DESC

	--SELECT @PrevMeetingDate

	SELECT top 1 @PrevToPrevMeetingDate=CONVERT(DATE,M1.StartDateTime,103)
	FROM dbo.[Trn_MeetingDetails] M1 WITH(NOLOCK)
	WHERE CONVERT(DATE,M1.StartDateTime,103) <
	@PrevMeetingDate
	AND M1.SeriesMasterId = @SeriesMasterId
	ORDER BY MeetingId DESC

	--SELECT @PrevTOPrevMeetingDate

    END

 --   SELECT
 --       TaskId,
	--    MeetingId, 
 --       TaskContext, 
 --       TaskActionPlan, 
 --       TaskPriority, 
 --       ActionTakenBy, 
 --       ActionTakenByEmail, 
 --       ActionTakenByADID,
 --       AssignedTo,
 --       AssignedToEmail,
 --       AssignedToADID,
 --       TaskClosureDate, 
 --       CreatedOn, 
 --       CreatedBy,
 --       CreatedByEmail,
 --       CreatedByADID,
 --       TaskStatus,
 --       TaskReferenceNo
 --   FROM dbo.[Trn_TaskDetails]
 --   WHERE MeetingId = ISNULL(@MeetingId,MeetingId)
	--OR MeetingId = @PrevMeetingId
	--OR (MeetingId = @PrevToPrevMeetingId AND TaskStatus != 'Closed')
 --   AND TaskContext LIKE ISNULL(@TaskTitle,TaskContext) + '%'
 --   AND AssignedToADID = ISNULL(@AssignedTo,AssignedToADID)

        SELECT
        TD.TaskId,
	    TD.MeetingId, 
        TD.TaskContext, 
        TD.TaskActionPlan, 
        TD.TaskPriority, 
        TD.ActionTakenBy, 
        TD.ActionTakenByEmail, 
        TD.ActionTakenByADID,
        TD.AssignedTo,
        TD.AssignedToEmail,
        TD.AssignedToADID,
        TD.TaskClosureDate, 
        TD.CreatedOn, 
        TD.CreatedBy,
        TD.CreatedByEmail,
        TD.CreatedByADID,
        TD.TaskStatus,
        TD.TaskReferenceNo,
        @MeetingId			            AS	CurrentMeetingId,
		@PrevMeetingId	                AS	PrevMeetingId,
        @PrevToPrevMeetingId			AS	PrevToPrevMeetingId,
        @PrevMeetingDate	            AS	PrevMeetingDate,
        @PrevToPrevMeetingDate	        AS	PrevToPrevMeetingDate
    FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
   WHERE 
   (
    TD.MeetingId = ISNULL(@MeetingId,TD.MeetingId)
	--OR TD.MeetingId = @PrevMeetingId
	--OR (TD.MeetingId = @PrevToPrevMeetingId AND TD.TaskStatus != 'Closed')
    OR (CONVERT(DATE, TD.CreatedOn)) = @PrevMeetingDate
    OR (CONVERT(DATE, TD.CreatedOn)) = @PrevToPrevMeetingDate AND TD.TaskStatus != 'Closed'
    )
	AND (ISNULL(TD.TaskContext,' ') LIKE ISNULL(@TaskTitle,ISNULL(TD.TaskContext,' ')) + '%')
    AND (ISNULL(TD.AssignedTo,' ') LIKE ISNULL(@AssignedTo,ISNULL(TD.AssignedTo,' ')) + '%')

END
GO
PRINT N'Update complete.';


GO
