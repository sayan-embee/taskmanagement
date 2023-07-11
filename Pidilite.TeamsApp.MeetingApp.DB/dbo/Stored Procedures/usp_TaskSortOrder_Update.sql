CREATE PROCEDURE [dbo].[usp_TaskSortOrder_Update]
  @TaskSortOrderList UDT_TaskSortOrderList READONLY
AS
BEGIN
	BEGIN TRANSACTION

	UPDATE TD
	SET TD.SortOrder = TL.SortOrder
	FROM @TaskSortOrderList TL, dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
	WHERE TD.TaskId = TL.TaskId

	 IF @@ERROR<>0
	    BEGIN
		    ROLLBACK TRANSACTION
		    SELECT 
			    'Something went wrong, unable to update task sorting order'	AS [Message],
			    ''																														AS ErrorMessage,
			    0																														AS [Status],
			    0																														AS Id,
			    ''																														AS ReferenceNo
		    RETURN 
	    END

	COMMIT TRANSACTION
    SELECT 
		'Task sorting order has been updated successfully'	AS  [Message],
		''																									AS ErrorMessage,
		1																									AS [Status],
		''																									AS Id,
        ''																									AS ReferenceNo
END
