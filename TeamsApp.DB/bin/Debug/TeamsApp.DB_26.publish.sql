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
PRINT N'Altering Procedure [dbo].[usp_Task_Reassign]...';


GO
ALTER PROCEDURE [dbo].[usp_Task_Reassign]
(
    @TaskId BIGINT = NULL,
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(50) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL,
    @AssigneeName NVARCHAR(100) = NULL,
    @AssigneeEmail NVARCHAR(100) = NULL,
    @AssigneeUPN NVARCHAR(50) = NULL,
    @AssigneeADID NVARCHAR(50) = NULL,
    @RoleId INT = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL
)
AS
BEGIN

DECLARE @ProgressId BIGINT = 0;
DECLARE @HistoryId BIGINT = 0;
DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();

BEGIN TRANSACTION

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId AND AssigneeEmail = @AssigneeEmail)
BEGIN
    SELECT 
        'Cannot assign to same person'      AS [Message],
        ''						            AS ErrorMessage,
        0					                AS [Status],
        @TaskId				                AS Id,
        ''				                    AS ReferenceNo
    RETURN
END

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
BEGIN

    INSERT INTO [dbo].[Trn_TaskProgressDetails] 
    (
        [TaskId],
        [RoleId],
        [ProgressRemarks],
        [UpdatedOnIST],
        [UpdatedOnUTC],
        [UpdatedByName],
        [UpdatedByEmail],
        [UpdatedByUPN],
        [UpdatedByADID],
        [TransactionId]
    ) 
    VALUES 
    (
        @TaskId,
        @RoleId,
        ISNULL(@ProgressRemarks, 'Task Reassigned'),
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @UpdatedByName,
        @UpdatedByEmail,
        @UpdatedByUPN,
        @UpdatedByADID,
        @TransactionId
    )

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    SET @ProgressId = @@IDENTITY;

    IF(@ProgressId > 0)
    BEGIN
        INSERT INTO [dbo].[Trn_TaskHistoryDetails]
        (
            [TaskId],
            [ProgressId],        
            [StatusId],
            [PriorityId],
            [RoleId],
            [TaskRefNo],
            [TaskUnqId],
            [ParentTaskId],
            [TaskSubject],
            [TaskDesc],
            [InitialTargetDate],
            [CurrentTargetDate],
            [AssignerName],
            [AssignerEmail],
            [AssignerUPN],
            [AssignerADID],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [CoordinatorName],
            [CoordinatorEmail],
            [CoordinatorUPN],
            [CoordinatorADID],
            [CollaboratorName],
            [CollaboratorEmail],
            [CollaboratorUPN],
            [CollaboratorADID],
            [TransactionId]
        )
        SELECT
            [TaskId],
            @ProgressId,        
            [StatusId],
            [PriorityId],
            [RoleId],
            [TaskRefNo],
            [TaskUnqId],
            [ParentTaskId],
            [TaskSubject],
            [TaskDesc],
            [InitialTargetDate],
            [CurrentTargetDate],
            [AssignerName],
            [AssignerEmail],
            [AssignerUPN],
            [AssignerADID],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [CoordinatorName],
            [CoordinatorEmail],
            [CoordinatorUPN],
            [CoordinatorADID],
            [CollaboratorName],
            [CollaboratorEmail],
            [CollaboratorUPN],
            [CollaboratorADID],
            @TransactionId
        FROM [dbo].[Trn_TaskDetails] WITH (NOLOCK) WHERE [TaskId] = @TaskId
    END

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    SET @HistoryId = @@IDENTITY;
    
    IF(@HistoryId > 0)
    BEGIN
        UPDATE [dbo].[Trn_TaskDetails]
        SET
            [RoleId] = ISNULL(@RoleId,RoleId),
            [AssigneeName] = ISNULL(@AssigneeName,AssigneeName),
            [AssigneeEmail] = ISNULL(@AssigneeEmail,AssigneeEmail),
            [AssigneeUPN] = ISNULL(@AssigneeUPN,AssigneeUPN),
            [AssigneeADID] = ISNULL(@AssigneeADID,AssigneeADID),
            [TransactionId] = @TransactionId
        WHERE [TaskId] = @TaskId


        INSERT INTO [dbo].[Trn_TaskAssignmentDetails] 
         (
            [TaskId],
            [ProgressId],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [AssignmentType],
            [TransactionId]
        )
        SELECT
            [TaskId],
            @ProgressId,
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            'RE-ASSIGNED',
            TransactionId
        FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
         WHERE [TaskId] = @TaskId AND @ProgressId > 0 AND @HistoryId > 0

    END


    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

END

    COMMIT TRANSACTION
    SELECT 
        'Reassign Task executed'     AS [Message],
        ''						     AS ErrorMessage,
        1					         AS [Status],
        @TaskId				         AS Id,
        ''				             AS ReferenceNo

END
GO
PRINT N'Altering Procedure [dbo].[usp_Task_ReassignAll]...';


GO
ALTER PROCEDURE [dbo].[usp_Task_ReassignAll]
(
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(50) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL,
    @AssigneeName NVARCHAR(100) = NULL,
    @AssigneeEmail NVARCHAR(100) = NULL,
    @AssigneeUPN NVARCHAR(50) = NULL,
    @AssigneeADID NVARCHAR(50) = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL
)
AS
BEGIN

DECLARE @BatchSize INT = 1000;
DECLARE @TotalRows INT, @StartRow INT;

DECLARE @temp_table_role TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0,
  RoleName NVARCHAR(50) NULL,
  RoleCode NVARCHAR(50) NULL
)

DECLARE @temp_table_task TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0
)

DECLARE @temp_table_result TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0
)

DECLARE @temp_table_return TABLE
(
  [Message] NVARCHAR(50) NULL,
  ErrorMessage NVARCHAR(50) NULL,
  [Status] INT DEFAULT 0,
  Id INT DEFAULT 0,
  ReferenceNo NVARCHAR(50) NULL
)


    INSERT INTO @temp_table_task
    (
        tempTask.TaskId
    )
    SELECT
        T.TaskId
    FROM [dbo].[Trn_TaskDetails] T
    WHERE
    (
        T.[AssignerEmail] = @UpdatedByEmail
        OR T.[CoordinatorEmail] = @UpdatedByEmail
        --OR [CollaboratorEmail] = @Email
    )
    AND T.IsActive = 1
    AND T.StatusId != 3

    IF EXISTS (SELECT TaskId FROM @temp_table_task)
    BEGIN
        INSERT INTO @temp_table_role EXEC usp_Task_CheckRole_ByTaskId @Id = 0, @Email = @UpdatedByEmail

        IF EXISTS (SELECT RoleId FROM @temp_table_role)
        BEGIN
            UPDATE tempTask
                SET tempTask.RoleId = tempRole.RoleId
            FROM @temp_table_task tempTask,
            @temp_table_role tempRole
            WHERE
            tempTask.TaskId = tempRole.TaskId

            -- BATCH START

            SELECT @TotalRows = COUNT(*) FROM @temp_table_task WHERE TaskId > 0 AND RoleId > 0;

            SET @StartRow = 1;

            WHILE @StartRow <= @TotalRows
            BEGIN

                DECLARE @local_TaskId BIGINT = 0
                DECLARE @local_RoleId BIGINT = 0

                SELECT @local_TaskId = TaskId, @local_RoleId = RoleId
                FROM (
                    SELECT TaskId, RoleId, ROW_NUMBER() OVER (ORDER BY TaskId) AS RowNum
                    FROM @temp_table_task
                ) AS Temp
                WHERE RowNum BETWEEN @StartRow AND (@StartRow + @BatchSize - 1);

                INSERT INTO @temp_table_return 
                EXEC usp_Task_Reassign
                @TaskId = @local_TaskId,
                @UpdatedByName = @UpdatedByName,
                @UpdatedByEmail = @UpdatedByEmail,
                @UpdatedByUPN = @UpdatedByUPN,
                @UpdatedByADID  = @UpdatedByADID,
                @AssigneeName  = @AssigneeName,
                @AssigneeEmail = @AssigneeEmail,
                @AssigneeUPN  = @AssigneeUPN,
                @AssigneeADID  = @AssigneeADID,
                @RoleId = @local_RoleId,
                @ProgressRemarks = @ProgressRemarks

                SET @StartRow = @StartRow + @BatchSize;

            END

            SELECT
                [Message]
                ErrorMessage,
                [Status],
                Id,
                ReferenceNo
            FROM @temp_table_return

            -- BATCH END
        END
    END
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
