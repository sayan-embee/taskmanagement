using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Connector.Authentication;

namespace TeamsApp.Bot.Bots
{
    public class CommonBotAdapter : BotFrameworkHttpAdapter
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="BotAdapter"/> class.
        /// </summary>
        /// <param name="credentialProvider">Credential provider service instance.</param>
        /// <param name="companyCommunicatorBotFilterMiddleware">Teams message filter middleware instance.</param>
        public CommonBotAdapter(
            ICredentialProvider credentialProvider,
            CommonBotFilterMiddleware botFilterMiddleware)
            : base(credentialProvider)
        {
            this.Use(botFilterMiddleware);
        }
    }
}
