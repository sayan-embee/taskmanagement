using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pidilite.TeamsApp.MeetingApp.Bot.Helper;
using Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Teams;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MSGroups;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Pidilite.TeamsApp.MeetingApp.Bot.Controllers
{
    [Route("api/v1.0/teams")]
    [ApiController]
    [Authorize]
    public class TeamsController : BaseController
    {
        /// <summary>
        /// Logs errors and information.
        /// </summary>
        private readonly ILogger _logger;
        /// <summary>
        /// Telemetry client to log event and errors.
        /// </summary>
        private readonly TelemetryClient _telemetryClient;

        private readonly ITeamsHelper _teamsHelper;

        private readonly IGroupsService _groupsService;

        private readonly IMSGroupService _msgroupService;
        public TeamsController(
                ILogger<TeamsController> logger,
                ITeamsHelper teamsHelper,
                IGroupsService groupsService,
                IMSGroupService msgroupService,
                TelemetryClient telemetryClient
                ) : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient ?? throw new ArgumentNullException(nameof(telemetryClient));
            this._teamsHelper = teamsHelper ?? throw new ArgumentNullException(nameof(teamsHelper));
            this._groupsService = groupsService ?? throw new ArgumentNullException(nameof(groupsService));
            this._msgroupService = msgroupService ?? throw new ArgumentNullException(nameof(msgroupService));
        }

        [HttpGet]
        [Route("GetAllTeams")]
        public async Task<IActionResult> GetAllTeams(string UserADID)
        {
            try
            {
                var result = await _teamsHelper.GetAllJoinedTeamsAsync(UserADID);
                if (result == null)
                {
                    return this.NotFound();
                }
                return this.Ok(result);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching teams.");
                return this.Problem(ex.Message);
            }
        }

        //[HttpGet]
        //[Route("GetAllDistributionListGroups")]
        //public async Task<IActionResult> GetAllDistributionListGroups(string filter)
        //{
        //    try
        //    {
        //        var result = await _groupsService.SearchAsync(filter);
        //        if (result == null)
        //        {
        //            return this.NotFound();
        //        }
        //        return this.Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        this._logger.LogError(ex, "Error occurred while fetching DL Groups.");
        //        return this.Problem(ex.Message);
        //    }
        //}

        [HttpGet]
        [Route("GetAllDistributionListGroups")]
        public async Task<IActionResult> GetAllGroups(string filter)
        {
            try
            {
                var result = await _msgroupService.SearchForMSGroup(filter);
                if (result == null)
                {
                    return this.NotFound();
                }
                return this.Ok(result);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching all Groups.");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAllGroupMembers")]
        public async Task<IActionResult> GetAllGroupMembers(string groupId)
        {
            try
            {
                var groupList = new List<MeetingGroupsModel>();
                var result = await _groupsService.GetGroupMembersAsync(groupId);
                if (result == null)
                {
                    return this.NotFound();
                }
                return this.Ok(result);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching group members.");
                return this.Problem(ex.Message);
            }
        }

    }
}
