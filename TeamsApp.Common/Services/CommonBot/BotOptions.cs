
namespace TeamsApp.Common.CommonBot
{
    /// <summary>
    /// Options used for holding metadata for the bot.
    /// </summary>
    public class BotOptions
    {
        /// <summary>
        /// Gets or sets the Microsoft app Id for the bot.
        /// </summary>
        public string MicrosoftAppId { get; set; }

        /// <summary>
        /// Gets or sets the Microsoft app password for the bot.
        /// </summary>
        public string MicrosoftAppPassword { get; set; }


        /// <summary>
        /// Gets or sets the Microsoft app Id for the bot.
        /// </summary>
        public string AdminAppId { get; set; }

        /// <summary>
        /// Gets or sets the Microsoft app password for the bot.
        /// </summary>
        public string AdminAppPassword { get; set; }


        /// <summary>
        /// Gets or sets the Microsoft app Id for the bot.
        /// </summary>
        public string UserAppId { get; set; }

        /// <summary>
        /// Gets or sets the Microsoft app password for the bot.
        /// </summary>
        public string UserAppPassword { get; set; }
    }

    public class AdminBotOptions
    {
        /// <summary>
        /// Gets or sets the Microsoft app Id for the bot.
        /// </summary>
        public string AdminAppId { get; set; }

        /// <summary>
        /// Gets or sets the Microsoft app password for the bot.
        /// </summary>
        public string AdminAppPassword { get; set; }
    }

    public class UserBotOptions
    {
        /// <summary>
        /// Gets or sets the Microsoft app Id for the bot.
        /// </summary>
        public string UserAppId { get; set; }

        /// <summary>
        /// Gets or sets the Microsoft app password for the bot.
        /// </summary>
        public string UserAppPassword { get; set; }
    }
}
