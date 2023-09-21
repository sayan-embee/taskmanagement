CREATE PROCEDURE [dbo].[usp_Task_Insert]
(
    @StatusId INT = NULL,
    @PriorityId INT = NULL,
    @RoleId INT = NULL,
    @ParentTaskId BIGINT = NULL,
    @CreatedByName NVARCHAR(100) = NULL,
    @CreatedByEmail NVARCHAR(100) = NULL,
    @CreatedByUPN NVARCHAR(50) = NULL,
    @CreatedByADID NVARCHAR(50) = NULL,
    @TaskSubject NVARCHAR(200) = NULL,
    @TaskDesc NVARCHAR(500) = NULL,
    @InitialTargetDate DATETIME = NULL,
    @AssignerName NVARCHAR(100) = NULL,
    @AssignerEmail NVARCHAR(100) = NULL,
    @AssignerUPN NVARCHAR(50) = NULL,
    @AssignerADID NVARCHAR(50) = NULL,
    --@AssigneeName NVARCHAR(100) = NULL,
    --@AssigneeEmail NVARCHAR(100) = NULL,
    --@AssigneeUPN NVARCHAR(50) = NULL,
    --@AssigneeADID NVARCHAR(50) = NULL,
    @CoordinatorName NVARCHAR(100) = NULL,
    @CoordinatorEmail NVARCHAR(100) = NULL,
    @CoordinatorUPN NVARCHAR(50) = NULL,
    @CoordinatorADID NVARCHAR(50) = NULL,
    @CollaboratorName NVARCHAR(100) = NULL,
    @CollaboratorEmail NVARCHAR(100) = NULL,
    @CollaboratorUPN NVARCHAR(50) = NULL,
    @CollaboratorADID NVARCHAR(50) = NULL,

    @udt_TaskAssignee udt_TaskAssignee NULL READONLY
)
AS
BEGIN

DECLARE @TaskUnqId AS UNIQUEIDENTIFIER = NEWID ();
DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();

BEGIN TRANSACTION

IF NOT EXISTS (SELECT * FROM @udt_TaskAssignee)
BEGIN
    INSERT INTO [dbo].[Trn_TaskDetails] 
    (
        [TaskUnqId],
        [StatusId],
        [PriorityId],
        [RoleId],
        [ParentTaskId],
        [IsActive],
        [CreatedOnIST],
        [CreatedOnUTC],
        [CreatedByName],
        [CreatedByEmail],
        [CreatedByUPN],
        [CreatedByADID],
        [TaskSubject],
        [TaskDesc],
        [InitialTargetDate],
        [CurrentTargetDate],
        [AssignerName],
        [AssignerEmail],
        [AssignerUPN],
        [AssignerADID],
        --[AssigneeName],
        --[AssigneeEmail],
        --[AssigneeUPN],
        --[AssigneeADID],
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
    VALUES 
    (
        @TaskUnqId,
        @StatusId,
        @PriorityId,
        @RoleId,
        @ParentTaskId,
        1,
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @CreatedByName,
        @CreatedByEmail,
        @CreatedByUPN,
        @CreatedByADID,
        @TaskSubject,
        @TaskDesc,
        @InitialTargetDate,
        @InitialTargetDate,
        @AssignerName,
        @AssignerEmail,
        @AssignerUPN,
        @AssignerADID,
        --@AssigneeName,
        --@AssigneeEmail,
        --@AssigneeUPN,
        --@AssigneeADID,
        @CoordinatorName,
        @CoordinatorEmail,
        @CoordinatorUPN,
        @CoordinatorADID,
        @CollaboratorName,
        @CollaboratorEmail,
        @CollaboratorUPN,
        @CollaboratorADID,
        @TransactionId
    )

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Create task failed'    AS [Message],
		    ''					    AS ErrorMessage,
		    0						AS [Status],
		    0				        AS Id,
		    ''						AS ReferenceNo
	    RETURN
    END

END
ELSE
BEGIN

    INSERT INTO [dbo].[Trn_TaskDetails] 
    (
        [TaskUnqId],
        [StatusId],
        [PriorityId],
        [RoleId],
        [ParentTaskId],
        [IsActive],
        [CreatedOnIST],
        [CreatedOnUTC],
        [CreatedByName],
        [CreatedByEmail],
        [CreatedByUPN],
        [CreatedByADID],
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
        @TaskUnqId,
        @StatusId,
        @PriorityId,
        @RoleId,
        @ParentTaskId,
        1,
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @CreatedByName,
        @CreatedByEmail,
        @CreatedByUPN,
        @CreatedByADID,
        @TaskSubject,
        @TaskDesc,
        @InitialTargetDate,
        @InitialTargetDate,
        @AssignerName,
        @AssignerEmail,
        @AssignerUPN,
        @AssignerADID,
        udt.AssigneeName,
        udt.AssigneeEmail,
        udt.AssigneeUPN,
        udt.AssigneeADID,
        @CoordinatorName,
        @CoordinatorEmail,
        @CoordinatorUPN,
        @CoordinatorADID,
        @CollaboratorName,
        @CollaboratorEmail,
        @CollaboratorUPN,
        @CollaboratorADID,
        @TransactionId
    FROM @udt_TaskAssignee udt

    IF @@ERROR<>0
    BEGIN
	    ROLLBACK TRANSACTION
	    SELECT 
		    'Create task failed'    AS [Message],
		    ''					    AS ErrorMessage,
		    0						AS [Status],
		    0				        AS Id,
		    ''						AS ReferenceNo
	    RETURN
    END

END



    -- UPDATE REF NO
    UPDATE [dbo].[Trn_TaskDetails]
    SET TaskRefNo = FORMAT(TaskId,'000000')
    WHERE TaskUnqId = @TaskUnqId

    DECLARE @ProgressId BIGINT = 0;
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
    SELECT
        [TaskId],
        @RoleId,
        'Task Created & Assigned',
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        @CreatedByName,
        @CreatedByEmail,
        @CreatedByUPN,
        @CreatedByADID
        ,@TransactionId
    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
     WHERE TaskUnqId = @TaskUnqId

     SET @ProgressId = @@IDENTITY;


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
        'ASSIGNED',
        @TransactionId
    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
     WHERE TaskUnqId = @TaskUnqId AND @ProgressId > 0


    -- ADD ALL TASK ID IN A LIST
    DECLARE @IdList VARCHAR(100) = NULL;
    IF EXISTS(SELECT * FROM @udt_TaskAssignee)
    BEGIN
        ;WITH DATA1 AS 
        (
            SELECT TaskId
            FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
             WHERE TaskUnqId = @TaskUnqId
        )
        SELECT @IdList = CONCAT(@IdList,',',TaskId)
        FROM DATA1
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
    AssigneeName,
    AssigneeEmail,
    TaskDesc,
    [EmailBody],
    EmailSubject
    )
    SELECT 
    T.[TaskId],    
    CurrentTargetDate,
    T.TaskSubject,
    P.PriorityName,
    T.AssignerName,
    T.AssignerEmail,
    T.CoordinatorName,
    T.CoordinatorEmail,
    T.AssigneeName,
    T.AssigneeEmail,
    T.TaskDesc,
    N'', -- Initialize the EmailSubject with an empty string
    N'' -- Initialize the EmailBody with an empty string
    FROM [dbo].[Trn_TaskDetails] T WITH(NOLOCK)
    INNER JOIN [dbo].[Mst_TaskPriority] P WITH(NOLOCK) ON P.PriorityId = T.PriorityId
    WHERE TaskUnqId = @TaskUnqId;

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
    SET @Email_EmailBody = N'
                        <html>
                        <body>
                            <h1>New Task Created</h1>
                            <p><strong>Target Date:</strong> ' + @Email_TargetDate + N'</p>
                            <p><strong>Priority:</strong> ' + @Email_Priority + N'</p>
                            <p><strong>Task Subject:</strong> ' + @Email_TaskSubject + N'</p>
                            <p><strong>Task Description:</strong> ' + LEFT(@Email_TaskDesc, @MaxDescLength) + N'</p>';

                        -- Check if the Task Description is longer than the maximum length
                        IF LEN(@Email_TaskDesc) > @MaxDescLength
                        BEGIN
                            SET @Email_EmailBody = @Email_EmailBody + N'
                            <p>
                                <span id="taskDescShort">' + LEFT(@Email_TaskDesc, @MaxDescLength) + N'</span>
                                <span id="taskDescFull" style="display:none;">' + @Email_TaskDesc + N'</span>
                                <button onclick="showFullDescription()">Read More</button>
                            </p>
                            <script>
                                function showFullDescription() {
                                    document.getElementById("taskDescShort").style.display = "none";
                                    document.getElementById("taskDescFull").style.display = "inline";
                                }
                            </script>';
                        END

                        -- Complete the email body
                        SET @Email_EmailBody = @Email_EmailBody + N'
                            <h2>Stakeholders</h2>
                            <p><strong>Assigner:</strong> ' + @Email_AssignerName + N' (' + @Email_AssigneeEmail + N')</p>
                            <p><strong>Coordinator:</strong> ' + @Email_CoordinatorName + N' (' + @Email_CoordinatorEmail + N')</p>
                            <p><strong>Assignee:</strong> ' + @Email_AssigneeName + N' (' + @Email_AssigneeEmail + N')</p>
                        </body>
                        </html>
                        ';

    -- Update the @Emails table variable with the generated email body
    UPDATE @Emails
    SET [EmailBody] = @Email_EmailBody
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
        EmailBody,
        ToRecipient,
        FromRecipient,
        CreatedOnIST,
        CreatedOnUTC,
        [Status]
    )
    SELECT 
    T.[TaskId], 
    [EmailBody],
    STRING_AGG(CONCAT(T.AssignerEmail, ', ', T.CoordinatorEmail, ', ', T.AssigneeEmail), ', ') AS ToRecipient,
    T.AssignerEmail,
    DATEADD(MINUTE, 330, GETUTCDATE()),
    GETUTCDATE(),
    'CREATE-TASK'
    FROM @Emails E
    INNER JOIN [dbo].[Trn_TaskDetails] T WITH (NOLOCK) ON T.TaskId = E.[TaskId]
    GROUP BY T.[TaskId], [EmailBody], T.AssignerEmail


    COMMIT TRANSACTION
    SELECT 
        'Create task executed'     AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        @@IDENTITY				   AS Id,
        @IdList				       AS ReferenceNo,
        @TaskUnqId                 AS GuidId

END
