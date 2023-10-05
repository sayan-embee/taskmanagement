
namespace TeamsApp.Bot.Services.MicrosoftGraph
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using AdaptiveCards;
    using AdaptiveCards.Templating;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Bot.Schema;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Options;
    using TeamsApp.Bot.Cards;
    using TeamsApp.Bot.Helpers.TokenHelper;
    using TeamsApp.Bot.Models;
    using TeamsApp.Common.Models;
    using TeamsApp.Common.Resources;

    /// <summary>
    /// Class that helps to return welcome card as attachment.
    /// </summary>
    public class AdaptiveCardService : IAdaptiveCardService
    {
        private const string WelcomeCardCacheKey = "_welcome-card";

        private const string CreateTask_ActionButton_CacheKey = "_createTask-ActionButton";
        private const string CreateTask_CacheKey = "_createTask";

        private const string UpdateTask_ActionButton_CacheKey = "_updateTask-ActionButton";
        private const string UpdateTask_CacheKey = "_updateTask";

        private const string ReassignTask_ActionButton_CacheKey = "_updateTask-ActionButton";
        private const string ReassignTask_CacheKey = "_updateTask-ActionButton";
        private const string ReassignTask_NoAction_CacheKey = "_updateTask-NoActionButton";

        private const string ReassignTaskCardCacheKey = "_task-card-reassign";
        private const string UpdatedTaskCardCacheKey = "_task-card-updated";

        /// <summary>
        /// Memory cache instance to store and retrieve adaptive card payload.
        /// </summary>
        private readonly IMemoryCache memoryCache;

        /// <summary>
        /// Information about the web hosting environment an application is running in.
        /// </summary>
        private readonly IWebHostEnvironment env;

        /// <summary>
        /// The current cultures' string localizer.
        /// </summary>
        private readonly IStringLocalizer<Strings> localizer;

        /// <summary>
        /// A set of key/value application configuration properties for Activity settings.
        /// </summary>
        private readonly IOptions<BotSettings> botOptions;

        private readonly ITokenHelper tokenHelper;

        /// <summary>
        /// Initializes a new instance of the <see cref="AdaptiveCardService"/> class.
        /// </summary>
        /// <param name="localizer">The current cultures' string localizer.</param>
        /// <param name="env">Information about the web hosting environment an application is running in.</param>
        /// <param name="memoryCache">MemoryCache instance for caching authorization result.</param>
        /// <param name="botOptions">A set of key/value application configuration properties for activity handler.</param>
        public AdaptiveCardService(IStringLocalizer<Strings> localizer, IMemoryCache memoryCache, IWebHostEnvironment env, IOptions<BotSettings> botOptions, ITokenHelper tokenHelper)
        {
            this.localizer = localizer;
            this.botOptions = botOptions;
            this.memoryCache = memoryCache;
            this.env = env;
            this.tokenHelper = tokenHelper;
        }
        /// <summary>
        /// Get welcome card attachment to be sent in personal scope.
        /// </summary>
        /// <returns>User welcome card attachment.</returns>
        public Attachment GetWelcomeCardForPersonalScope()
        {
            var cardPayload = this.GetCardPayload(WelcomeCardCacheKey, "\\WelcomeCard\\welcome-card.json");
            var welcomeCardOptions = new WelcomeCard
            {
                AppImage = $"{this.botOptions.Value.AppBaseUri}/images/logo.png",
                TabUrl = $"https://teams.microsoft.com/l/entity/{this.botOptions.Value.ManifestId}/hometab",
                WelcomeCardFillButton = this.localizer.GetString("FillButton"),
                WelcomeCardIntro = this.localizer.GetString("WelcomeCardIntro"),
                WelcomeCardSubtitle = this.localizer.GetString("WelcomeCardSubtitle"),
                WelcomeCardTitle = this.localizer.GetString("WelcomeCardTitle"),
            };
            var template = new AdaptiveCardTemplate(cardPayload);
            var cardJson = template.Expand(welcomeCardOptions);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };

            return adaptiveCardAttachment;
        }

        /// <summary>
        /// Get card payload from memory.
        /// </summary>
        /// <param name="cardCacheKey">Card cache key.</param>
        /// <param name="jsonTemplateFileName">File name for JSON adaptive card template.</param>
        /// <returns>Returns adaptive card payload in JSON format.</returns>
        private string GetCardPayload(string cardCacheKey, string jsonTemplateFileName)
        {
            bool isCacheEntryExists = this.memoryCache.TryGetValue(cardCacheKey, out string cardPayload);

            if (!isCacheEntryExists)
            {
                // If cache duration is not specified then by default cache for 12 hours.
                var cacheDurationInHour = TimeSpan.FromHours(this.botOptions.Value.CardCacheDurationInHour);
                cacheDurationInHour = cacheDurationInHour.Hours <= 0 ? TimeSpan.FromHours(12) : cacheDurationInHour;

                var cardJsonFilePath = Path.Combine(this.env.ContentRootPath, $".\\Cards\\{jsonTemplateFileName}");
                cardPayload = File.ReadAllText(cardJsonFilePath);
                this.memoryCache.Set(cardCacheKey, cardPayload, cacheDurationInHour);
            }
            return cardPayload;
        }


        public Attachment GetCard_CreateTask_ActionButton_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(CreateTask_ActionButton_CacheKey, "\\NotificationCard\\newTaskCard_withActionBtn.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.AssignerName = data.AssignerName + $" ({data.AssignerEmail})";
            //data.CoordinatorName = data.CoordinatorName + $" ({data.CoordinatorEmail})";
            //data.AssigneeName = data.AssigneeName + $" ({data.AssigneeEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCard_CreateTask_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(CreateTask_CacheKey, "\\NotificationCard\\newTaskCard.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.CollaboratorName = data.CollaboratorName + $" ({data.CollaboratorEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCard_UpdateTask_ActionButton_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(UpdateTask_ActionButton_CacheKey, "\\NotificationCard\\updateTaskCard_withActionBtn.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.AssignerName = data.AssignerName + $" ({data.AssignerEmail})";
            //data.CoordinatorName = data.CoordinatorName + $" ({data.CoordinatorEmail})";
            //data.AssigneeName = data.AssigneeName + $" ({data.AssigneeEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCard_UpdateTask_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(UpdateTask_CacheKey, "\\NotificationCard\\updateTaskCard.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.CollaboratorName = data.CollaboratorName + $" ({data.CollaboratorEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCard_ReassignTask_ActionButton_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(ReassignTask_ActionButton_CacheKey, "\\NotificationCard\\reassignTaskCard_withActionBtn.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.CollaboratorName = data.CollaboratorName + $" ({data.CollaboratorEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCard_ReassignTask_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(ReassignTask_CacheKey, "\\NotificationCard\\reassignTaskCard.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.CollaboratorName = data.CollaboratorName + $" ({data.CollaboratorEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCard_ReassignTask_NoAction_PersonalScope(TaskDetailsCardModel data)
        {
            var cardPayload = this.GetCardPayload(ReassignTask_NoAction_CacheKey, "\\NotificationCard\\reassignTaskCard_NoAction.json");
            var template = new AdaptiveCardTemplate(cardPayload);

            //data.CollaboratorName = data.CollaboratorName + $" ({data.CollaboratorEmail})";

            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }

        public Attachment GetCardOnTaskReassignInPersonalScope(TaskDetailsModel data)
        {
            var cardPayload = this.GetCardPayload(ReassignTaskCardCacheKey, "\\Notification\\reassignTaskNotificationCard.json");
            var template = new AdaptiveCardTemplate(cardPayload);
            //data.TaskClosureDateString = data.TaskClosureDate.Value.Date.Day+"-"+ data.TaskClosureDate.Value.Date.Month+"-"+ data.TaskClosureDate.Value.Date.Year+"T" + data.TaskClosureDate.Value.TimeOfDay+"Z";
            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }
        public Attachment GetCardOnUpdatedTaskInPersonalScope(TaskDetailsModel data)
        {
            var cardPayload = this.GetCardPayload(UpdatedTaskCardCacheKey, "\\Notification\\updatedTaskNotificationCard.json");
            var template = new AdaptiveCardTemplate(cardPayload);
            var cardJson = template.Expand(data);
            AdaptiveCard card = AdaptiveCard.FromJson(cardJson).Card;

            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card,
            };
            return adaptiveCardAttachment;
        }
        private async Task<bool> getAPIAuthToken(string serviceUrl, string userADID)
        {
            await Task.Delay(0);
            var token = "";
            token = this.tokenHelper.GenerateAPIAuthToken(applicationBasePath: serviceUrl, fromId: userADID, jwtExpiryMinutes: 60);
            if(token == "")
            {
                return false;
            }
            return true;
        }
    }
}