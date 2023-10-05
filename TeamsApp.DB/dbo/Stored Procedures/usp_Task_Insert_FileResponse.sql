CREATE PROCEDURE [dbo].[usp_Task_Insert_FileResponse]
(
	@udt_TaskFileResponse udt_TaskFileResponse NULL READONLY
)
AS 
BEGIN

	INSERT INTO [dbo].[Trn_TaskFileDetails]
    (
        [TaskId],
        [RoleId],
        [FileName],
        [UnqFileName],
        [FileDesc],
        [FileUrl],
        [FileSize],
        [ContentType],
        [IsActive],
        [CreatedOnIST],
        [CreatedOnUTC],
        [CreatedByName],
        [CreatedByEmail],
        [CreatedByUPN],
        [CreatedByADID],
        --[UpdatedOnIST],
        --[UpdatedOnUTC],
        --[UpdatedByName],
        --[UpdatedByEmail],
        --[UpdatedByUPN],
        --[UpdatedByADID],
        [TransactionId]
    )
    SELECT
        [TaskId],
        [RoleId],
        [FileName],
        [UnqFileName],
        [FileDesc],
        [FileUrl],
        [FileSize],
        [ContentType],
        [IsActive],
        DATEADD(MINUTE, 330, GETUTCDATE()),
        GETUTCDATE(),
        [CreatedByName],
        [CreatedByEmail],
        [CreatedByUPN],
        [CreatedByADID],
        --[UpdatedOnIST],
        --[UpdatedOnUTC],
        --[UpdatedByName],
        --[UpdatedByEmail],
        --[UpdatedByUPN],
        --[UpdatedByADID],
        [TransactionId]
    FROM @udt_TaskFileResponse

END