CREATE PROCEDURE [dbo].[usp_TaskDetails_Update]
    @TaskId BIGINT = NULL,
    @MeetingId BIGINT = NULL, 
    @TaskReferenceNo UNIQUEIDENTIFIER,
	@TaskContext NVARCHAR(250) = NULL, 
	@TaskActionPlan NVARCHAR(500) = NULL, 
	@TaskPriority NVARCHAR(50) = NULL, 
    @TaskClosureDate DATETIME = NULL,
    @TaskStatus NVARCHAR(50) = NULL,
    @TaskRemarks NVARCHAR(250) = NULL,
    @UpdatedBy NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByADID NVARCHAR(100) = NULL,
	@TaskDetailsType NVARCHAR(50)=NULL
AS
BEGIN
	BEGIN TRANSACTION

	IF(@TaskDetailsType = 'assignedtome')
	BEGIN
    UPDATE dbo.[Trn_TaskDetails]
    SET TaskClosureDate = ISNULL(@TaskClosureDate,TaskClosureDate)
    ,TaskStatus = ISNULL(@TaskStatus,TaskStatus)
    ,TaskRemarks =  ISNULL(@TaskRemarks,TaskRemarks)
	,UpdatedOn = GETUTCDATE()
	,UpdatedBy = ISNULL(@UpdatedBy,UpdatedBy)
	,UpdatedByEmail = ISNULL(@UpdatedByEmail,UpdatedByEmail)
	,UpdatedByADID = ISNULL(@UpdatedByADID, UpdatedByADID)
	WHERE TaskId = @TaskId
	AND MeetingId = @MeetingId
    IF @@ERROR<>0
	BEGIN
		ROLLBACK TRANSACTION
		SELECT 
			'Something went wrong, unable to update task'         AS [Message],
			''						                                                                            AS ErrorMessage,
			0						                                                                            AS [Status],
			@TaskId																					AS Id,
			''						                                                                            AS ReferenceNo
		RETURN 
	END

	IF(@TaskStatus = 'Closed')
	BEGIN	

		DECLARE @OldSortOrder BIGINT = (SELECT ISNULL(SortOrder,0) FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)

		IF ( @OldSortOrder < (SELECT ISNULL(MAX(SortOrder),0) FROM dbo.[Trn_TaskDetails] WITH(NOLOCK) WHERE AssignedToADID = @UpdatedByADID) )
		BEGIN
			UPDATE dbo.[Trn_TaskDetails]
			SET SortOrder = SortOrder-1
			WHERE AssignedToADID = @UpdatedByADID
			AND TaskId != @TaskId
			AND SortOrder > @OldSortOrder
		END

		UPDATE dbo.[Trn_TaskDetails]
		SET SortOrder = 0
		WHERE TaskId = @TaskId
	END

	--INSERT INTO SELF ACTION HISTORY
	INSERT INTO dbo.[Trn_TaskActionHistory]
	(
		TaskId
		,MeetingId
		,CreatedOn
		,CreatedBy
		,CreatedByEmail
		,CreatedByADID
		,TaskClosureDate
		,TaskStatus
		,TaskRemarks
	)
	VALUES
	(
		@TaskId
		,@MeetingId
		,GETUTCDATE()
		,@UpdatedBy
		,@UpdatedByEmail
		,@UpdatedByADID
		,@TaskClosureDate
		,@TaskStatus
		,@TaskRemarks
	)
	END

	IF(@TaskDetailsType = 'assignedbyme')
	BEGIN
		UPDATE dbo.[Trn_TaskDetails]
		SET TaskContext = ISNULL(@TaskContext,TaskContext)
		,TaskActionPlan =  ISNULL(@TaskActionPlan, TaskActionPlan)
		,TaskPriority = ISNULL(@TaskPriority, TaskPriority)
		,TaskClosureDate = ISNULL(@TaskClosureDate,TaskClosureDate)
		,UpdatedOn = GETUTCDATE()
		,UpdatedBy = ISNULL(@UpdatedBy,UpdatedBy)
		,UpdatedByEmail = ISNULL(@UpdatedByEmail,UpdatedByEmail)
		,UpdatedByADID = ISNULL(@UpdatedByADID, UpdatedByADID)
		WHERE TaskId = @TaskId
		AND MeetingId = @MeetingId
		IF @@ERROR<>0
		BEGIN
			ROLLBACK TRANSACTION
			SELECT 
				'Something went wrong, unable to update task'         AS [Message],
				''						                                                                            AS ErrorMessage,
				0						                                                                            AS [Status],
				@TaskId																					AS Id,
				''						                                                                            AS ReferenceNo
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
            ,@TaskContext
            ,@TaskActionPlan
            ,@TaskPriority
            ,@TaskClosureDate
            ,@TaskReferenceNo
            ,TD.AssignedTo
            ,TD.AssignedToEmail
            ,TD.AssignedToADID
            ,TD.UpdatedOn
            ,@UpdatedBy
            ,@UpdatedByEmail
            ,@UpdatedByADID
        FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
        WHERE TaskId = @TaskId
		AND MeetingId = @MeetingId
        IF @@ERROR<>0
	        BEGIN
		        ROLLBACK TRANSACTION
		        SELECT 
			        'Something went wrong, unable to add task log'              AS [Message],
			        ''						                                                                                AS ErrorMessage,
			        0						                                                                                AS [Status],
			        @MeetingId					                                                                AS Id,
			        ''						                                                                                AS ReferenceNo

		        RETURN 
	        END

	END


    COMMIT TRANSACTION
	SELECT 
		'Task details updated successfully'      AS	[Message],
		''																		AS ErrorMessage,
		1																		AS [Status],
		@TaskId														AS Id,
	    @TaskReferenceNo									AS GuidReferenceNo
END
