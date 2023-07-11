CREATE TABLE [dbo].[Mst_FileExtension]
(
	[ExtId] INT NOT NULL PRIMARY KEY IDENTITY,
	[ExtName] NVARCHAR(100) NOT NULL, 
    [Active] BIT NULL DEFAULT 1, 
    [CreatedBy] NVARCHAR(100) NULL, 
    [CreatedOn] DATETIME NULL, 
    [CreatedByEmail] NVARCHAR(100) NULL, 
    [UpdatedBy] NVARCHAR(100) NULL, 
    [UpdatedOn] DATETIME NULL, 
    [UpdatedByEmail] NVARCHAR(100) NULL
)
