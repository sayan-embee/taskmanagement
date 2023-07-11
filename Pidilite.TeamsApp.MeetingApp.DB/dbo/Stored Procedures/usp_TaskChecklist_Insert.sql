CREATE PROCEDURE [dbo].[usp_TaskChecklist_Insert]
    @TaskId BIGINT = NULL,
    @MeetingId BIGINT = NULL, 
    @ChecklistTitle NVARCHAR(100) = NULL,
    @ChecklistCompletionDate DATETIME = NULL,
    @ChecklistStatus NVARCHAR(50) = NULL,
    @CreatedBy NVARCHAR(100) = NULL,
    @CreatedByEmail NVARCHAR(100) = NULL,
    @CreatedByADID NVARCHAR(100) = NULL
AS
DECLARE @TaskChecklistId BIGINT = 0;
BEGIN
BEGIN TRANSACTION
-- INSERT INTO TASK CHECKLIST
	INSERT INTO dbo.[Trn_TaskChecklist]
	(
		TaskId
		,MeetingId
		,ChecklistTitle
		,ChecklistCompletionDate
		,ChecklistStatus
		,CreatedOn
		,CreatedBy
		,CreatedByEmail
		,CreatedByADID
	)
	VALUES
	(
		@TaskId
		,@MeetingId
		,@ChecklistTitle
		,@ChecklistCompletionDate
		,@ChecklistStatus
		,GETUTCDATE()
		,@CreatedBy
		,@CreatedByEmail
		,@CreatedByADID
	)
	IF @@ERROR<>0
	BEGIN
		ROLLBACK TRANSACTION
		SELECT 
			'Something went wrong, unable to insert checklist'	AS [Message],
			''						                                                                            AS ErrorMessage,
			0						                                                                            AS [Status],
			@TaskId																					AS Id,
			''						                                                                            AS ReferenceNo
		RETURN 
	END

	SET @TaskChecklistId = @@IDENTITY

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
	FROM dbo.[Trn_TaskChecklist] WITH(NOLOCK)
	WHERE TaskId = @TaskId
	--IN ( SELECT TaskId FROM dbo.[Trn_TaskDetails] WHERE MeetingId = @MeetingId )

	COMMIT TRANSACTION
	SELECT 
		'Checklist inserted successfully'			AS	[Message],
		''																		AS ErrorMessage,
		1																		AS [Status],
		@TaskId														AS Id,
	    @TaskId														AS ReferenceNo
END