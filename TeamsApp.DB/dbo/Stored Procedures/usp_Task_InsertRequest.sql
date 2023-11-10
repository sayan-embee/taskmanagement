CREATE PROCEDURE [dbo].[usp_Task_InsertRequest]
(
    @TaskId BIGINT,
    @StatusId INT,
    @PriorityId INT,
    @RoleId INT,
    @ParentTaskId BIGINT,
    @CreatedByName NVARCHAR(100),
    @CreatedByEmail NVARCHAR(100),
    @CreatedByUPN NVARCHAR(100),
    @CreatedByADID NVARCHAR(50),
    @TaskSubject NVARCHAR(200),
    @TaskDesc NVARCHAR(500),
    @CurrentTargetDate DATETIME,
    @RequestRemarks NVARCHAR(500)
)
AS
BEGIN

    DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();
    DECLARE @TaskUnqId AS UNIQUEIDENTIFIER = NULL;
    DECLARE @JSONString NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT TaskId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId)
    BEGIN

    IF EXISTS (SELECT RequestId FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId AND IsActive = 1 AND ISNULL(IsCancelled,0) != 1)
    BEGIN
        SELECT 
        'Pending request(s) exist'                                                      AS [Message],
        ''					                                                            AS ErrorMessage,
        0						                                                        AS [Status],
        0				                                                                AS Id,
        ''						                                                        AS ReferenceNo
        RETURN
    END

    BEGIN TRANSACTION

        SELECT @TaskUnqId = TaskUnqId FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK) WHERE TaskId = @TaskId

	    INSERT INTO [dbo].[Trn_Request_TaskDetails]
        (
            [TaskId],
            [StatusId],
            [PriorityId],
            [RequestorRoleId],
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
            [CurrentTargetDate],
            [TransactionId],
            [RequestRemarks]
        )
        VALUES 
        (
            @TaskId,
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
            @CurrentTargetDate,
            @TransactionId,
            @RequestRemarks
        )

        IF @@ERROR<>0
        BEGIN
	        ROLLBACK TRANSACTION
	        SELECT 
		        'Request task failed'   AS [Message],
		        ''					    AS ErrorMessage,
		        0						AS [Status],
		        0				        AS Id,
		        ''						AS ReferenceNo
	        RETURN
        END


        -- UPDATE REF NO
        UPDATE [dbo].[Trn_Request_TaskDetails]
        SET RequestRefNo = 'REQ-' + CAST(FORMAT(@@IDENTITY,'000000') AS NVARCHAR(100))
        WHERE RequestId = @@IDENTITY


        -- ADD ALL TASK ID IN A LIST
        --DECLARE @IdList VARCHAR(MAX) = NULL;
        --;WITH DATA1 AS 
        --(
        --    SELECT TaskId
        --    FROM [dbo].[Trn_TaskDetails] WITH(NOLOCK)
        --        WHERE TaskId = @TaskId
        --)
        --SELECT @IdList = CONCAT(@IdList,',',TaskId)
        --FROM DATA1

        SET @JSONString = (
        SELECT
            RQ.RequestId,
            RQ.CurrentTargetDate AS 'CurrentTargetDate',
            T.[TaskId],
            T.[TaskRefNo],
            T.[TaskUnqId],
            T.[StatusId],
            S.[StatusName],
            T.[PriorityId],
            P.[PriorityName],
            RQ.[RequestorRoleId] AS 'RoleId',
            R.[RoleName],
            T.[ParentTaskId],
            T.[IsActive],
            RQ.[CreatedOnIST],
            --RQ.[CreatedOnUTC],
            RQ.[CreatedByName],
            --RQ.[CreatedByEmail],
            --RQ.[CreatedByUPN],
            --RQ.[CreatedByADID],
            T.[TaskSubject],
            T.[TaskDesc],
            --[InitialTargetDate],
            T.[CurrentTargetDate] AS 'InitialTargetDate',
            T.[AssignerName],
            T.[AssignerEmail],
            T.[AssignerUPN],
            T.[AssignerADID],
            T.[AssigneeName],
            T.[AssigneeEmail],
            T.[AssigneeUPN],
            T.[AssigneeADID],
            T.[CoordinatorName],
            T.[CoordinatorEmail],
            T.[CoordinatorUPN],
            T.[CoordinatorADID],
            T.[CollaboratorName],
            T.[CollaboratorEmail],
            T.[CollaboratorUPN],
            T.[CollaboratorADID],
            RQ.[UpdatedOnIST],
            RQ.[UpdatedByName],
            CASE WHEN CONVERT(DATE,DATEADD(MINUTE, 330, GETUTCDATE()),103) > (CONVERT(DATE, T.CurrentTargetDate, 103)) AND T.StatusId != 3 THEN 1 ELSE 0 END AS 'IsOverdue'
        FROM [dbo].[Trn_Request_TaskDetails] RQ WITH(NOLOCK)
        INNER JOIN [dbo].[Trn_TaskDetails] T WITH(NOLOCK) ON T.TaskId = RQ.TaskId
        INNER JOIN [dbo].[Mst_TaskStatus] S ON S.StatusId = T.StatusId
        INNER JOIN [dbo].[Mst_TaskPriority] P ON P.PriorityId = T.PriorityId
        INNER JOIN [dbo].[Mst_Role] R ON R.RoleId = T.RoleId
        WHERE RQ.RequestId = @@IDENTITY
        --FOR JSON AUTO
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        );


        -- EMAIL NOTIFICATION START

        
        -- Declare variables
        DECLARE @Email_TaskId BIGINT;
        DECLARE @Email_RequestId INT;
        DECLARE @Email_RequestedTargetDate NVARCHAR(100);
        DECLARE @Email_ActualTargetDate NVARCHAR(100);
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
        [RequestId] INT,
        RequestedTargetDate NVARCHAR(100),
        ActualTargetDate NVARCHAR(100),
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
        RequestId,
        RequestedTargetDate,
        ActualTargetDate,
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
        R.RequestId,
        CONVERT(NVARCHAR(20), R.CurrentTargetDate, 103),
        CONVERT(NVARCHAR(20), T.CurrentTargetDate, 103),
        T.TaskSubject,
        P.PriorityName,
        T.AssignerName,
        T.AssignerEmail,
        T.CoordinatorName,
        T.CoordinatorEmail,
        T.CollaboratorName,
        T.CollaboratorEmail,
        R.CreatedByName,
        R.CreatedByEmail,
        T.TaskDesc,
        N'', -- Initialize the EmailSubject with an empty string
        N'' -- Initialize the EmailBody with an empty string
        FROM [Trn_Request_TaskDetails] R WITH(NOLOCK)
        INNER JOIN [dbo].[Trn_TaskDetails] T WITH(NOLOCK) ON T.TaskId = R.TaskId
        INNER JOIN [dbo].[Mst_TaskPriority] P WITH(NOLOCK) ON P.PriorityId = T.PriorityId
        WHERE R.RequestId = @@IDENTITY;


        -- Loop through the @Emails table variable
        DECLARE emailCursor CURSOR FOR
        SELECT
        [TaskId],
        RequestId,
        RequestedTargetDate,
        ActualTargetDate,
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
        @Email_RequestId,
        @Email_RequestedTargetDate,
        @Email_ActualTargetDate,
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
        SET @Email_EmailSubject = 'Task Approval Notification - Task App V2';

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
                                    <h3>The following task details has been requested & waiting for approval:</h3>
                                    <p class="indented-paragraph"><strong>Requested Target Date:</strong> ' + @Email_RequestedTargetDate + N'</p>
                                    <p class="indented-paragraph"><strong>Actual Target Date:</strong> ' + @Email_ActualTargetDate + N'</p>
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
                                    <p class="indented-paragraph"><strong>Assignee:</strong> ' + @Email_AssigneeName + N' (' + @Email_AssigneeEmail + N')</p>
                                </body>
                                </html>
                            ';

        -- Update the @Emails table variable with the generated email body
        UPDATE @Emails
        SET [EmailBody] = @Email_EmailBody,
        [EmailSubject] = @Email_EmailSubject
        WHERE [RequestId] = @Email_RequestId;

        -- Fetch the next task
        FETCH NEXT FROM emailCursor INTO
        @Email_TaskId,
        @Email_RequestId,
        @Email_RequestedTargetDate,
        @Email_ActualTargetDate,
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
        INSERT INTO [dbo].[Trn_RequestedTaskEmailNotification]
        (
            TaskId,
            RequestId,
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
            RequestId,
            [EmailSubject],
            [EmailBody],
            STRING_AGG(CONCAT(T.AssignerEmail, ', ', T.CoordinatorEmail, ', ', T.CollaboratorEmail, ', ', T.AssigneeEmail), ', ') AS ToRecipient,
            --STRING_AGG(CONCAT(T.CollaboratorEmail, ', '), ', ') AS ToRecipient,
            T.AssigneeEmail,
            DATEADD(MINUTE, 330, GETUTCDATE()),
            GETUTCDATE(),
            'REQUEST-TASK',
            @TransactionId
        FROM @Emails E
        INNER JOIN [dbo].[Trn_TaskDetails] T WITH (NOLOCK) ON T.TaskId = E.[TaskId]
        GROUP BY T.[TaskId], RequestId, [EmailSubject], [EmailBody], T.AssigneeEmail, T.TransactionId

        -- EMAIL NOTIFICATION END


        COMMIT TRANSACTION
        SELECT
            'Request task executed'    AS [Message],
            ''						   AS ErrorMessage,
            1					       AS [Status],
            @@IDENTITY				   AS Id,
            @JSONString				   AS ReferenceNo,
            @TaskUnqId                 AS GuidId,
            @TransactionId             AS TransactionId

    END

END
