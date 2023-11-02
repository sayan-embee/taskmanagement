CREATE TABLE [dbo].[Mst_TaskPriority]
(
	[PriorityId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [PriorityName] NVARCHAR(50) NULL, 
    [PriorityCode] NVARCHAR(50) NULL, 
    [SortOrder] INT NULL,
    [NotificationDays] INT NULL
)
