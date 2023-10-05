CREATE PROCEDURE [dbo].[usp_Task_Reassign]
(
    @TaskId BIGINT = NULL,
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(100) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL,
    @AssigneeName NVARCHAR(100) = NULL,
    @AssigneeEmail NVARCHAR(100) = NULL,
    @AssigneeUPN NVARCHAR(100) = NULL,
    @AssigneeADID NVARCHAR(50) = NULL,
    @RoleId INT = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL
)
AS
BEGIN

DECLARE @ProgressId BIGINT = 0;
DECLARE @HistoryId BIGINT = 0;
DECLARE @TaskUnqId AS UNIQUEIDENTIFIER = NULL;
DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();
DECLARE @JSONString NVARCHAR(MAX) = NULL;

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId AND AssigneeEmail = @AssigneeEmail)
BEGIN
    SELECT 
        'Cannot assign to same person'      AS [Message],
        ''						            AS ErrorMessage,
        0					                AS [Status],
        @TaskId				                AS Id,
        ''				                    AS ReferenceNo
    RETURN
END

IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
BEGIN

    BEGIN TRANSACTION

    SELECT @TaskUnqId = TaskUnqId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId

    INSERT INTO [dbo].[Trn_TaskProgressDetails] 
    (
        [TaskId],
        [RoleId],
        [ProgressRemarks],
        [UpdatedOnIST],
        [UpdatedOnUTC],
        [UpdatedByName],
        [UpdatedByEmail],
        [UpdatedByUPN],
        [UpdatedByADID],
        [TransactionId]
    ) 
    VALUES 
    (
        @TaskId,
        @RoleId,
        ISNULL(@ProgressRemarks, 'Task Reassigned'),
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @UpdatedByName,
        @UpdatedByEmail,
        @UpdatedByUPN,
        @UpdatedByADID,
        @TransactionId
    )

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    SET @ProgressId = @@IDENTITY;

    IF(@ProgressId > 0)
    BEGIN
        INSERT INTO [dbo].[Trn_TaskHistoryDetails]
        (
            [TaskId],
            [ProgressId],        
            [StatusId],
            [PriorityId],
            [RoleId],
            [TaskRefNo],
            [TaskUnqId],
            [ParentTaskId],
            [TaskSubject],
            [TaskDesc],
            [InitialTargetDate],
            [CurrentTargetDate],
            [AssignerName],
            [AssignerEmail],
            [AssignerUPN],
            [AssignerADID],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [CoordinatorName],
            [CoordinatorEmail],
            [CoordinatorUPN],
            [CoordinatorADID],
            [CollaboratorName],
            [CollaboratorEmail],
            [CollaboratorUPN],
            [CollaboratorADID],
            [TransactionId]
        )
        SELECT
            [TaskId],
            @ProgressId,        
            [StatusId],
            [PriorityId],
            [RoleId],
            [TaskRefNo],
            [TaskUnqId],
            [ParentTaskId],
            [TaskSubject],
            [TaskDesc],
            [InitialTargetDate],
            [CurrentTargetDate],
            [AssignerName],
            [AssignerEmail],
            [AssignerUPN],
            [AssignerADID],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [CoordinatorName],
            [CoordinatorEmail],
            [CoordinatorUPN],
            [CoordinatorADID],
            [CollaboratorName],
            [CollaboratorEmail],
            [CollaboratorUPN],
            [CollaboratorADID],
            @TransactionId
        FROM [dbo].[Trn_TaskDetails] WITH (NOLOCK) WHERE [TaskId] = @TaskId
    END

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    SET @HistoryId = @@IDENTITY;
    
    IF(@HistoryId > 0)
    BEGIN

        SET @JSONString = (
        SELECT
            AssigneeName,
            AssigneeEmail,
            AssigneeUPN,
            AssigneeADID
        FROM [dbo].[Trn_TaskDetails] WITH (NOLOCK) WHERE [TaskId] = @TaskId
        FOR JSON AUTO
        );


        UPDATE [dbo].[Trn_TaskDetails]
        SET
            [RoleId] = ISNULL(@RoleId,RoleId),
            [AssigneeName] = ISNULL(@AssigneeName,AssigneeName),
            [AssigneeEmail] = ISNULL(@AssigneeEmail,AssigneeEmail),
            [AssigneeUPN] = ISNULL(@AssigneeUPN,AssigneeUPN),
            [AssigneeADID] = ISNULL(@AssigneeADID,AssigneeADID),
            [TransactionId] = @TransactionId
        WHERE [TaskId] = @TaskId


        INSERT INTO [dbo].[Trn_TaskAssignmentDetails] 
         (
            [TaskId],
            [ProgressId],
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            [AssignmentType],
            [TransactionId]
        )
        SELECT
            [TaskId],
            @ProgressId,
            [AssigneeName],
            [AssigneeEmail],
            [AssigneeUPN],
            [AssigneeADID],
            'RE-ASSIGNED',
            TransactionId
        FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
         WHERE [TaskId] = @TaskId AND @ProgressId > 0 AND @HistoryId > 0

    END

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Reassign Task failed'      AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END


    -- Declare variables
    DECLARE @Email_TaskId BIGINT;
    DECLARE @Email_TargetDate NVARCHAR(100);
    DECLARE @Email_TaskSubject NVARCHAR(100);
    DECLARE @Email_Priority NVARCHAR(50);
    DECLARE @Email_AssignerName NVARCHAR(100);
    DECLARE @Email_AssignerEmail NVARCHAR(100);
    DECLARE @Email_CoordinatorName NVARCHAR(100);
    DECLARE @Email_CoordinatorEmail NVARCHAR(100);
    DECLARE @Email_CollaboratorName NVARCHAR(100);
    DECLARE @Email_CollaboratorEmail NVARCHAR(100);
    DECLARE @Email_AssigneeName NVARCHAR(100);
    DECLARE @Email_AssigneeEmail NVARCHAR(100);
    DECLARE @Email_TaskDesc NVARCHAR(MAX);
    DECLARE @Email_EmailBody NVARCHAR(MAX);
    DECLARE @Email_EmailSubject NVARCHAR(MAX);

    -- Maximum length for the Task Description to display initially
    DECLARE @MaxDescLength INT = 200;

    -- Create a table variable to store the results
    DECLARE @Emails AS TABLE
    (
    [TaskId] BIGINT,
    TargetDate NVARCHAR(100),
    TaskSubject NVARCHAR(100),
    [Priority] NVARCHAR(50),
    AssignerName NVARCHAR(100),
    AssignerEmail NVARCHAR(100),
    CoordinatorName NVARCHAR(100),
    CoordinatorEmail NVARCHAR(100),
    CollaboratorName NVARCHAR(100),
    CollaboratorEmail NVARCHAR(100),
    AssigneeName NVARCHAR(100),
    AssigneeEmail NVARCHAR(100),
    TaskDesc NVARCHAR(MAX),
    [EmailBody] NVARCHAR(MAX),
    EmailSubject NVARCHAR(MAX)
    );

    -- Populate the @Emails table variable
    INSERT INTO @Emails 
    (
    [TaskId],
    TargetDate,
    TaskSubject,
    [Priority],
    AssignerName,
    AssignerEmail,
    CoordinatorName,
    CoordinatorEmail,
    CollaboratorName,
    CollaboratorEmail,
    AssigneeName,
    AssigneeEmail,
    TaskDesc,
    [EmailBody],
    EmailSubject
    )
    SELECT 
    T.[TaskId],    
    CONVERT(NVARCHAR(20), CurrentTargetDate, 103),
    T.TaskSubject,
    P.PriorityName,
    T.AssignerName,
    T.AssignerEmail,
    T.CoordinatorName,
    T.CoordinatorEmail,
    CollaboratorName,
    CollaboratorEmail,
    T.AssigneeName,
    T.AssigneeEmail,
    T.TaskDesc,
    N'', -- Initialize the EmailSubject with an empty string
    N'' -- Initialize the EmailBody with an empty string
    FROM [dbo].[Trn_TaskDetails] T WITH(NOLOCK)
    INNER JOIN [dbo].[Mst_TaskPriority] P WITH(NOLOCK) ON P.PriorityId = T.PriorityId
    WHERE TaskId = @TaskId;

    -- Loop through the @Emails table variable
    DECLARE emailCursor CURSOR FOR
    SELECT
    [TaskId],
    TargetDate,
    TaskSubject,
    [Priority],
    AssignerName,
    AssignerEmail,
    CoordinatorName,
    CoordinatorEmail,
    CollaboratorName,
    CollaboratorEmail,
    AssigneeName,
    AssigneeEmail,
    TaskDesc,
    [EmailBody],
    EmailSubject
    FROM @Emails;

    OPEN emailCursor;
    FETCH NEXT FROM emailCursor INTO 
    @Email_TaskId, 
    @Email_TargetDate,
    @Email_TaskSubject,
    @Email_Priority,
    @Email_AssignerName,
    @Email_AssignerEmail,
    @Email_CoordinatorName,
    @Email_CoordinatorEmail,
    @Email_CollaboratorName,
    @Email_CollaboratorEmail,
    @Email_AssigneeName,
    @Email_AssigneeEmail,
    @Email_TaskDesc,
    @Email_EmailBody,
    @Email_EmailSubject;

    WHILE @@FETCH_STATUS = 0
    BEGIN
    -- Construct the email body for each TaskId here
    -- You can use the @TaskId and @EmailBody variables to create the email content

    -- set the email body as a simple message
    SET @Email_EmailSubject = 'Task Reassignment Notification - Task App V2';

    -- set the email body as a simple message
    SET @Email_EmailBody = N'
                        <html>
                            <head>
                                <style>
                                    .indented-paragraph {
                                        margin-left: 20px; /* Adjust the indentation level as needed */
                                    }
                                </style>
                            </head>
                            <body>
                                <p>Hi,</p>
                                <h3>The following task has been reassigned:</h3>
                                <p class="indented-paragraph"><strong>Target Date:</strong> ' + @Email_TargetDate + N'</p>
                                <p class="indented-paragraph"><strong>Priority:</strong> ' + @Email_Priority + N'</p>
                                <p class="indented-paragraph"><strong>Task Subject:</strong> ' + @Email_TaskSubject + N'</p>
                                <p class="indented-paragraph"><strong>Task Description:</strong> ' + LEFT(@Email_TaskDesc, @MaxDescLength) + N'</p>';

                                IF LEN(@Email_TaskDesc) > @MaxDescLength
                                BEGIN
                                    SET @Email_EmailBody = @Email_EmailBody + N'
                                    <p class="indented-paragraph">
                                        <span id="taskDescShort">' + LEFT(@Email_TaskDesc, @MaxDescLength) + N'</span>
                                        <span id="taskDescFull" style="display:none;">' + @Email_TaskDesc + N'</span>
                                        <button onclick="showFullDescription()">Read More</button>
                                    </p>
                                    <script>
                                        function showFullDescription() {
                                            document.getElementById("taskDescShort").style.display = "none";
                                            document.getElementById("taskDescFull").style.display = "inline";
                                        }
                                    </script>
                                    ';
                                END

                                SET @Email_EmailBody = @Email_EmailBody + N'
                                <h4>Stakeholders:</h4>
                                <p class="indented-paragraph"><strong>Assigner:</strong> ' + @Email_AssignerName + N' (' + @Email_AssigneeEmail + N')</p>
                                <p class="indented-paragraph"><strong>Coordinator:</strong> ' + @Email_CoordinatorName + N' (' + @Email_CoordinatorEmail + N')</p>
                                <p class="indented-paragraph"><strong>Collaborator:</strong> ' + @Email_CollaboratorName + N' (' + @Email_CollaboratorEmail + N')</p>
                                <p class="indented-paragraph"><strong>New Assignee:</strong> ' + @Email_AssigneeName + N' (' + @Email_AssigneeEmail + N')</p>
                            </body>
                            </html>
                        ';

    -- Update the @Emails table variable with the generated email body
    UPDATE @Emails
    SET [EmailBody] = @Email_EmailBody,
    [EmailSubject] = @Email_EmailSubject
    WHERE [TaskId] = @Email_TaskId;

    -- Fetch the next task
    FETCH NEXT FROM emailCursor INTO
    @Email_TaskId, 
    @Email_TargetDate,
    @Email_TaskSubject,
    @Email_Priority,
    @Email_AssignerName,
    @Email_AssignerEmail,
    @Email_CoordinatorName,
    @Email_CoordinatorEmail,
    @Email_CollaboratorName,
    @Email_CollaboratorEmail,
    @Email_AssigneeName,
    @Email_AssigneeEmail,
    @Email_TaskDesc,
    @Email_EmailBody,
    @Email_EmailSubject;

    END;

    CLOSE emailCursor;
    DEALLOCATE emailCursor;

    -- Now, the @Emails table variable contains the email bodies for each TaskId
    -- You can retrieve the email bodies for each TaskId as needed
    INSERT INTO [dbo].[Trn_TaskEmailNotification]
    (
        TaskId,
        EmailSubject,
        EmailBody,
        ToRecipient,
        FromRecipient,
        CreatedOnIST,
        CreatedOnUTC,
        [Status],
        TransactionId
    )
    SELECT 
    T.[TaskId],
    [EmailSubject],
    [EmailBody],
    STRING_AGG(CONCAT(T.AssignerEmail, ', ', T.CoordinatorEmail, ', ', T.CollaboratorEmail, ', ', T.AssigneeEmail), ', ') AS ToRecipient,
    --STRING_AGG(CONCAT(T.CollaboratorEmail, ', '), ', ') AS ToRecipient,
    T.AssignerEmail,
    DATEADD(MINUTE, 330, GETUTCDATE()),
    GETUTCDATE(),
    'REASSIGN-TASK',
    @TransactionId
    FROM @Emails E
    INNER JOIN [dbo].[Trn_TaskDetails] T WITH (NOLOCK) ON T.TaskId = E.[TaskId]
    GROUP BY T.[TaskId], [EmailSubject], [EmailBody], T.AssignerEmail, T.TransactionId


END
ELSE
BEGIN

	    SELECT 
		    'No task found'         AS [Message],
		    ''					    AS ErrorMessage,
		    0						AS [Status],
		    0				        AS Id,
		    ''						AS ReferenceNo
	    RETURN

END

    COMMIT TRANSACTION
    SELECT 
        'Reassign Task executed'     AS [Message],
        ''						     AS ErrorMessage,
        1					         AS [Status],
        @TaskId				         AS Id,
        @JSONString				     AS ReferenceNo,
        @TaskUnqId                   AS GuidId

END