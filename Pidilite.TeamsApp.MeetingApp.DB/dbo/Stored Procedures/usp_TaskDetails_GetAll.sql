CREATE PROCEDURE [dbo].[usp_TaskDetails_GetAll]

	@TaskTitle NVARCHAR(250)=NULL,
    @Status NVARCHAR(50)=NULL,
    @FromDate DATETIME=NULL,
    @ToDate DATETIME=NULL,
    @Priority NVARCHAR(50)=NULL,
    @MeetingTitle NVARCHAR(100)=NULL,
    @MeetingType NVARCHAR(100)=NULL,
    @CreatedBy NVARCHAR(100)=NULL,
	@AssignedTo NVARCHAR(100)=NULL,
    @AssignedBy NVARCHAR(100)=NULL,
    @TaskDetailsType NVARCHAR(50)=NULL
AS
BEGIN

IF(@TaskDetailsType = 'assignedtome')
BEGIN
    SELECT
        TD.TaskId,
	    TD.MeetingId, 
        TD.TaskContext, 
        TD.TaskActionPlan, 
        TD.TaskPriority, 
        TD.ActionTakenBy, 
        TD.ActionTakenByEmail, 
        TD.ActionTakenByADID,
        TD.AssignedTo,
        TD.AssignedToEmail,
        TD.AssignedToADID,
        TD.TaskClosureDate, 
        TD.CreatedOn, 
        TD.CreatedBy,
        TD.CreatedByEmail,
        TD.CreatedByADID,
        TD.TaskStatus,
        TD.TaskReferenceNo,
        TD.SortOrder
    FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
    WHERE TD.AssignedToEmail = @AssignedTo
    AND TD.TaskStatus = ISNULL(@Status,TD.TaskStatus)
    AND TD.TaskPriority = ISNULL(@Priority,TD.TaskPriority)
	AND TD.CreatedBy LIKE ISNULL(@CreatedBy,TD.CreatedBy) + '%'
    AND TD.TaskContext LIKE ISNULL(@TaskTitle,TD.TaskContext) + '%'
    AND (CONVERT(DATE,TD.TaskClosureDate,103) >= CONVERT(DATE,@FromDate,103) OR @FromDate IS NULL)
    AND (CONVERT(DATE,TD.TaskClosureDate,103) <= CONVERT(DATE,@ToDate,103)  OR @ToDate IS NULL)
    ORDER BY ISNULL(TD.SortOrder,(SELECT MAX(SortOrder) FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToEmail = @AssignedTo)+1),CONVERT(DATE,TD.TaskClosureDate,103)
END


IF(@TaskDetailsType = 'assignedbyme')
BEGIN
    SELECT
        TD.TaskId,
	    TD.MeetingId, 
        TD.TaskContext, 
        TD.TaskActionPlan, 
        TD.TaskPriority, 
        TD.ActionTakenBy, 
        TD.ActionTakenByEmail, 
        TD.ActionTakenByADID,
        TD.AssignedTo,
        TD.AssignedToEmail,
        TD.AssignedToADID,
        TD.TaskClosureDate, 
        TD.CreatedOn, 
        TD.CreatedBy,
        TD.CreatedByEmail,
        TD.CreatedByADID,
        TD.TaskStatus,
        TD.TaskReferenceNo,
        TD.SortOrder
    FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
    WHERE TD.ActionTakenByEmail = @AssignedBy
    AND TD.TaskStatus = ISNULL(@Status,TD.TaskStatus)
    AND TD.TaskPriority = ISNULL(@Priority,TD.TaskPriority)
    AND (ISNULL(TD.AssignedTo,' ') LIKE ISNULL(@AssignedTo,ISNULL(TD.AssignedTo,' ')) + '%')
    AND TD.TaskContext LIKE ISNULL(@TaskTitle,TD.TaskContext) + '%'
    AND (CONVERT(DATE,TD.TaskClosureDate,103) >= CONVERT(DATE,@FromDate,103) OR @FromDate IS NULL)
    AND (CONVERT(DATE,TD.TaskClosureDate,103) <= CONVERT(DATE,@ToDate,103)  OR @ToDate IS NULL)
    ORDER BY CONVERT(DATE,TD.TaskClosureDate,103), CONVERT(DATE,TD.CreatedOn,103)
END

END