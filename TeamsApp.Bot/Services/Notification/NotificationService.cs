using Microsoft.ApplicationInsights;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Bot.Helpers;
using TeamsApp.Bot.Helpers.NotificationHelper;
using TeamsApp.Bot.Models;
using TeamsApp.Bot.Services.MicrosoftGraph;
using TeamsApp.Common.Models;
using TeamsApp.DataAccess.Data;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.Bot.Services.Notification
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger _logger;
        private readonly IConversationData _conversationData;
        private readonly IOptions<BotSettings> _botOptions;

        public NotificationService(
            ILogger<NotificationService> logger
            , IConversationData conversationData
            , IOptions<BotSettings> botOptions
            )
        {
            _logger = logger;
            _conversationData = conversationData;
            _botOptions = botOptions;
        }

        public async Task<NotificationResponseTrnModel> SendCard_PersonalScope(string userADID, Attachment cardAttachment, long referenceId)
        {
            try
            {
                if (!string.IsNullOrEmpty(userADID) && cardAttachment != null)
                {
                    Guid Id;
                    if (Guid.TryParse(userADID, out Id))
                    {
                        var conversationDetails = await _conversationData.GetConversationByUserId(Id);

                        if (conversationDetails != null && !string.IsNullOrEmpty(conversationDetails.ServiceUrl) && !string.IsNullOrEmpty(conversationDetails.ConversationId))
                        {
                            Uri url = new Uri(conversationDetails.ServiceUrl);
                            ConnectorClient connectorClient = new ConnectorClient(url, this._botOptions.Value.UserAppId, this._botOptions.Value.UserAppPassword);
                            var activity = new Activity()
                            {
                                Type = ActivityTypes.Message,
                                Conversation = new ConversationAccount()
                                {
                                    Id = conversationDetails.ConversationId
                                },
                                Attachments = new List<Attachment>()
                            {
                                cardAttachment
                            }
                            };
                            var result = await connectorClient.Conversations.SendToConversationAsync(activity);
                            if (result != null)
                            {
                                var returnObj = new NotificationResponseTrnModel();
                                returnObj.ReplyToId = result.Id;
                                returnObj.ActivityId = conversationDetails.ActivityId;
                                returnObj.ConversationId = conversationDetails.ConversationId;
                                returnObj.ServiceUrl = conversationDetails.ServiceUrl;
                                returnObj.UserName = conversationDetails.UserName;
                                returnObj.UserADID = conversationDetails.UserId.ToString();
                                returnObj.Status = "CREATE-TASK";
                                returnObj.TaskId = referenceId;
                                return returnObj;
                            }
                        }
                    }
                }
                return null;
            }
            catch ( Exception ex )
            {
                this._logger.LogError(ex, $"NotificationService --> SendCard_PersonalScope() execution failed for UserADID: {userADID}");
                ExceptionLogging.SendErrorToText(ex);
                return null;
            }            
        }

    }
}
