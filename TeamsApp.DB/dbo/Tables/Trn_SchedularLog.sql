CREATE TABLE [dbo].[Trn_SchedularLog]
(
	[RunId] INT NOT NULL PRIMARY KEY IDENTITY,
    [IsSuccess] BIT NULL,
    [Message] NVARCHAR(MAX) NULL,
    [CreatedOnIST] DATETIME NULL,
    [CreatedOnUTC] DATETIME NULL,
    [ExecutionTimeInSecs] INT NULL,
    [TriggerCode] NVARCHAR(50) NULL,
    [ReferenceInfo] NVARCHAR(MAX) NULL
)
