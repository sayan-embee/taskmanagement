CREATE TABLE [dbo].[Trn_TaskFileUpload]
(
	[TaskFileId] BIGINT NOT NULL PRIMARY KEY IDENTITY, 
    [MeetingId] BIGINT NOT NULL, 
    [TaskId] BIGINT NOT NULL, 
    [FileName] NVARCHAR(200) NULL, 
    [FileUrl] NVARCHAR(500) NULL, 
    [ContentType] NVARCHAR(200) NULL
)
