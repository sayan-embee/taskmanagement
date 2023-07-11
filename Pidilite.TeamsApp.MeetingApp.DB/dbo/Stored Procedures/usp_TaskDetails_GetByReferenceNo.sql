CREATE PROCEDURE [dbo].[usp_TaskDetails_GetByReferenceNo]
@TaskReferenceNo UNIQUEIDENTIFIER = NULL
AS
	BEGIN
		    SELECT
                TD.TaskId
	            ,TD.MeetingId
                ,MD.MeetingTitle
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
                ,TD.TaskStatus
                ,TD.TaskReferenceNo
                ,MD.TimeZone
        FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
        LEFT OUTER JOIN dbo.[Trn_MeetingDetails] MD WITH(NOLOCK) ON MD.MeetingId = TD.MeetingId
        --INNER JOIN dbo.[Mst_MeetingTitle] MT ON MT.MeetingTitleId = MD.MeetingTitleId
        WHERE TD.TaskReferenceNo = @TaskReferenceNo
        ORDER BY TD.TaskId
END