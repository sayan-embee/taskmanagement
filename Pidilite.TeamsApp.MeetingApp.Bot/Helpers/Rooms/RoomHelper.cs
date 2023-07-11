
namespace Pidilite.TeamsApp.MeetingApp.Bot.Helper
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.ApplicationInsights;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.Graph;
    using Pidilite.TeamsApp.MeetingApp.Bot.Models;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
    using Pidilite.TeamsApp.MeetingApp.Common.Models;


    public class RoomHelper : IRoomHelper
    {

        private readonly IRoomService roomGraphService;

        /// <summary>
        /// Instance of memory cache to cache
        /// </summary>
        private readonly IMemoryCache memoryCache;

        /// <summary>
        /// A set of key/value application configuration properties.
        /// </summary>
        private readonly IOptions<BotSettings> botOptions;

        /// <summary>
        /// Logs errors and information.
        /// </summary>
        private readonly ILogger logger;

        /// <summary>
        /// Telemetry client to log event and errors.
        /// </summary>
        private readonly TelemetryClient telemetryClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserHelper"/> class.
        /// </summary>
        /// <param name="userGraphService">The instance of user Graph service to access logged in user's reportees and manager.</param>
        /// <param name="memoryCache">Instance of memory cache to cache reportees for managers.</param>
        /// <param name="botOptions">A set of key/value application configuration properties.</param>
        public RoomHelper(IRoomService roomGraphService, IMemoryCache memoryCache, IOptions<BotSettings> botOptions, TelemetryClient telemetryClient, ILogger<RoomHelper> logger)
        {
            this.botOptions = botOptions;
            this.roomGraphService = roomGraphService;
            this.memoryCache = memoryCache;
            this.logger = logger;
            this.telemetryClient = telemetryClient;
        }
        /// <summary>
        /// Get rooms list based on filter.
        /// </summary>
        /// <param name="roomId">filter query.</param>
        /// <returns>A particular room.</returns>
        public async Task<RoomModel> GetRoomAsync(string roomId)
        {
            RoomModel model = null;
            var result = await this.roomGraphService.GetRoomAsync(roomId);

            if (result != null)
            {
                model = new RoomModel();
                model.Id = result.Id;
                model.DisplayName = result.DisplayName;
                if (result.AdditionalData != null && result.AdditionalData.Count > 0)
                {
                    var email = result.AdditionalData.Where(x => x.Key.ToLower() == "emailAddress".ToLower()).FirstOrDefault();
                    if (email.Value != null)
                    {
                        model.Email = email.Value.ToString();
                    }
                }
            }
            return model;
        }

        /// <summary>
        /// Get rooms list based on filter.
        /// </summary>
        /// <param name="filter">filter query.</param>
        /// <returns>List of room.</returns>
        public async Task<IEnumerable<RoomModel>> GetAllRoomsAsync(string filter)
        {
            List<RoomModel> modalList = new List<RoomModel>();
            var results = await this.roomGraphService.GetAllRoomsAsync(filter);
            if (results != null && results.Count() > 0)
            {
                foreach (var room in results)
                {
                    var modal = new RoomModel();
                    modal.Id = room.Id;
                    modal.DisplayName = room.DisplayName;
                    if (room.AdditionalData != null && room.AdditionalData.Count > 0)
                    {
                        var email = room.AdditionalData.Where(x => x.Key.ToLower() == "emailAddress".ToLower()).FirstOrDefault();
                        if (email.Value != null)
                        {
                            modal.Email = email.Value.ToString();
                        }
                        modalList.Add(modal);
                    }
                }
            }
                return (modalList);
            }

        /// <summary>
        /// Get rooms list based on filter.
        /// </summary>
        /// <param name="filter">filter query.</param>
        /// <returns>List of room.</returns>
        public async Task<RoomScheduleModel> GetRoomScheduleAsync(RoomScheduleModel roomScheduleModel)
        {
            try
            {
                var roomSchedule = await this.roomGraphService.GetRoomSchedule(roomScheduleModel);
                if(roomSchedule != null && roomSchedule.Count() > 0)
                {
                    roomScheduleModel.ScheduleId = roomSchedule.FirstOrDefault().ScheduleId;
                    roomScheduleModel.AvailabilityView = roomSchedule.FirstOrDefault().AvailabilityView;
                    if(roomSchedule.FirstOrDefault().ScheduleItems.Count() > 0)
                    {
                        roomScheduleModel.Status = roomSchedule.FirstOrDefault().ScheduleItems.FirstOrDefault().Status.ToString();
                    }
                    else
                    {
                        roomScheduleModel.Status = "free";
                    }
                }
                return roomScheduleModel;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error occurred while calling get schedule method for rooms from rooms helper.");
            }
            return null;
        }
    }
}