using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pidilite.TeamsApp.MeetingApp.Bot.Helper;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.Common.Models.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Controllers
{
    [Route("api/v1.0/user")]
    [ApiController]
    //[Authorize]
    public class UserController : BaseController
    {
        /// <summary>
        /// Logs errors and information.
        /// </summary>
        private readonly ILogger _logger;

        /// <summary>
        /// Telemetry client to log event and errors.
        /// </summary>
        ///
        private readonly TelemetryClient _telemetryClient;

        private readonly IUserHelper _userHelper;

        //private readonly IConfiguration _configuration;
        //private readonly IHttpClientFactory _httpClientFactory;
        //private readonly IHttpContextAccessor _httpContextAccessor;


        public UserController(
            ILogger<UserController> logger,
            TelemetryClient telemetryClient,
            IUserHelper userHelper
            )
            : base(telemetryClient)
        {

            this._telemetryClient = telemetryClient ?? throw new ArgumentNullException(nameof(telemetryClient));
            this._userHelper = userHelper ?? throw new ArgumentNullException(nameof(userHelper));
            this._logger = logger;
        }

        [HttpGet("GetMyProfile")]
        public async Task<ActionResult> GetMyProfile()
        {
            try
            {
                var user = await this._userHelper.GetMyProfileAsync();
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetMyProfile - The HTTP GET call to get login user profile.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while fetching user profile.");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet("GetFilteredUsers")]
        public async Task<ActionResult> GetFilteredUsersAsync(string filter = null, string userType = null)
        {
            try
            {
                userType = ADIDUserType.Member.ToString();
                /*
                if (!String.IsNullOrEmpty(userType))
                {
                    if (userType.ToLower() == ADIDUserType.Member.ToString())
                    {
                        userType = ADIDUserType.Member.ToString();
                    }
                    else
                    {
                        userType = ADIDUserType.Guest.ToString();
                    }
                }
                */
                var user = await this._userHelper.GetUsersAsync(filter, userType);
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetFilteredUsers - The HTTP GET call to get users based on filter.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while fetching user profile.");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet("GetFilteredUsersWithDomainName")]
        public async Task<ActionResult> GetUsersByDomainNameAsync(string filter = null)
        {
            try
            {
                var user = await this._userHelper.GetUsersByDomainNameAsync(filter);
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetFilteredUsers - The HTTP GET call to get users based on filter.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while fetching user profile.");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet("GetDirectReports")]
        public async Task<ActionResult> GetDirectReports(string userADID, bool IsPidiliteDomain = false)
        {
            IEnumerable<UserProfileModel> user = null;
            try
            {
                if (IsPidiliteDomain)
                {
                    user = await this._userHelper.GetDirectReportsByDomainNameAsync(userADID);
                }
                else
                {
                    user = await this._userHelper.GetDirectReportsAsync(userADID);
                }
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetDirectReports - The HTTP GET call to get direct report users list.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while fetching direct reports.");
                return this.Problem(ex.Message);
            }
        }

        //[HttpGet("GetUserAccessToken1")]
        //public async Task<ActionResult<string>> GetUserAccessToken1()
        //{
        //    try
        //    {
        //        return await SSOAuthHelper.GetAccessTokenOnBehalfUserAsync(_configuration, _httpClientFactory, _httpContextAccessor);
        //    }
        //    catch (Exception)
        //    {
        //        return null;
        //    }
        //}
    }
}
