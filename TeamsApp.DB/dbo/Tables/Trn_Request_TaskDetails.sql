﻿CREATE TABLE [dbo].[Trn_Request_TaskDetails]
(
	[RequestId] INT NOT NULL PRIMARY KEY IDENTITY,
    [RequestRefNo] VARCHAR(50) NULL,
	[TaskId] BIGINT NULL,
    [ProgressId] BIGINT NULL,
	[StatusId] INT NULL, 
    [PriorityId] INT NULL, 
    [RequestorRoleId] INT NULL,
    [ApproverRoleId] INT NULL,
	[ParentTaskId] BIGINT NULL,
	[IsActive] BIT NULL,
    [IsCancelled] BIT NULL,
    [CreatedOnIST] DATETIME NULL, 
    [CreatedOnUTC] DATETIME NULL, 
    [CreatedByName] NVARCHAR(100) NULL,
    [CreatedByEmail] NVARCHAR(100) NULL,
    [CreatedByUPN] NVARCHAR(100) NULL,
    [CreatedByADID] NVARCHAR(50) NULL,
    [TaskSubject] NVARCHAR(200) NULL,
    [TaskDesc] NVARCHAR(500) NULL,
    [CurrentTargetDate] DATETIME NULL,
    [TransactionId] UNIQUEIDENTIFIER NULL,
    [IsApproved] BIT NULL,
    [RequestRemarks] NVARCHAR(500) NULL,
    [ApprovalRemarks] NVARCHAR(500) NULL,
    [UpdatedOnIST] DATETIME NULL, 
    [UpdatedOnUTC] DATETIME NULL, 
    [UpdatedByName] NVARCHAR(100) NULL,
    [UpdatedByEmail] NVARCHAR(100) NULL,
    [UpdatedByUPN] NVARCHAR(100) NULL,
    [UpdatedByADID] NVARCHAR(50) NULL
)
