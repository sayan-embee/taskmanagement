
namespace TeamsApp.Bot.Models
{
    
    /// <summary>
    /// A class which helps to provide Bot settings for application.
    /// </summary>
    public class BotSettings
    {
        /// <summary>
        /// Gets or sets the Microsoft app id for the bot.
        /// </summary>
        public string MicrosoftAppId { get; set; }

        /// <summary>
        /// Gets or sets the Microsoft app password for the bot.
        /// </summary>
        public string MicrosoftAppPassword { get; set; }

        /// <summary>
        /// Gets or sets application base Uri which helps in generating customer token.
        /// </summary>
        public string AppBaseUri { get; set; }

        /// <summary>
        /// Gets or sets application manifest id.
        /// </summary>
        public string ManifestId { get; set; }

        /// <summary>
        /// Gets or sets cache duration for card payload.
        /// </summary>
        public int CardCacheDurationInHour { get; set; }


        public string AdminAppId { get; set; }
        public string AdminAppPassword { get; set; }
        public string AdminManifestId { get; set; }

        public string UserAppId { get; set; }
        public string UserAppPassword { get; set; }
        public string UserManifestId { get; set; }

    }
    public class BotSettingsAdmin
    {
        public string AdminAppId { get; set; }
        public string AdminAppPassword { get; set; }
        public string AdminManifestId { get; set; }
    }

    public class BotSettingsUser
    {
        public string UserAppId { get; set; }
        public string UserAppPassword { get; set; }
        public string UserManifestId { get; set; }
    }
}