CREATE PROCEDURE [dbo].[usp_TaskDetails_Get]
	@Id BIGINT = 0
AS
	BEGIN
		    SELECT
                TD.TaskId
	            ,TD.MeetingId
                ,TD.TaskContext
                ,TD.TaskActionPlan
                ,TD.TaskPriority
                ,TD.ActionTakenBy
                ,TD.ActionTakenByEmail
                ,TD.ActionTakenByADID
                ,TD.AssignedTo
                ,TD.AssignedToEmail
                ,TD.AssignedToADID
                ,TD.TaskClosureDate
                ,TD.CreatedOn
                ,TD.CreatedBy
                ,TD.CreatedByEmail
                ,TD.CreatedByADID
                ,TD.UpdatedOn
                ,TD.UpdatedBy
                ,TD.UpdatedByEmail
                ,TD.UpdatedByADID
                ,TD.TaskStatus
                ,TD.TaskReferenceNo
        FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
        WHERE TD.TaskId = @Id
        ORDER BY TD.CreatedOn DESC

        --Task Attachment Files
        SELECT
        TFU.TaskFileId
        ,TFU.TaskId
        ,TFU.MeetingId
        ,TFU.[FileName]
        ,TFU.FileUrl
        ,TFU.ContentType
        FROM dbo.[Trn_TaskFileUpload] TFU WITH(NOLOCK)
        WHERE TFU.TaskId = @Id

        --Task Checklists
        SELECT
	    ChecklistId
	    ,TaskId
	    ,MeetingId
	    ,ChecklistTitle
	    ,ChecklistCompletionDate
	    ,ChecklistStatus
	    ,CreatedBy
	    ,CreatedByEmail
	    ,CreatedByADID
	    ,UpdatedBy
	    ,UpdatedByEmail
	    ,UpdatedByADID
	    ,CreatedOn
	    ,UpdatedOn
	    FROM dbo.[Trn_TaskChecklist] TC WITH(NOLOCK)
	    WHERE TC.TaskId = @Id

        -- Self Action History
        SELECT
        TaskActionHistoryId
        ,TaskId
        ,MeetingId
        ,CreatedOn
        ,CreatedByEmail
        ,CreatedByADID
        ,CreatedBy
        ,TaskClosureDate
        ,TaskRemarks
        ,TaskStatus
        FROM dbo.[Trn_TaskActionHistory] TAH WITH(NOLOCK)
        WHERE TAH.TaskId = @Id

        -- Task Log
        SELECT
        TaskLogId
        ,TaskId
        ,MeetingId
        ,TaskContext
        ,TaskActionPlan
        ,TaskPriority
        ,TaskClosureDate
        ,TaskReferenceNo
        ,AssignedTo
        ,AssignedToEmail
        ,AssignedToADID
        ,TaskCreatedOn
        ,ActionTakenBy
        ,ActionTakenByEmail
        ,ActionTakenByADID
        FROM dbo.[Trn_TasklogDetails] TL WITH(NOLOCK)
        WHERE TL.TaskId = @Id
	END

