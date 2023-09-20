using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamsApp.Bot.Models;
using TeamsApp.Bot.Services.MicrosoftGraph.Users;
using TeamsApp.Common.Models;
using TeamsApp.RiseApp.Common.Models;

namespace TeamsApp.Bot.Controllers
{
    [Route("api/v1.0/user")]
    [ApiController]
    //[Authorize]
    public class UsersController : BaseController
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

        private readonly IUsersService _usersService;

        private readonly IConfiguration _configuration;

        public UsersController(
            ILogger<UsersController> logger,
            TelemetryClient telemetryClient,
            IUsersService usersService,
            IConfiguration configuration
            )
            : base(telemetryClient)
        {

            this._telemetryClient = telemetryClient ?? throw new ArgumentNullException(nameof(telemetryClient));
            this._usersService = usersService ?? throw new ArgumentNullException(nameof(usersService));
            this._configuration = configuration ?? throw new ArgumentNullException(nameof(usersService));
            this._logger = logger;
        }

        [HttpGet("getmyprofile")]
        public async Task<IActionResult> GetMyProfile()
        {
            try
            {
                var user = await this._usersService.GetMyProfile();
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.RecordEvent("GetMyProfile - HTTP GET call to get logged in user profile.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while fetching logged in user profile.");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet("getadusers")]
        public async Task<IActionResult> GetFilteredUsers(string filter = null, string userType = null)
        {
            try
            {
                int maxUser = 99;
                List<UserProfile> userList = new List<UserProfile>();

                maxUser = _configuration.GetValue<int>("UserSettings:MaxUser");

                var appBaseUrl = _configuration.GetValue<string>("App:AppBaseUri");

                if (userType == null)
                {
                    userType = "Member";
                }
                var resultList = await this._usersService.GetFilteredUsers(maxUser, filter, userType);
                if (resultList != null && resultList.Any())
                {
                    foreach (var user in resultList)
                    {
                        var userProfile = new UserProfile();
                        userProfile.Name = user.DisplayName;
                        userProfile.Email = user.Mail;
                        userProfile.UPN = user.UserPrincipalName;
                        userProfile.ADID = user.Id;                                            
                        userProfile.Department = user.Department;
                        userProfile.Designation = user.JobTitle;
                        userProfile.OfficeLocation = user.OfficeLocation;

                        var resultPhoto = "";
                        try
                        {
                            resultPhoto = await this._usersService.GetUserProfilePhoto(user.Id);
                        }
                        catch (Exception ex)
                        {
                            this._logger.LogError(ex, "Error occurred while getting users profile photo for id - " + user.Id);
                        }

                        userProfile.ProfilePhoto = (resultPhoto == null || resultPhoto == "") ? appBaseUrl + "/images/userImage.png" : resultPhoto;

                        userList.Add(userProfile);
                    }
                }
                return this.Ok(userList);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while getting users list using -" + filter);
                return null;
            }
        }
    }
}
