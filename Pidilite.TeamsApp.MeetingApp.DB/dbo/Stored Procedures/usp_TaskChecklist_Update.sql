CREATE PROCEDURE [dbo].[usp_TaskChecklist_Update]
	@ChecklistId BIGINT = NULL,
	@TaskId BIGINT = NULL,
    @MeetingId BIGINT = NULL, 
    @ChecklistTitle NVARCHAR(100) = NULL,
    @ChecklistCompletionDate DATETIME = NULL,
    @ChecklistStatus NVARCHAR(50) = NULL,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByADID NVARCHAR(100) = NULL
AS
BEGIN
BEGIN TRANSACTION
-- UPDATE TASK CHECKLIST
	UPDATE dbo.[Trn_TaskChecklist]
		SET ChecklistTitle = @ChecklistTitle
		,ChecklistCompletionDate = @ChecklistCompletionDate
		,ChecklistStatus = @ChecklistStatus
		,UpdatedOn = GETUTCDATE()
		,UpdatedBy = @UpdatedBy
		,UpdatedByEmail = @UpdatedByEmail
		,UpdatedByADID = @UpdatedByADID
		WHERE ChecklistId = @ChecklistId
		AND TaskId = @TaskId
		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to update checklist'	AS [Message],
				''						                                                                            AS ErrorMessage,
				0						                                                                            AS [Status],
				@ChecklistId																			AS Id,
				''						                                                                            AS ReferenceNo
			RETURN 
		END

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
		'Checklist updated successfully'			AS	[Message],
		''																		AS ErrorMessage,
		1																		AS [Status],
		@ChecklistId												AS Id,
	    @TaskId														AS ReferenceNo
END
