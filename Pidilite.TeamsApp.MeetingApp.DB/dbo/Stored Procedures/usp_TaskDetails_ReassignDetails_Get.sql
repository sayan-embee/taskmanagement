CREATE PROCEDURE [dbo].[usp_TaskDetails_ReassignDetails_Get]
    @AssignedToADID NVARCHAR(50) = NULL
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
                ,TD.TaskStatus
                ,TD.TaskReferenceNo
        FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
        WHERE TD.AssignedToADID = @AssignedToADID
        AND TD.TaskStatus != 'closed' 
END