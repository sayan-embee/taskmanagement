CREATE TYPE [dbo].[udt_TaskFileResponse] AS TABLE
(
	[TaskId] BIGINT NULL,
	[RoleId] INT NULL,
    [FileName] NVARCHAR(50) NULL,
    [UnqFileName] NVARCHAR(100) NULL,
    [FileDesc] NVARCHAR(500) NULL,
    [FileUrl] NVARCHAR(MAX) NULL,
    [FileSize] NVARCHAR(100) NULL,
    [ContentType] NVARCHAR(50) NULL,
    [IsActive] BIT NULL,
    [CreatedByName] NVARCHAR(100) NULL,
    [CreatedByEmail] NVARCHAR(100) NULL,
    [CreatedByUPN] NVARCHAR(100) NULL,
    [CreatedByADID] NVARCHAR(50) NULL, 
    [UpdatedByName] NVARCHAR(100) NULL,
    [UpdatedByEmail] NVARCHAR(100) NULL,
    [UpdatedByUPN] NVARCHAR(100) NULL,
    [UpdatedByADID] NVARCHAR(50) NULL,
    [TransactionId] UNIQUEIDENTIFIER NULL
)
