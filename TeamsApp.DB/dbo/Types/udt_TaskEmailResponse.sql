CREATE TYPE [dbo].[udt_TaskEmailResponse] AS TABLE
(
	TaskId BIGINT NULL,
	[TransactionId] UNIQUEIDENTIFIER NULL,
	[IsSent] BIT NULL
)
