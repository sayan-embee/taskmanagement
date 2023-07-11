CREATE PROCEDURE [dbo].[usp_TaskChecklist_Delete]
@ChecklistId BIGINT = NULL,
@TaskId BIGINT = NULL
AS
BEGIN
BEGIN TRANSACTION
-- DELETE TASK CHECKLIST
DELETE FROM dbo.[Trn_TaskChecklist] WHERE ChecklistId = @ChecklistId
IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to delete checklist'	AS [Message],
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

COMMIT TRANSACTION
	SELECT 
		'Checklist updated successfully'			AS	[Message],
		''																		AS ErrorMessage,
		1																		AS [Status],
		@ChecklistId												AS Id,
	    ''																		AS ReferenceNo
END