CREATE PROCEDURE [dbo].[usp_TaskDetails_Reassign]
	@TaskId BIGINT = NULL,
	@MeetingId BIGINT = NULL, 
	@AssignedTo NVARCHAR(100) = NULL,
    @AssignedToEmail NVARCHAR(100) = NULL,
    @AssignedToADID NVARCHAR(50) = NULL,
	@UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByADID NVARCHAR(100) = NULL,
	@TaskDetailsType NVARCHAR(50)=NULL,
	@OldAssignedToADID NVARCHAR(50) = NULL
AS
BEGIN

	BEGIN TRANSACTION
	IF(@TaskDetailsType = 'reassign')
	BEGIN
		DECLARE @OldSortOrder BIGINT = (SELECT ISNULL(SortOrder,0) FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
		SET @OldAssignedToADID = (SELECT AssignedToADID FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)

		IF ( @OldSortOrder < (SELECT ISNULL(MAX(SortOrder),0) FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToADID = @OldAssignedToADID) )
		BEGIN
			UPDATE dbo.[Trn_TaskDetails]
			SET SortOrder = SortOrder-1
			WHERE AssignedToADID = @OldAssignedToADID
			AND TaskId != @TaskId
			AND SortOrder > @OldSortOrder
		END

		UPDATE dbo.[Trn_TaskDetails]
		SET AssignedTo = ISNULL(@AssignedTo,AssignedTo)
		,AssignedToEmail = ISNULL(@AssignedToEmail,AssignedToEmail)
		,AssignedToADID = ISNULL(@AssignedToADID,AssignedToADID)
		,OldAssignedToADID = ISNULL(@OldAssignedToADID,OldAssignedToADID)
        ,UpdatedOn = GETUTCDATE()
		,UpdatedBy = ISNULL(@UpdatedBy,UpdatedBy)
		,UpdatedByEmail = ISNULL(@UpdatedByEmail,UpdatedByEmail)
		,UpdatedByADID = ISNULL(@UpdatedByADID, UpdatedByADID)
		,SortOrder = (SELECT (MAX(SortOrder)+1) FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToADID = @AssignedToADID)
		WHERE TaskId = @TaskId
		AND MeetingId = @MeetingId
		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to reassign task'       AS [Message],
				''						                              AS ErrorMessage,
				0						                              AS [Status],
				@TaskId												  AS Id,
				''						                              AS ReferenceNo
			RETURN 
		END

		-- INSERT INTO TASK LOG
        INSERT INTO dbo.Trn_TasklogDetails
        (
            TaskId
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
        )
        SELECT
             TD.TaskId
            ,TD.MeetingId
            ,TD.TaskContext
            ,TD.TaskActionPlan
            ,TD.TaskPriority
            ,TD.TaskClosureDate
            ,TD.TaskReferenceNo
            ,@AssignedTo
            ,@AssignedToEmail
            ,@AssignedToADID
            ,TD.UpdatedOn
            ,@UpdatedBy
            ,@UpdatedByEmail
            ,@UpdatedByADID
        FROM dbo.Trn_TaskDetails TD WITH(NOLOCK)
        WHERE TaskId = @TaskId
		AND MeetingId = @MeetingId
        IF @@ERROR<>0
	        BEGIN
		        ROLLBACK TRANSACTION
		        SELECT 
			        'Something went wrong, unable to add task log'              AS [Message],
			        ''						                                    AS ErrorMessage,
			        0						                                    AS [Status],
			        @MeetingId					                                AS Id,
			        ''						                                    AS ReferenceNo
		        RETURN 
	        END
	END

	IF(@TaskDetailsType = 'reassignall')
	BEGIN
		IF EXISTS ( SELECT TOP 1 TaskId  FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToADID = @OldAssignedToADID AND TaskStatus != 'closed' )
		BEGIN
				
				DECLARE @MaxSortOrder BIGINT = ( SELECT ISNULL(MAX(SortOrder),0) FROM [Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToADID = @AssignedToADID)

				UPDATE TD
				SET TD.SortOrder = @MaxSortOrder+X.SLNO
				FROM dbo.[Trn_TaskDetails]  TD,
				(
				SELECT  
					ROW_NUMBER() OVER( PARTITION BY AssignedToADID ORDER BY SortOrder) SLNO
					,TaskId
					,AssignedToADID
					,SortOrder
				  FROM dbo.[Trn_TaskDetails]
				  WHERE AssignedToADID = @OldAssignedToADID
				  AND (TaskStatus != 'closed' OR SortOrder > 0)
				) X
				WHERE TD.TaskId = X.TaskId

				UPDATE dbo.[Trn_TaskDetails]
				SET AssignedTo = ISNULL(@AssignedTo,AssignedTo)
				,AssignedToEmail = ISNULL(@AssignedToEmail,AssignedToEmail)
				,AssignedToADID = ISNULL(@AssignedToADID,AssignedToADID)
				,OldAssignedToADID = ISNULL(@OldAssignedToADID,OldAssignedToADID)
				,UpdatedOn = GETUTCDATE()
				,UpdatedBy = ISNULL(@UpdatedBy,UpdatedBy)
				,UpdatedByEmail = ISNULL(@UpdatedByEmail,UpdatedByEmail)
				,UpdatedByADID = ISNULL(@UpdatedByADID, UpdatedByADID)
				WHERE TaskId IN ( SELECT TaskId FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToADID = @OldAssignedToADID )
				AND TaskStatus != 'closed'
				 IF @@ERROR<>0
				BEGIN
					ROLLBACK TRANSACTION
					SELECT 
						'Something went wrong, unable to reassign all task' AS [Message],
						''						                            AS ErrorMessage,
						0						                            AS [Status],
						@TaskId												AS Id,
						''						                            AS ReferenceNo
					RETURN 
				END

		-- INSERT INTO TASK LOG
        INSERT INTO dbo.Trn_TasklogDetails
        (
            TaskId
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
        )
        SELECT
             TD.TaskId
            ,TD.MeetingId
            ,TD.TaskContext
            ,TD.TaskActionPlan
            ,TD.TaskPriority
            ,TD.TaskClosureDate
            ,TD.TaskReferenceNo
            ,@AssignedTo
            ,@AssignedToEmail
            ,@AssignedToADID
            ,TD.UpdatedOn
            ,@UpdatedBy
            ,@UpdatedByEmail
            ,@UpdatedByADID
        FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
        WHERE TaskId IN ( SELECT TaskId FROM dbo.[Trn_TaskDetails] WITH(NOLOCK)
												WHERE AssignedToADID = @AssignedToADID
												AND OldAssignedToADID = @OldAssignedToADID )
        IF @@ERROR<>0
	        BEGIN
		        ROLLBACK TRANSACTION
		        SELECT 
			        'Something went wrong, unable to add task log'              AS [Message],
			        ''						                                    AS ErrorMessage,
			        0						                                    AS [Status],
			        @MeetingId					                                AS Id,
			        ''						                                    AS ReferenceNo
		        RETURN 
	        END
	END
	ELSE
		BEGIN
				ROLLBACK TRANSACTION
				SELECT 
					'Something went wrong, no tasks found'							AS [Message],
					'No task found to reassign'										AS ErrorMessage,
					404						                                        AS [Status],
					@MeetingId					                                    AS Id,
					''						                                        AS ReferenceNo
				RETURN 
		END
	END

	COMMIT TRANSACTION
	SELECT 
		'Task reassigned successfully'				AS	[Message],
		''											AS ErrorMessage,
		1											AS [Status],
		@TaskId										AS Id,
	    ''											AS ReferenceNo
END