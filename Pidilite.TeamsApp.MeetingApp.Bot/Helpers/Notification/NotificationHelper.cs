using Microsoft.ApplicationInsights;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.DataAccess.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helper
{
    public class NotificationHelper : INotificationHelper
    {
        private readonly ILogger<NotificationHelper> _logger;

        /// <summary>
        /// Telemetry client to log event and errors.
        /// </summary>
        ///
        private readonly TelemetryClient _telemetryClient;

        private readonly IOptions<BotSettings> _botOptions;
        private readonly IConversationData _conversationData;
        private readonly ITeamsServices _teamsServices;
        private readonly IConfiguration _configuration;
        public NotificationHelper(
            ILogger<NotificationHelper> logger,
            TelemetryClient telemetryClient,
            IOptions<BotSettings> botOptions,
            IConversationData conversationData,
            ITeamsServices teamsServices,
            IConfiguration configuration)
        {
            this._telemetryClient = telemetryClient ?? throw new ArgumentNullException(nameof(telemetryClient));
            this._logger = logger;
            this._botOptions = botOptions ?? throw new ArgumentNullException(nameof(botOptions));
            this._conversationData = conversationData ?? throw new ArgumentNullException(nameof(conversationData));
            this._teamsServices = teamsServices ?? throw new ArgumentNullException(nameof(teamsServices));
            this._configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }
        public async Task<TaskNotificationResponseModel> SendNewNotificationInPersonalScopeAsync(string userAdId, Attachment cardToSend)
        {
            TaskNotificationResponseModel responseModel = new TaskNotificationResponseModel();
            Guid userId;
            if(Guid.TryParse(userAdId, out userId))
            {
                var conversation=await _conversationData.GetConversationByUserId(userId);
                //Check & Install app for user - in order to receive adaptive card notification
                //if (conversation == null)
                //{
                //    string AppId1 = _configuration.GetValue<string>("MeetProApp:AppId");
                //    var result1 = await _teamsServices.InstallAppForUser(AppId1, userAdId);
                //    if (result1)
                //    {
                //        conversation = await _conversationData.GetConversationByUserId(userId);
                //    }
                //}

                if (conversation == null)
                {
                    return null;
                }

                Uri url = new Uri(conversation.ServiceUrl);
                //MicrosoftAppCredentials.TrustServiceUrl(conversation.ServiceUrl);
                ConnectorClient connectorClient = new ConnectorClient(url, this._botOptions.Value.MicrosoftAppId, this._botOptions.Value.MicrosoftAppPassword);
                // construct the activity we want to post
                var activity = new Activity()
                {
                    Type = ActivityTypes.Message,
                    Conversation = new ConversationAccount()
                    {
                        Id = conversation.ConversationId
                    },
                    Attachments = new List<Attachment>()
                    {
                        cardToSend
                    }
                };
                // shoot the activity over
                var response = await connectorClient.Conversations.SendToConversationAsync(activity);
                responseModel.ReplyToId = response.Id;
                responseModel.ActivityId = response.Id;
                responseModel.ConversationId = conversation.ConversationId;
                responseModel.ServiceUrl = conversation.ServiceUrl;
                responseModel.UserName = conversation.UserName;
                responseModel.UserADID = userAdId;
            }
            return responseModel;
        }
    }
}
