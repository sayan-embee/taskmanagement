﻿using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Pidilite.TeamsApp.MeetingApp.Common.Resources;
using Pidilite.TeamsApp.MeetingApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Bots
{
    public sealed class MeetingActivityHandler : TeamsActivityHandler
    {
        /// <summary>
        /// Instance to send logs to the Application Insights service.
        /// </summary>
        private readonly ILogger<MeetingActivityHandler> logger;

        /// <summary>
        /// The current culture's string localizer.
        /// </summary>
        private readonly IStringLocalizer<Strings> localizer;

        /// <summary>
        /// Instance of Application Insights Telemetry client.
        /// </summary>
        private readonly TelemetryClient telemetryClient;

        /// <summary>
        /// Provides helper methods for bot related activities.
        /// </summary>
        private readonly IAppLifecycleHandler appLifecycleHandler;

        /// <summary>
        /// Initializes a new instance of the <see cref="MeetingActivityHandler"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="localizer">The current culture's string localizer.</param>
        /// <param name="telemetryClient">The Application Insights telemetry client. </param>
        /// <param name="appLifecycleHandler">Provides helper methods for bot related activities.</param>
        public MeetingActivityHandler(
            ILogger<MeetingActivityHandler> logger,
            IStringLocalizer<Strings> localizer,
            TelemetryClient telemetryClient,
            IAppLifecycleHandler appLifecycleHandler)
        {
            this.logger = logger;
            this.localizer = localizer;
            this.telemetryClient = telemetryClient;
            this.appLifecycleHandler = appLifecycleHandler;
        }

        /// <summary>
        /// Invoked when members other than this bot (like a user) are removed from the conversation.
        /// </summary>
        /// <param name="turnContext">Context object containing information cached for a single turn of conversation with a user.</param>
        /// <param name="cancellationToken">Propagates notification that operations should be canceled.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        protected override async Task OnConversationUpdateActivityAsync(ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            try
            {
                turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
                this.RecordEvent(nameof(this.OnConversationUpdateActivityAsync), turnContext);

                var activity = turnContext.Activity;
                this.logger.LogInformation($"conversationType: {activity.Conversation.ConversationType}, membersAdded: {activity.MembersAdded?.Count}, membersRemoved: {activity.MembersRemoved?.Count}");

                if (activity.Conversation.ConversationType == ConversationTypes.Personal)
                {
                    if (activity.MembersAdded != null && activity.MembersAdded.Any(member => member.Id == activity.Recipient.Id))
                    {
                        await this.appLifecycleHandler.OnBotInstalledInPersonalAsync(turnContext);
                    }
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Exception occurred while bot conversation update event.");
                throw;
            }
        }
        protected override Task<TaskModuleResponse> OnTeamsTaskModuleFetchAsync(
          ITurnContext<IInvokeActivity> turnContext,
          TaskModuleRequest taskModuleRequest,
          CancellationToken cancellationToken)
        {
            try
            {
                return this.appLifecycleHandler.OnFetchAsync(turnContext, taskModuleRequest);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"Error fetching task module : {ex.Message}", SeverityLevel.Error);
                return default;
            }
        }

        /// <summary>
        /// Records event data to Application Insights telemetry client.
        /// </summary>
        /// <param name="eventName">Name of the event.</param>
        /// <param name="turnContext">Provides context for a turn in a bot.</param>
        private void RecordEvent(string eventName, ITurnContext turnContext)
        {
            var teamsChannelData = turnContext.Activity.GetChannelData<TeamsChannelData>();

            this.telemetryClient.TrackEvent(eventName, new Dictionary<string, string>
            {
                { "userId", turnContext.Activity.From.AadObjectId },
                { "tenantId", turnContext.Activity.Conversation.TenantId },
                { "teamId", teamsChannelData?.Team?.Id },
                { "channelId", teamsChannelData?.Channel?.Id },
            });
        }

    }

}
