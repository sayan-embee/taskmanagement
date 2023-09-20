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
using TeamsApp.Common.Models;
using Azure;

namespace TeamsApp.Bot.Controllers.APIController
{
    [Route("api/v1.0/masters")]
    [ApiController]
    //[Authorize]
    public class MasterAPIController : BaseController
    {
        private readonly ILogger _logger;
        private readonly TelemetryClient _telemetryClient;

        private readonly IMasterAPIData _masterAPIData;

        public MasterAPIController(
            ILogger<MasterAPIController> logger
            , TelemetryClient telemetryClient
            , IMasterAPIData masterAPIData

            )
            : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient;
            this._masterAPIData = masterAPIData;
        }

        #region Status Master

        #region Get

        [HttpGet]
        [Route("status/getAll")]
        public async Task<IActionResult> GetAllStatus()
        {
            try
            {
                var response = await this._masterAPIData.GetAllStatus();
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("MasterAPIController --> GetAllStatus() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"MasterAPIController --> GetAllStatus() execution failed");
                return this.Ok();
            }
        }

        #endregion

        #endregion









        #region Priority Master

        #region Get

        [HttpGet]
        [Route("priority/getAll")]
        public async Task<IActionResult> GetAllPriority()
        {
            try
            {
                var response = await this._masterAPIData.GetAllPriority();
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("MasterAPIController --> GetAllPriority() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"MasterAPIController --> GetAllPriority() execution failed");
                return this.Ok();
            }
        }

        #endregion

        #endregion









        #region Role Master

        #region Get

        [HttpGet]
        [Route("role/getAll")]
        public async Task<IActionResult> GetAllRole()
        {
            try
            {
                var response = await this._masterAPIData.GetAllRole();
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("MasterAPIController --> GetAllRole() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"MasterAPIController --> GetAllRole() execution failed");
                return this.Ok();
            }
        }

        #endregion

        #endregion
    }
}
