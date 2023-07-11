CREATE TYPE [dbo].[UDT_TaskParticipants] AS TABLE
(
	AssignedTo NVARCHAR(100) NULL, 
    AssignedToEmail NVARCHAR(100) NULL, 
    AssignedToADID NVARCHAR(50) NULL  
)
