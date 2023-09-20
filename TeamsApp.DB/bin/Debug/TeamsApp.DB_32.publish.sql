﻿/*
Deployment script for TaskApp_Phase1

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar DatabaseName "TaskApp_Phase1"
:setvar DefaultFilePrefix "TaskApp_Phase1"
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
PRINT N'Creating Procedure [dbo].[usp_SubTask_GetAll]...';


GO
CREATE PROCEDURE [dbo].[usp_SubTask_GetAll]
(
    @LoggedInUserEmail NVARCHAR(100) = NULL,
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @RoleId INT = NULL,
    @ParentTaskId BIGINT = NULL,
    @TaskSubject NVARCHAR(200) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
)
AS
BEGIN

DECLARE @temp_table TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0,
  RoleName NVARCHAR(50) NULL,
  RoleCode NVARCHAR(50) NULL
)

    INSERT INTO @temp_table EXEC usp_Task_CheckRole_ByTaskId @Id = 0, @Email = @LoggedInUserEmail


    ;WITH UserTasks AS (
        SELECT TaskId, ParentTaskId
        FROM [dbo].[Trn_TaskDetails]
        WHERE [AssignerEmail] = @LoggedInUserEmail
            OR [AssigneeEmail] = @LoggedInUserEmail
            OR [CoordinatorEmail] = @LoggedInUserEmail
            OR [CollaboratorEmail] = @LoggedInUserEmail
        UNION ALL
        SELECT T.TaskId, T.ParentTaskId
        FROM [dbo].[Trn_TaskDetails] T
        INNER JOIN UserTasks UT ON T.ParentTaskId = UT.TaskId
    )

    SELECT
        temp.RoleId AS 'LoggedInUserRoleId',
        temp.RoleName AS 'LoggedInUserRoleName',
        T.[TaskId],
        T.[TaskRefNo],
        T.[StatusId],
        S.[StatusName],
        T.[PriorityId],
        P.[PriorityName],
        T.[RoleId],
        R.[RoleName],
        T.[ParentTaskId],
        T.[IsActive],
        T.[CreatedByName],
        T.[CreatedByEmail],
        T.[TaskSubject],
        T.[TaskDesc],
        T.[InitialTargetDate],
        T.[CurrentTargetDate],
        T.[AssignerName],
        T.[AssignerEmail],
        T.[AssigneeName],
        T.[AssigneeEmail],
        CASE
            WHEN T.[StatusId] <> 3 THEN
            CASE
                WHEN DATEADD(MINUTE, 300, T.[CurrentTargetDate]) > GETUTCDATE() THEN
                    CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE, 300, T.[CurrentTargetDate])) AS NVARCHAR(50)) + ' days remaining'
                WHEN DATEADD(MINUTE, 300, T.[CurrentTargetDate]) = GETUTCDATE() THEN
                    CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE, 300, T.[CurrentTargetDate])) AS NVARCHAR(50)) + ' due today'
                ELSE
                    CAST(DATEDIFF(DAY, DATEADD(MINUTE, 300, T.[CurrentTargetDate]), GETUTCDATE()) AS NVARCHAR(50)) + ' days overdue'
            END
            ELSE '-'
        END AS 'ElapsedDays'
    FROM [dbo].[Trn_TaskDetails] T
    INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId
    INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId
    INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId
    LEFT OUTER JOIN @temp_table temp ON temp.TaskId = T.TaskId
    WHERE T.TaskId IN (SELECT TaskId FROM UserTasks)

    AND (@StatusId IS NULL OR T.[StatusId] = @StatusId)
    AND (@PriorityId IS NULL OR T.[PriorityId] = @PriorityId)
    AND (@RoleId IS NULL OR T.[RoleId] = @RoleId)
    AND (@TaskSubject IS NULL OR T.[TaskSubject] = @TaskSubject)
    AND (@FromDate IS NULL OR T.[CurrentTargetDate] >= @FromDate)
    AND (@ToDate IS NULL OR T.[CurrentTargetDate] <= @ToDate)

    ORDER BY T.[CurrentTargetDate]
END
GO
PRINT N'Creating Procedure [dbo].[usp_Task_GetAll]...';


GO
CREATE PROCEDURE [dbo].[usp_Task_GetAll]
(
    @LoggedInUserEmail NVARCHAR(100) = NULL,
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @RoleId INT = NULL,
    @ParentTaskId BIGINT = NULL,
    @TaskSubject NVARCHAR(200) = NULL,
    @FromDate DATETIME = NULL,
    @ToDate DATETIME = NULL
)
AS
BEGIN

DECLARE @temp_table TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0,
  RoleName NVARCHAR(50) NULL,
  RoleCode NVARCHAR(50) NULL
)

    INSERT INTO @temp_table EXEC usp_Task_CheckRole_ByTaskId @Id = 0, @Email = @LoggedInUserEmail

    --SELECT
    --    RoleId,
    --    RoleName,
    --    RoleCode
    --FROM @temp_table
    
	SELECT
        temp.RoleId AS 'LoggedInUserRoleId',
        temp.RoleName AS 'LoggedInUserRoleName',
        T.[TaskId],
        T.[TaskRefNo],
        T.[StatusId],
        S.[StatusName],
        T.[PriorityId],
        P.[PriorityName],
        T.[RoleId],
        R.[RoleName],
        T.[ParentTaskId],
        T.[IsActive],
        T.[CreatedByName],
        T.[CreatedByEmail],
        T.[TaskSubject],
        T.[TaskDesc],
        T.[InitialTargetDate],
        T.[CurrentTargetDate],
        T.[AssignerName],
        T.[AssignerEmail],
        T.[AssigneeName],
        T.[AssigneeEmail],
        CASE
            WHEN T.[StatusId] <> 3 THEN
            CASE
                WHEN DATEADD(MINUTE ,300, T.[CurrentTargetDate]) > GETUTCDATE() THEN
                    CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, T.[CurrentTargetDate])) AS NVARCHAR(50)) + ' days remaining'
                WHEN DATEADD(MINUTE ,300, T.[CurrentTargetDate]) = GETUTCDATE() THEN
                    CAST(DATEDIFF(DAY, GETUTCDATE(), DATEADD(MINUTE ,300, T.[CurrentTargetDate])) AS NVARCHAR(50)) + ' due today'
                ELSE
                    CAST(DATEDIFF(DAY, DATEADD(MINUTE ,300, T.[CurrentTargetDate]), GETUTCDATE()) AS NVARCHAR(50)) + ' days overdue'
                END
            ELSE '-'
        END AS 'ElapsedDays'
    FROM [dbo].[Trn_TaskDetails] T WITH(NOLOCK)

    INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId

    INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId

    INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId

    LEFT OUTER JOIN @temp_table temp ON temp.TaskId = T.TaskId

    WHERE
    (
        [AssignerEmail] = @LoggedInUserEmail
        OR [AssigneeEmail] = @LoggedInUserEmail
        OR [CoordinatorEmail] = @LoggedInUserEmail
        OR [CollaboratorEmail] = @LoggedInUserEmail
    )

    AND (@StatusId IS NULL OR T.[StatusId] = @StatusId)
    AND (@PriorityId IS NULL OR T.[PriorityId] = @PriorityId)
    AND (@RoleId IS NULL OR T.[RoleId] = @RoleId)
    --AND (@ParentTaskId IS NULL OR T.[ParentTaskId] = @ParentTaskId)
    AND (@TaskSubject IS NULL OR T.[TaskSubject] = @TaskSubject)
    AND (@FromDate IS NULL OR T.[CurrentTargetDate] >= @FromDate)
    AND (@ToDate IS NULL OR T.[CurrentTargetDate] <= @ToDate)

    ORDER BY T.[CurrentTargetDate]

END
GO
/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
GO

GO
PRINT N'Update complete.';


GO
