CREATE TABLE [dbo].[Trn_TaskAssignmentDetails]
(
	[AssignId] INT NOT NULL PRIMARY KEY IDENTITY,
	[TaskId] BIGINT NULL,
	[ProgressId] BIGINT NULL,
	[AssigneeName] NVARCHAR(100) NULL,
    [AssigneeEmail] NVARCHAR(100) NULL,
    [AssigneeUPN] NVARCHAR(100) NULL,
    [AssigneeADID] NVARCHAR(50) NULL, 
    [AssignmentType] NVARCHAR(50) NULL,
	[TransactionId] UNIQUEIDENTIFIER NULL
)
