using Microsoft.ApplicationInsights;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using System;
using TeamsApp.Common.Models.Enum;
using TeamsApp.Models;
using TeamsApp.Common.Resources;
using System.Linq;

namespace TeamsApp.Bot.Bots
{
    public class UserActivityHandler : TeamsActivityHandler
    {
        /// <summary>
        /// Instance to send logs to the Application Insights service.
        /// </summary>
        private readonly ILogger<UserActivityHandler> logger;

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

        private readonly string AppName = "UserApp";

        public UserActivityHandler(
            ILogger<UserActivityHandler> logger,
            IStringLocalizer<Strings> localizer,
            TelemetryClient telemetryClient,
            IAppLifecycleHandler appLifecycleHandler)
        {
            this.logger = logger;
            this.localizer = localizer;
            this.telemetryClient = telemetryClient;
            this.appLifecycleHandler = appLifecycleHandler;
        }

        public override async Task OnTurnAsync(ITurnContext turnContext, CancellationToken cancellationToken = default)
        {
            try
            {
                turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
                this.RecordEvent(nameof(this.OnTurnAsync), turnContext);
                switch (turnContext.Activity.Conversation.ConversationType)
                {
                    case ConversationTypes.Personal:
                        if (turnContext.Activity.Action == "remove"
                            && turnContext.Activity.Type == "installationUpdate"
                            && turnContext.Activity.From.AadObjectId != null)
                        {
                            await this.appLifecycleHandler.OnBotRemovedInPersonalAsync(turnContext, AppName);
                            return;
                        }
                        break;
                    default:
                        break;
                }
                await base.OnTurnAsync(turnContext, cancellationToken);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"Error at {nameof(this.OnTurnAsync)}.");
                await base.OnTurnAsync(turnContext, cancellationToken);
                throw;
            }
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

                switch (activity.Conversation.ConversationType)
                {
                    case ConversationTypes.Personal:
                        //User Install the app
                        if (activity.MembersAdded != null && activity.MembersAdded.Any(member => member.Id == activity.Recipient.Id))
                        {
                            await this.appLifecycleHandler.OnBotInstalledInPersonalAsync(turnContext, AppName);
                        }
                        //User unistalled the app
                        else if (activity.MembersRemoved != null && activity.MembersRemoved.Any(member => member.Id == activity.Recipient.Id))
                        {
                            await this.appLifecycleHandler.OnBotRemovedInPersonalAsync(turnContext, AppName);
                        }
                        break;
                    case ConversationTypes.Channel:
                        var teamsChannelData = turnContext.Activity.GetChannelData<TeamsChannelData>();
                        //App installed in team
                        if (activity.MembersAdded != null && activity.MembersAdded.Any(member => member.Id == activity.Recipient.Id))
                        {
                            await this.appLifecycleHandler.OnBotInstalledInTeamsAsync(turnContext, AppName, teamsChannelData);
                        }
                        //App unistalled in team
                        else if (activity.MembersRemoved != null && activity.MembersRemoved.Any(member => member.Id == activity.Recipient.Id))
                        {
                            await this.appLifecycleHandler.OnBotRemovedInTeamsAsync(turnContext, AppName, teamsChannelData);
                        }
                        break;
                    default: break;
                }

            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Exception occurred while bot conversation update event.");
                throw;
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
