using Microsoft.Bot.Connector;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Tasks;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Tasks
{
    public class TaskHelper : ITaskHelper
    {
        private readonly ILogger _logger;
        private readonly ITaskServices taskServices;
        private readonly IConfiguration configuration;
        private readonly IMemoryCache memoryCache;
        private readonly IOptions<BotSettings> botOptions;

        public TaskHelper(ITaskServices taskServices, IConfiguration configuration, IMemoryCache memoryCache, IOptions<BotSettings> botOptions, ILogger<TaskHelper> logger)
        {
            this.botOptions = botOptions;
            this.taskServices = taskServices;
            this.memoryCache = memoryCache;
            this.configuration = configuration;
            this._logger = logger;
        }

        public async Task<bool> SendNewTaskNotificationViaEmailAsync(IEnumerable<TaskDetailsModel> taskDetailsModelList)
        {
            return await taskServices.SendNewTaskNotificationViaEmail(taskDetailsModelList);
        }
        public async Task<bool> SendUpdatedTaskNotificationViaEmailAsync(TaskDetailsModel taskDetails)
        {
            return await taskServices.SendUpdatedTaskNotificationViaEmail(taskDetails);
        }

        public async Task<bool> SendReassignTaskNotificationViaEmailAsync(TaskDetailsModel taskDetailsModel)
        {
            return await taskServices.SendReassignTaskNotificationViaEmail(taskDetailsModel);
        }

        public async Task<bool> SendReassignAllTaskNotificationViaEmailAsync(IEnumerable<TaskDetailsModel>taskDetailsList)
        {
            return await taskServices.SendReassignAllTaskNotificationViaEmail(taskDetailsList);
        }

        public async Task<bool> DeleteAdaptiveCardInChat(TaskNotificationResponseModel notifications)
        {
            bool returnVal = false;
            try
            {
                if (notifications != null)
                {
                    var serviceUrl = notifications.ServiceUrl;
                    using (ConnectorClient connectorClient = CreateBotConnectionClient(serviceUrl))
                    {
                        await connectorClient.Conversations.DeleteActivityAsync(notifications.ConversationId, notifications.ActivityId);
                    }
                }
                returnVal = true;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Error occurred while executing DeleteAdaptiveCardInChat.");
            }
            return returnVal;
        }

        public async Task<bool> UpdateAdaptiveCardInChat(TaskNotificationResponseModel notifications, Attachment attachment)
        {
            bool returnVal = false;
            try
            {
                if (notifications != null)
                {
                    //  create body to send
                    var activity = new Activity()
                    {
                        Type = ActivityTypes.Message,
                        Id = notifications.ReplyToId,
                        ReplyToId = notifications.ReplyToId,
                        Conversation = new ConversationAccount()
                        {
                            Id = notifications.ConversationId
                        },
                        Attachments = new List<Attachment>()
                        {
                            attachment
                        }
                    };
                    var serviceUrl = notifications.ServiceUrl;
                    using (ConnectorClient connectorClient = CreateBotConnectionClient(serviceUrl))
                    {
                        await connectorClient.Conversations.UpdateActivityAsync(activity);
                    }
                }
                returnVal = true;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Error occurred while executing UpdateAdaptiveCardInChat method.");
            }
            return returnVal;
        }

        private ConnectorClient CreateBotConnectionClient(string serviceUrl)
        {
            Uri url = new Uri(serviceUrl);
            string appId = "";
            string appPwd = "";
           
            appId = this.botOptions.Value.MicrosoftAppId;
            appPwd = this.botOptions.Value.MicrosoftAppPassword;

            return new ConnectorClient(url, appId, appPwd);
        }

    }
}
