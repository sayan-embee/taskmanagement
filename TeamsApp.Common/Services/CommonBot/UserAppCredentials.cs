using Microsoft.Bot.Connector.Authentication;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using TeamsApp.Common.CommonBot;

namespace TeamsApp.Common.Services.CommonBot
{
    public class UserAppCredentials : MicrosoftAppCredentials
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserAppCredentials"/> class.
        /// </summary>
        /// <param name="botOptions"></param>
        public UserAppCredentials(IOptions<BotOptions> botOptions)
            : base(appId: botOptions?.Value?.UserAppId, password: botOptions?.Value?.UserAppPassword)
        {
        }
    }
}
