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
PRINT N'Dropping Procedure [dbo].[usp_MeetingSPOFileUploadResponse_Insert]...';


GO
DROP PROCEDURE [dbo].[usp_MeetingSPOFileUploadResponse_Insert];


GO
PRINT N'Dropping User-Defined Table Type [dbo].[UDT_MeetingSPOFileUpload]...';


GO
DROP TYPE [dbo].[UDT_MeetingSPOFileUpload];


GO
PRINT N'Creating User-Defined Table Type [dbo].[UDT_MeetingSPOFileUpload]...';


GO
CREATE TYPE [dbo].[UDT_MeetingSPOFileUpload] AS TABLE (
    [MeetingId]          BIGINT             NULL,
    [MeetingSPOFileName] NVARCHAR (500)     NULL,
    [FileGuidId]         NVARCHAR (100)     NULL,
    [SPOItemId]          NVARCHAR (100)     NULL,
    [SPOLineItemId]      NVARCHAR (100)     NULL,
    [SPOItemType]        NVARCHAR (100)     NULL,
    [SPOcTag]            NVARCHAR (100)     NULL,
    [SPOeTag]            NVARCHAR (100)     NULL,
    [SPOFileSize]        NVARCHAR (100)     NULL,
    [SPOWebUrl]          NVARCHAR (500)     NULL,
    [CreatedBy]          NVARCHAR (100)     NULL,
    [CreatedByEmail]     NVARCHAR (100)     NULL,
    [CreatedOn]          DATETIMEOFFSET (7) NULL,
    [UpdatedBy]          NVARCHAR (100)     NULL,
    [UpdatedByEmail]     NVARCHAR (100)     NULL,
    [UpdatedOn]          DATETIMEOFFSET (7) NULL,
    [SPOEffectiveRole]   NVARCHAR (100)     NULL,
    [SPODriveId]         NVARCHAR (100)     NULL,
    [SPODriveType]       NVARCHAR (100)     NULL,
    [SPOFolderId]        NVARCHAR (100)     NULL,
    [SPOFolderPath]      NVARCHAR (500)     NULL,
    [DownloadURL]        NVARCHAR (1000)    NULL);


GO
PRINT N'Altering Table [dbo].[MeetingSPOFileUploadResponse]...';


GO
ALTER TABLE [dbo].[MeetingSPOFileUploadResponse]
    ADD [DownloadURL] NVARCHAR (1000) NULL;


GO
PRINT N'Altering Table [dbo].[MeetingTitleFileUploadResponse]...';


GO
ALTER TABLE [dbo].[MeetingTitleFileUploadResponse]
    ADD [DownloadURL] NVARCHAR (1000) NULL;


GO
PRINT N'Creating Procedure [dbo].[usp_MeetingSPOFileUploadResponse_Insert]...';


GO
CREATE PROCEDURE [dbo].[usp_MeetingSPOFileUploadResponse_Insert]

@MeetingSPOFileUploadList UDT_MeetingSPOFileUpload READONLY

AS

BEGIN
-----
BEGIN TRANSACTION
-----------------

    INSERT INTO dbo.[MeetingSPOFileUploadResponse]
	(
		MeetingId
		,
		MeetingSPOFileName
		,
		FileGuidId
		,
		SPOItemId
		,
		SPOLineItemId
		,
		SPOItemType
		,
		SPOcTag
		,
		SPOeTag
		,
		SPOFileSize
		,
		SPOWebUrl
		,
		CreatedBy
		,
		CreatedByEmail
		,
		CreatedOn
		,
		SPOEffectiveRole
		,
		SPODriveId
		,
		SPODriveType
		,
		SPOFolderId
		,
		SPOFolderPath
		,
		DownloadURL
	)
    SELECT 
        List.MeetingId
		,
		List.MeetingSPOFileName
		,
		List.FileGuidId
		,
		List.SPOItemId
		,
		List.SPOLineItemId
		,
		List.SPOItemType
		,
		List.SPOcTag
		,
		List.SPOeTag
		,
		List.SPOFileSize
		,
		List.SPOWebUrl
		,
		List.CreatedBy
		,
		List.CreatedByEmail
		,
		List.CreatedOn
		,
		List.SPOEffectiveRole
		,
		List.SPODriveId
		,
		List.SPODriveType
		,
		List.SPOFolderId
		,
		List.SPOFolderPath
		,
		List.DownloadURL

    FROM @MeetingSPOFileUploadList List

    IF @@ERROR<>0
	BEGIN
	ROLLBACK TRANSACTION
	SELECT 
		'Something went wrong, unable to insert meeting spo file upload response'	AS [Message],
		''																			AS ErrorMessage,
		0																			AS [Status],
		''																			AS Id,
		''																			AS ReferenceNo
	RETURN 
	END

	SELECT
	SPOFolderId
	FROM dbo.[MeetingSPOFileUploadResponse] WITH(NOLOCK)
	WHERE MeetingId IN ( SELECT MeetingId FROM @MeetingSPOFileUploadList )

-----------------
COMMIT TRANSACTION
SELECT 
'Meeting spo file upload response inserted successfully'	AS	[Message],
''															AS ErrorMessage,
1															AS [Status],
''															AS Id,
''															AS ReferenceNo
---
END
GO
PRINT N'Refreshing Procedure [dbo].[usp_MeetingTitleFileUploadResponse_Insert]...';


GO
EXECUTE sp_refreshsqlmodule N'[dbo].[usp_MeetingTitleFileUploadResponse_Insert]';


GO
PRINT N'Update complete.';


GO
