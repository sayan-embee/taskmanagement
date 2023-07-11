﻿using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Pidilite.TeamsApp.MeetingApp.Bot.MeetingApp;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.DataAccess.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Bots
{
    public class AppLifecycleHandler : IAppLifecycleHandler
    {/// <summary>
     /// Instance to send logs to the Application Insights service.
     /// </summary>
        private readonly ILogger<AppLifecycleHandler> logger;

        /// <summary>
        /// Instance of adaptive card service to create and get adaptive cards.
        /// </summary>
        private readonly IAdaptiveCardService adaptiveCardService;

        /// <summary>
        /// The instance of repository accessors to access repositories.
        /// </summary>
        private readonly IConversationData conversationData;

        /// <summary>
        /// Represents the task module height.
        /// </summary>
        private const int TaskModuleHeight = 450;

        /// <summary>
        /// Represents the task module width.
        /// </summary>
        private const int TaskModuleWidth = 750;

        private readonly IOptions<BotSettings> botOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="AppLifecycleHandler"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="adaptiveCardService">Instance of adaptive card service to create and get adaptive cards.</param>
        /// <param name="repositoryAccessors">The instance of repository accessors.</param>
        public AppLifecycleHandler(
            ILogger<AppLifecycleHandler> logger,
            IAdaptiveCardService adaptiveCardService,
            IConversationData conversationData,
            IOptions<BotSettings> botOptions)
        {
            this.logger = logger;
            this.adaptiveCardService = adaptiveCardService;
            this.conversationData = conversationData;
            this.botOptions = botOptions;
        }

        /// <summary>
        /// Sends welcome card to user when bot is installed in personal scope.
        /// </summary>
        /// <param name="turnContext">Provides context for a turn in a bot.</param>
        /// <returns>A task that represents a response.</returns>
        public async Task OnBotInstalledInPersonalAsync(ITurnContext<IConversationUpdateActivity> turnContext)
        {
            turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext), "Turncontext cannot be null");

            this.logger.LogInformation($"Bot added in personal scope for user {turnContext.Activity.From.AadObjectId}");

            var activity = turnContext.Activity;

            // Add or update user details when bot is installed.
            var existingRecord = await this.conversationData.GetConversationByUserId(Guid.Parse(turnContext.Activity.From.AadObjectId));

            if (existingRecord != null)
            {
                var userConversation = existingRecord;
                userConversation.ConversationId = activity.Conversation.Id;
                userConversation.ServiceUrl = activity.ServiceUrl;
                userConversation.BotInstalledOn = DateTime.UtcNow;

                userConversation.UserId = Guid.Parse(activity.From.AadObjectId);
                userConversation.UserName = activity.From.Name;
                userConversation.ActivityId = activity.Id;
                userConversation.TenantId = Guid.Parse(activity.Conversation.TenantId);
                userConversation.RecipientId = activity.Recipient.Id;
                userConversation.RecipientName = activity.Recipient.Name;

                try
                {
                    var member1 = await TeamsInfo.GetMemberAsync(turnContext, turnContext.Activity.From.Id, cancellationToken: default);
                    if (member1 != null)
                    {
                        userConversation.UserEmail = member1.Email;
                        userConversation.UserName = member1.Name;
                        userConversation.UserPrincipalName = member1.UserPrincipalName;
                    }
                }
                catch (Exception ex)
                {
                    this.logger.LogError(ex, $"Unable to execute GetMemberAsync when user installed bot -  {activity.From.AadObjectId}.");
                }
                await this.conversationData.Update(userConversation);
                var userWelcomeCardAttachment = this.adaptiveCardService.GetWelcomeCardForPersonalScope();
                await turnContext.SendActivityAsync(MessageFactory.Attachment(userWelcomeCardAttachment));

            }
            else
            {

                var userConversationDetails = new ConversationModel
                {
                    BotInstalledOn = DateTime.Now,
                    ConversationId = activity.Conversation.Id,
                    ServiceUrl = activity.ServiceUrl,
                    UserId = Guid.Parse(activity.From.AadObjectId),
                    UserName = activity.From.Name,
                    ActivityId = activity.Id,
                    TenantId = Guid.Parse(activity.Conversation.TenantId),
                    RecipientId = activity.Recipient.Id,
                    RecipientName = activity.Recipient.Name,

                };
                try
                {
                    var member1 = await TeamsInfo.GetMemberAsync(turnContext, turnContext.Activity.From.Id, cancellationToken: default);
                    if (member1 != null)
                    {
                        userConversationDetails.UserEmail = member1.Email;
                        userConversationDetails.UserName = member1.Name;
                        userConversationDetails.UserPrincipalName = member1.UserPrincipalName;
                    }
                }
                catch (Exception ex)
                {
                    this.logger.LogError(ex, $"Unable to execute GetMemberAsync when user installed bot -  {activity.From.AadObjectId}.");
                }
                await this.conversationData.Insert(userConversationDetails);
                var userWelcomeCardAttachment = this.adaptiveCardService.GetWelcomeCardForPersonalScope();
                await turnContext.SendActivityAsync(MessageFactory.Attachment(userWelcomeCardAttachment));

            }
            this.logger.LogInformation($"Successfully installed app for user {activity.From.AadObjectId}.");
        }

        #region Task module
        private Task<TaskModuleResponse> GetTaskModuleResponseAsync(string taskModuleTitle, string taskModuleUrl, string queryParams = "")
        {
            return Task.FromResult(new TaskModuleResponse
            {
                Task = new TaskModuleContinueResponse
                {
                    Value = new TaskModuleTaskInfo()
                    {
                        Url = queryParams != "" ? $"{taskModuleUrl}?theme={{theme}}&locale={{locale}}&{queryParams}" : $"{taskModuleUrl}?theme={{theme}}&locale={{locale}}",
                        Height = TaskModuleHeight,
                        Width = TaskModuleWidth,
                        Title = taskModuleTitle,
                    },
                },
            });
        }

        public Task<TaskModuleResponse> OnFetchAsync(ITurnContext<IInvokeActivity> turnContext, TaskModuleRequest taskModuleRequest)
        {
            try
            {
                var postedValues = JsonConvert.DeserializeObject<AdaptiveCardActionModel>(JObject.Parse(taskModuleRequest?.Data?.ToString()).ToString());
                string command = postedValues.Command;
                var queryParams = "";
                switch (command.ToUpperInvariant())
                {
                    case BotCommandConstants.viewTask:
                        queryParams = $"id={postedValues.TaskId}";
                        this.logger.LogInformation($"Invoking task module for task id :{postedValues.TaskId}.");
                        return GetTaskModuleResponseAsync(taskModuleTitle: "View Task", taskModuleUrl: $"{this.botOptions.Value.AppBaseUri}/viewparticulartask", queryParams: queryParams);
                    case BotCommandConstants.updateTask:
                        queryParams = $"id={postedValues.TaskId}";
                        this.logger.LogInformation($"Invoking task module for task id :{postedValues.TaskId}.");
                        return GetTaskModuleResponseAsync(taskModuleTitle: "Update Task", taskModuleUrl: $"{this.botOptions.Value.AppBaseUri}/updatetask", queryParams: queryParams);
                    default:
                        this.logger.LogInformation($"Invalid command for task module fetch activity.Command is : {command} ");
                        return null;
                }

            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error while fetch event is received from the user.");
                throw;
            }
        }

        public async Task<TaskModuleResponse> OnSubmitAsync(ITurnContext<IInvokeActivity> turnContext, TaskModuleRequest taskModuleRequest)
        {
            try
            {
                turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
                var activity = (Activity)turnContext.Activity;

                var postedValues = JsonConvert.DeserializeObject<AdaptiveCardActionModel>(((JObject)activity.Value).GetValue("data", StringComparison.OrdinalIgnoreCase)?.ToString());
                string command = postedValues.Command;
                switch (command.ToUpperInvariant())
                {

                    default:
                        this.logger.LogInformation($"Invalid command for task module fetch activity.Command is : {command} ");
                        await turnContext.SendActivityAsync("Invalid command for task module fetch activity.Command is : {command} ");
                        return null;
                }

            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error while submit event is received from the user.");
                await turnContext.SendActivityAsync("Error while submit event is received from the user").ConfigureAwait(false);
                throw ex;
            }
        }
        #endregion

    }
}
