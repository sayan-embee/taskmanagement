CREATE TYPE [dbo].[udt_TaskAssignee] AS TABLE
(
	AssigneeName NVARCHAR(100) NULL,
	AssigneeEmail NVARCHAR(100) NULL,
	AssigneeUPN NVARCHAR(50) NULL,
	AssigneeADID NVARCHAR(50) NULL
)
