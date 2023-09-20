CREATE TABLE [dbo].[Mst_TaskStatus]
(
	[StatusId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [StatusName] NVARCHAR(50) NULL, 
    [StatusCode] NVARCHAR(50) NULL, 
    [SortOrder] INT NULL
)
