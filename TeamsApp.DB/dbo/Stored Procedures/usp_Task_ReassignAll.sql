CREATE PROCEDURE [dbo].[usp_Task_ReassignAll]
(
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(100) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL,
    @AssigneeName NVARCHAR(100) = NULL,
    @AssigneeEmail NVARCHAR(100) = NULL,
    @AssigneeUPN NVARCHAR(50) = NULL,
    @AssigneeADID NVARCHAR(50) = NULL,
    @PrevAssigneeName NVARCHAR(100) = NULL,
    @PrevAssigneeEmail NVARCHAR(100) = NULL,
    @PrevAssigneeUPN NVARCHAR(100) = NULL,
    @PrevAssigneeADID NVARCHAR(50) = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL
)
AS
BEGIN

DECLARE @TaskId BIGINT;
DECLARE @RoleId INT;

DECLARE @temp_table_role TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0,
  RoleName NVARCHAR(50) NULL,
  RoleCode NVARCHAR(50) NULL
)

DECLARE @temp_table_task TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0
)

DECLARE @temp_table_result TABLE
(
  TaskId INT DEFAULT 0,
  RoleId INT DEFAULT 0
)

DECLARE @temp_table_return TABLE
(
  [Message] NVARCHAR(50) NULL,
  ErrorMessage NVARCHAR(50) NULL,
  [Status] INT DEFAULT 0,
  Id INT DEFAULT 0,
  ReferenceNo NVARCHAR(MAX) NULL,
  GuidId UNIQUEIDENTIFIER NULL
)


    INSERT INTO @temp_table_task
    (
        tempTask.TaskId
    )
    SELECT
        T.TaskId
    FROM [dbo].[Trn_TaskDetails] T
    WHERE
    (
        T.[AssignerEmail] = @UpdatedByEmail
        OR T.[CoordinatorEmail] = @UpdatedByEmail
        --OR [CollaboratorEmail] = @Email
    )
    AND T.IsActive = 1
    AND T.StatusId != 3
    AND T.AssigneeEmail = @PrevAssigneeEmail

	--SELECT * FROM @temp_table_task

    IF EXISTS (SELECT TaskId FROM @temp_table_task)
    BEGIN

        IF EXISTS(SELECT 1 FROM [dbo].[Trn_Request_TaskDetails] WITH(NOLOCK) WHERE TaskId IN (SELECT TaskId FROM @temp_table_task) AND IsActive = 1 AND ISNULL(IsCancelled,0) = 0)
        BEGIN
            SELECT 
                'Reassign task failed, Pending request exists'                                              AS [Message],
                ''					                                                                        AS ErrorMessage,
                0						                                                                    AS [Status],
                0				                                                                            AS Id,
                ''						                                                                    AS ReferenceNo
            RETURN
        END

        INSERT INTO @temp_table_role EXEC usp_Task_CheckRole_ByTaskId @Id = 0, @Email = @UpdatedByEmail

        IF EXISTS (SELECT RoleId FROM @temp_table_role)
        BEGIN
            UPDATE tempTask
                SET tempTask.RoleId = tempRole.RoleId
            FROM @temp_table_task tempTask,
            @temp_table_role tempRole
            WHERE
            tempTask.TaskId = tempRole.TaskId

			--SELECT * FROM @temp_table_role

            -- LOOP START

            SELECT @TaskId = MIN(TaskId) FROM @temp_table_task
            SELECT @RoleId = NULL

			WHILE @TaskId IS NOT NULL
			BEGIN
                SELECT @RoleId = RoleId
                FROM @temp_table_task
                WHERE TaskId = @TaskId

				INSERT INTO @temp_table_return 
                EXEC usp_Task_Reassign
                @TaskId = @TaskId,
                @UpdatedByName = @UpdatedByName,
                @UpdatedByEmail = @UpdatedByEmail,
                @UpdatedByUPN = @UpdatedByUPN,
                @UpdatedByADID  = @UpdatedByADID,
                @AssigneeName  = @AssigneeName,
                @AssigneeEmail = @AssigneeEmail,
                @AssigneeUPN  = @AssigneeUPN,
                @AssigneeADID  = @AssigneeADID,
                @RoleId = @RoleId,
                @ProgressRemarks = @ProgressRemarks

				SELECT @TaskId = MIN(TaskId)
                FROM @temp_table_task
                WHERE TaskId > @TaskId
			END

            -- LOOP END

            SELECT
                [Message]
                ErrorMessage,
                [Status],
                Id,
                ReferenceNo,
                GuidId
            FROM @temp_table_return
            
        END
    END
END
