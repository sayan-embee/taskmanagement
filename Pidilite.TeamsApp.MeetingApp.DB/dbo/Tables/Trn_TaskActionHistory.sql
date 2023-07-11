CREATE TABLE [dbo].[Trn_TaskActionHistory]
(
    [TaskActionHistoryId] BIGINT NOT NULL IDENTITY, 
    [TaskId] BIGINT NULL, 
    [MeetingId] BIGINT NULL, 
    [CreatedOn] DATETIME NULL, 
    [CreatedByEmail] NVARCHAR(100) NULL, 
    [CreatedByADID] NVARCHAR(50) NULL, 
    [CreatedBy] NVARCHAR(100) NULL, 
    [TaskClosureDate] DATETIME NULL, 
    [TaskRemarks] NVARCHAR(250) NULL, 
    [TaskStatus] NVARCHAR(50) NULL
)
