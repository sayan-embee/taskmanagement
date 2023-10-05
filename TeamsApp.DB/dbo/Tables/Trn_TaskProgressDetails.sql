CREATE TABLE [dbo].[Trn_TaskProgressDetails]
(
	[ProgressId] BIGINT NOT NULL PRIMARY KEY IDENTITY,
    [TaskId] BIGINT NULL,
	[RoleId] INT NULL,
    [ProgressRemarks] NVARCHAR(500) NULL,
	[UpdatedOnIST] DATETIME NULL, 
    [UpdatedOnUTC] DATETIME NULL, 
    [UpdatedByName] NVARCHAR(100) NULL,
    [UpdatedByEmail] NVARCHAR(100) NULL,
    [UpdatedByUPN] NVARCHAR(100) NULL,
    [UpdatedByADID] NVARCHAR(50) NULL,
    [TransactionId] UNIQUEIDENTIFIER NULL
)
