CREATE PROCEDURE [dbo].[usp_Task_InsertComments]
(
    @TaskId BIGINT = NULL,
    @RoleId INT = NULL,
    @ProgressRemarks NVARCHAR(500) = NULL,
    @UpdatedByName NVARCHAR(100) = NULL,
    @UpdatedByEmail NVARCHAR(100) = NULL,
    @UpdatedByUPN NVARCHAR(50) = NULL,
    @UpdatedByADID NVARCHAR(50) = NULL
)
AS
BEGIN

DECLARE @TransactionId AS UNIQUEIDENTIFIER = NEWID ();

    BEGIN TRANSACTION

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
        @ProgressRemarks,
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
		    'Comments insert failed'    AS [Message],
		    ''					        AS ErrorMessage,
		    0						    AS [Status],
		    0				            AS Id,
		    ''						    AS ReferenceNo
	    RETURN
    END

    UPDATE [dbo].[Trn_TaskDetails]
    SET
        [TransactionId] = @TransactionId
    WHERE [TaskId] = @TaskId

    COMMIT TRANSACTION
    SELECT 
        'Comments insert executed' AS [Message],
        ''						   AS ErrorMessage,
        1					       AS [Status],
        @@IDENTITY				   AS Id,
        ''				           AS ReferenceNo

END
