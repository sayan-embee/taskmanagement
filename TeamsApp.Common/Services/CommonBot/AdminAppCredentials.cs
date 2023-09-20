using Microsoft.Bot.Connector.Authentication;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using TeamsApp.Common.CommonBot;

namespace TeamsApp.Common.Services.CommonBot
{
    public class AdminAppCredentials : MicrosoftAppCredentials
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AdminAppCredentials"/> class.
        /// </summary>
        /// <param name="botOptions"></param>
        public AdminAppCredentials(IOptions<BotOptions> botOptions)
            : base(appId: botOptions?.Value?.AdminAppId, password: botOptions?.Value?.AdminAppPassword)
        {
        }
    }
}
