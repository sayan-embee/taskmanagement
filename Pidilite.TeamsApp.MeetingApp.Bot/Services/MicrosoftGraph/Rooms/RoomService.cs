// <copyright file="UsersService.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.ApplicationInsights;
    using Microsoft.Extensions.Logging;
    using Microsoft.Graph;
    using Newtonsoft.Json.Linq;
    using Pidilite.TeamsApp.MeetingApp.Bot.Models;
    using Pidilite.TeamsApp.MeetingApp.Common.Extensions;
    using Pidilite.TeamsApp.MeetingApp.Common.Models;

    /// <summary>
    /// Users service.
    /// </summary>
    public class RoomService : IRoomService
    {
        private readonly IGraphServiceClient graphServiceClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="UsersService"/> class.
        /// </summary>
        /// <param name="graphServiceClient">graph service client.</param>

        /// <summary>
        /// Logs errors and information.
        /// </summary>
        private readonly ILogger<RoomService> logger;

        internal RoomService(IGraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient ?? throw new ArgumentNullException(nameof(graphServiceClient));
        }
        public async Task<Place> GetRoomAsync(string roomId)
        {
            var graphResult = await this.graphServiceClient
                    .Places[roomId]
                    .Request()
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();
            return graphResult;
        }
        public async Task<IEnumerable<Place>> GetAllRoomsAsync(string filter)
        {
            var filterString = "startswith(displayName, '"+filter+"')";
            var returnList = new List<Place>();

                var placesUrl = this.graphServiceClient.Places
                .AppendSegmentToRequestUrl("microsoft.graph.room");

                var filteredList = await new GraphServicePlacesCollectionRequestBuilder(placesUrl, graphServiceClient)
                .Request()
                .Filter(filterString)
                .GetAsync();
                do
                {
                    IEnumerable<Place> searchedList = filteredList.CurrentPage;

                    returnList.AddRange(searchedList.Cast<Place>());

                    // If there are more result.
                    if (filteredList.NextPageRequest != null)
                    {
                        filteredList = await filteredList.NextPageRequest.GetAsync();
                    }
                    else
                    {
                        break;
                    }
                }
                while (filteredList.CurrentPage != null);
                return returnList;
            }

        public async Task<IList<ScheduleInformation>> GetRoomSchedule(RoomScheduleModel roomSchedule)
        {
            try
            {
                var scheduleList = new List<ScheduleInformation>();

                var schedules = new List<String>();
                schedules.Add(roomSchedule.RoomEmail);

                var startTime = new DateTimeTimeZone
                {
                    DateTime = roomSchedule.StartDateTime,
                    TimeZone = roomSchedule.Timezone
                };

                var endTime = new DateTimeTimeZone
                {
                    DateTime = roomSchedule.EndDateTime,
                    TimeZone = roomSchedule.Timezone
                };
                var availabilityViewInterval = roomSchedule.TimeInterval;

                var graphResult = await this.graphServiceClient
                    .Me
                    .Calendar
                    .GetSchedule(schedules, endTime, startTime, availabilityViewInterval)
                    .Request()
                    .Header("Prefer", $"outlook.timezone=\"{roomSchedule.Timezone}\"")
                    .PostAsync();
                if (graphResult != null)
                {
                    do
                    {
                        IList<ScheduleInformation> searchedList = graphResult.CurrentPage;

                        scheduleList.AddRange(searchedList.Cast<ScheduleInformation>());

                        // If there are more result.
                        if (graphResult.NextPageRequest != null)
                        {
                            graphResult = await graphResult.NextPageRequest.PostAsync();
                        }
                        else
                        {
                            break;
                        }
                    }
                    while (graphResult.CurrentPage != null);
                    return scheduleList;
                }
            }
            catch(Exception ex)
            {
                this.logger.LogError(ex, "Error occurred while calling get schedule method for rooms from room services.");
                return null;
            }
            return null;
        }

    }
}