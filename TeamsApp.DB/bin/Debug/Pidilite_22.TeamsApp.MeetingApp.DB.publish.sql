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
PRINT N'Altering Procedure [dbo].[usp_MeetingTitle_GetAll]...';


GO
ALTER PROCEDURE [dbo].[usp_MeetingTitle_GetAll]
@MeetingTitle NVARCHAR(200),
@MeetingTypeId INT,
@DivisionId INT,
@VerticalId INT
AS
BEGIN
	SELECT 
		MT.MeetingTitle,
		MT.MeetingTitleId,
		MT.MeetingTypeId,
		T.TypeName AS MeetingType,
		MT.DivisionId,
		D.DivisionName,
		MT.VerticalId,
		V.VerticalName,
		R.MeetingTitleFileName,
		R.SPOWebUrl,
		R.SPODriveId,
		R.SPOItemId,
		MT.Active
	FROM dbo.[Mst_MeetingTitle] MT WITH(NOLOCK)
	INNER JOIN Mst_Division D WITH(NOLOCK) ON MT.DivisionId=D.DivisionId
	INNER JOIN dbo.Mst_Vertical V WITH(NOLOCK) ON MT.VerticalId=V.VerticalId
	INNER JOIN dbo.Mst_MeetingType T WITH(NOLOCK) ON MT.MeetingTypeId=T.TypeId
	FULL OUTER JOIN dbo.[MeetingTitleFileUploadResponse] R WITH(NOLOCK) ON MT.MeetingTitleId=R.MeetingTitleId
	WHERE
	MT.Active = 1
	AND MT.MeetingTitle LIKE ISNULL(@MeetingTitle,MT.MeetingTitle)+'%'
	AND MT.MeetingTypeId=CASE WHEN ISNULL(@MeetingTypeId ,0)=0 THEN MT.MeetingTypeId ELSE @MeetingTypeId END
	AND MT.DivisionId=CASE WHEN ISNULL(@DivisionId ,0)=0 THEN MT.DivisionId ELSE @DivisionId END
	AND MT.VerticalId=CASE WHEN ISNULL(@VerticalId ,0)=0 THEN MT.VerticalId ELSE @VerticalId END
	ORDER BY CAST(SUBSTRING(MT.MeetingTitle + '0', PATINDEX('%[0-9]%', MT.MeetingTitle + '0'), LEN(MT.MeetingTitle + '0')) AS INT)
END
GO
PRINT N'Update complete.';


GO
