CREATE TABLE [dbo].[Trn_TasklogDetails]
(
	[TaskLogId] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
    [TaskContext] NVARCHAR(250) NULL,
	[TaskActionPlan] NVARCHAR(500) NULL, 
	[TaskPriority] NVARCHAR(50) NULL,
	[TaskClosureDate] DATETIME NULL, 
    [TaskReferenceNo] NVARCHAR(50) NULL, 
    [AssignedTo] NVARCHAR(100) NULL, 
    [AssignedToEmail] NVARCHAR(100) NULL, 
    [AssignedToADID] NVARCHAR(50) NULL, 
    [TaskId] BIGINT NULL, 
    [TaskCreatedOn] DATETIME NULL, 
    [ActionTakenBy] NVARCHAR(100) NULL, 
    [ActionTakenByEmail] NVARCHAR(100) NULL, 
    [ActionTakenByADID] NVARCHAR(50) NULL, 
    [MeetingId] BIGINT NULL
)
