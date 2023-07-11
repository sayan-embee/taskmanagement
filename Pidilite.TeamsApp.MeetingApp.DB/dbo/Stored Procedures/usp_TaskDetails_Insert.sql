CREATE PROCEDURE [dbo].[usp_TaskDetails_Insert]
    @MeetingId BIGINT = NULL,
    @TaskContext NVARCHAR(250) = NULL,
    @TaskActionPlan NVARCHAR(500) = NULL,
    @TaskPriority NVARCHAR(50) = NULL,
    @TaskClosureDate DATETIME = NULL,
    @ActionTakenBy NVARCHAR(100) = NULL,
    @ActionTakenByEmail NVARCHAR(100) = NULL,
    @ActionTakenByADID NVARCHAR(50) = NULL,
    @CreatedBy NVARCHAR(100) = NULL,
    @CreatedByEmail NVARCHAR(100) = NULL,
    @CreatedByADID NVARCHAR(100) = NULL,
    -- UDT
    @TaskParticipant UDT_TaskParticipants NULL READONLY
AS
	BEGIN
    DECLARE @TaskId BIGINT = NULL
    DECLARE @TaskReferenceNo AS UNIQUEIDENTIFIER
    DECLARE @TaskLogId BIGINT = NULL
    BEGIN TRANSACTION
        -- INSERT TASK DETAILS
        SET @TaskReferenceNo = NEWID ()
        
        INSERT INTO dbo.[Trn_TaskDetails]
        (
        MeetingId, 
        TaskContext, 
        TaskActionPlan, 
        TaskPriority, 
        ActionTakenBy, 
        ActionTakenByEmail, 
        ActionTakenByADID, 
        AssignedTo,
        AssignedToEmail,
        AssignedToADID,
        TaskClosureDate, 
        CreatedOn, 
        CreatedBy,
        CreatedByEmail,
        CreatedByADID,
        TaskStatus,
        TaskReferenceNo
        ,SortOrder
        )
        SELECT
        @MeetingId, 
        @TaskContext, 
        @TaskActionPlan, 
        @TaskPriority,
        @ActionTakenBy, 
        @ActionTakenByEmail, 
        @ActionTakenByADID,
        TP.AssignedTo,
        TP.AssignedToEmail,
        TP.AssignedToADID,
        @TaskClosureDate, 
        GETUTCDATE(), 
        @CreatedBy,
        @CreatedByEmail,
        @CreatedByADID,
        'Pending',
        @TaskReferenceNo
		,ISNULL(X.SortOrder,1)
        FROM @TaskParticipant TP
		FULL OUTER JOIN
        (
            SELECT AssignedToADID, (ISNULL(MAX(SortOrder),0)+1) AS SortOrder FROM dbo.[Trn_TaskDetails] WITH(NOLOCK)
            WHERE AssignedToADID IN (SELECT AssignedToADID FROM @TaskParticipant)
            GROUP BY AssignedToADID
        ) X ON X.AssignedToADID = TP.AssignedToADID
		


       -- SET @TaskId = @@IDENTITY
        IF @@ERROR<>0
	    BEGIN
		    ROLLBACK TRANSACTION
		    SELECT 
			    'Something went wrong, unable to add task'              AS [Message],
			    ''						                                AS ErrorMessage,
			    0						                                AS [Status],
			    @MeetingId					                            AS Id,
			    ''						                                AS ReferenceNo
		    RETURN 
	    END

        IF NOT EXISTS ( SELECT 1 FROM @TaskParticipant)
        BEGIN
            INSERT INTO dbo.[Trn_TaskDetails]
            (
            MeetingId, 
            TaskContext, 
            TaskActionPlan, 
            TaskPriority, 
            ActionTakenBy, 
            ActionTakenByEmail, 
            ActionTakenByADID, 
            TaskClosureDate, 
            CreatedOn, 
            CreatedBy,
            CreatedByEmail,
            CreatedByADID,
            TaskStatus,
            TaskReferenceNo
            )
            VALUES
            (
            @MeetingId, 
            @TaskContext, 
            @TaskActionPlan, 
            @TaskPriority,
            @ActionTakenBy, 
            @ActionTakenByEmail, 
            @ActionTakenByADID,
            @TaskClosureDate, 
            GETUTCDATE(), 
            @CreatedBy,
            @CreatedByEmail,
            @CreatedByADID,
            'Pending',
            @TaskReferenceNo
            )
        END

        SET @TaskId = @@IDENTITY
        IF @@ERROR<>0
	    BEGIN
		    ROLLBACK TRANSACTION
		    SELECT 
			    'Something went wrong, unable to add task'                AS [Message],
			    ''						                                  AS ErrorMessage,
			    0						                                  AS [Status],
			    @MeetingId					                              AS Id,
			    ''						                                  AS ReferenceNo
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
                ,@MeetingId
                ,@TaskContext
                ,@TaskActionPlan
                ,@TaskPriority
                ,@TaskClosureDate
                ,@TaskReferenceNo
                ,TP.AssignedTo
                ,TP.AssignedToEmail
                ,TP.AssignedToADID
                ,TD.CreatedOn
                ,@ActionTakenBy
                ,@ActionTakenByEmail
                ,@ActionTakenByADID
            FROM @TaskParticipant TP, dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
            WHERE TD.TaskReferenceNo = @TaskReferenceNo
            AND TD.AssignedToADID = TP.AssignedToADID
            IF @@ERROR<>0
	            BEGIN
		            ROLLBACK TRANSACTION
		            SELECT 
			            'Something went wrong, unable to add task log'             AS [Message],
			            ''						                                   AS ErrorMessage,
			            0						                                   AS [Status],
			            @MeetingId					                               AS Id,
			            ''						                                   AS ReferenceNo

		            RETURN 
	            END

                IF NOT EXISTS ( SELECT 1 FROM @TaskParticipant)
                BEGIN
                    INSERT INTO dbo.Trn_TasklogDetails
                    (
                        TaskId
                        ,MeetingId
                        ,TaskContext
                        ,TaskActionPlan
                        ,TaskPriority
                        ,TaskClosureDate
                        ,TaskReferenceNo
                        ,TaskCreatedOn
                        ,ActionTakenBy
                        ,ActionTakenByEmail
                        ,ActionTakenByADID
                    )
                    SELECT
                          TD.TaskId
                        ,@MeetingId
                        ,@TaskContext
                        ,@TaskActionPlan
                        ,@TaskPriority
                        ,@TaskClosureDate
                        ,@TaskReferenceNo
                        ,TD.CreatedOn
                        ,@ActionTakenBy
                        ,@ActionTakenByEmail
                        ,@ActionTakenByADID
                    FROM dbo.[Trn_TaskDetails] TD WITH(NOLOCK)
                    WHERE TD.TaskReferenceNo = @TaskReferenceNo
                    AND (TD.TaskPriority = 'KI' OR TD.TaskPriority = 'MINUTES')
            END
            SET @TaskLogId = @@IDENTITY
            IF @@ERROR<>0
	        BEGIN
		        ROLLBACK TRANSACTION
		        SELECT 
			        'Something went wrong, unable to add task'                AS [Message],
			        ''						                                  AS ErrorMessage,
			        0						                                  AS [Status],
			        @MeetingId					                              AS Id,
			        ''						                                  AS ReferenceNo
		        RETURN 
	        END

    COMMIT TRANSACTION
    SELECT 
		'Task details inserted successfully'           AS  [Message],
		''								               AS ErrorMessage,
		1								               AS [Status],
		@TaskId					                       AS Id,
        @TaskLogId									   AS ReferenceNo,
	    @TaskReferenceNo							   AS GuidReferenceNo
END