
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Threading.Tasks;
using System;
using TeamsApp.Bot.Models;
using TeamsApp.Common.Models.Enum;
using TeamsApp.DataAccess.Data;

namespace TeamsApp.Bot.Controllers.APIController
{
    [Route("api/v1.0/conversation")]
    [ApiController]
    //[Authorize]
    public class ConversationController : BaseController
    {
        private readonly ILogger _logger;
        private readonly TelemetryClient _telemetryClient;

        private readonly IConversationData _conversationData;

        public ConversationController(
            ILogger<ConversationController> logger
            , TelemetryClient telemetryClient
            , IConversationData conversationData
            )
            : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient;
            this._conversationData = conversationData;
        }

        [HttpGet]
        [Route("getAllPersonalConversations")]
        public async Task<IActionResult> GetAllPersonalConversations()
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                var response = await this._conversationData.GetAllPersonalConversations();

                sw.Stop();
                TimeSpan ts = sw.Elapsed;

                this.RecordEvent("GetAllPersonalConversations() - Succeeded to get conversations.", RequestType.Succeeded);
                this._logger.LogInformation("GetAllPersonalConversations() executed successfully in - "
                    + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds / 10));

                if (response == null) return this.NotFound(); // 404

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetAllConversation() - Failed to get conversations.", RequestType.Failed);
                this._logger.LogError(ex, $"GetAllConversation() execution failed");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet]
        [Route("getAllTeamsConversations")]
        public async Task<IActionResult> GetAllTeamsConversations()
        {
            try
            {
                Stopwatch sw = new Stopwatch();
                sw.Start();

                var response = await this._conversationData.GetAllTeamsConversations();

                sw.Stop();
                TimeSpan ts = sw.Elapsed;

                this.RecordEvent("GetAllTeamsConversations() - Succeeded to get conversations.", RequestType.Succeeded);
                this._logger.LogInformation("GetAllConversation() executed successfully in - "
                    + String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                    ts.Hours, ts.Minutes, ts.Seconds,
                    ts.Milliseconds / 10));

                if (response == null) return this.NotFound(); // 404

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetAllTeamsConversations() - Failed to get conversations.", RequestType.Failed);
                this._logger.LogError(ex, $"GetAllTeamsConversations() execution failed");
                return this.Problem(ex.Message);
            }
        }
    }
}
