﻿CREATE TYPE [dbo].[UDT_TaskChecklist] AS TABLE
(
	--ChecklistId BIGINT NOT NULL, 
    ChecklistTitle NVARCHAR(100) NULL, 
    ChecklistCompletionDate DATETIME NULL, 
    ChecklistStatus NVARCHAR(50) NULL 
    --TaskId BIGINT NULL, 
    --MeetingId BIGINT NULL, 
    --CreatedBy NVARCHAR(100) NULL, 
    --CreatedByEmail NVARCHAR(100) NULL, 
    --CreatedByADID NVARCHAR(50) NULL, 
    --UpdatedBy NVARCHAR(100) NULL, 
    --UpdatedByEmail NVARCHAR(100) NULL, 
    --UpdatedByADID NVARCHAR(50) NULL
)