CREATE TABLE [dbo].[Mst_TimeZone](
	[TimeZoneId] [int] IDENTITY(1,1) NOT NULL,
	[TimeZoneName] [varchar](100) NULL,
	[TimeZoneDescription] [varchar](100) NULL,
	[SortOrder] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[TimeZoneId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
