CREATE TYPE [dbo].[udt_TaskEmailResponse] AS TABLE
(
	TaskId BIGINT NULL,
	RequestId BIGINT NULL,
	[TransactionId] UNIQUEIDENTIFIER NULL,
	[IsSent] BIT NULL
)
