CREATE TABLE [dbo].[Trn_TaskAdditionalDetails]
(
	[TaskAddId] BIGINT NOT NULL PRIMARY KEY IDENTITY,
	[TaskId] BIGINT NULL, 
    [IsOverdue] BIT NULL, 
    [NoOfExtensionRequested] INT NULL,
	[NoOfDeadlineMissed] INT NULL,
	[UpdatedOnIST] DATETIME NULL, 
    [UpdatedOnUTC] DATETIME NULL,
	[TransactionId] UNIQUEIDENTIFIER NULL
)
