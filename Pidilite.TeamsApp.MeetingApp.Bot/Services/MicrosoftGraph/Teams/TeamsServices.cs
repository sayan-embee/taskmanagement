using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams
{
    public class TeamsServices : ITeamsServices
    {
        private readonly ILogger<TeamsServices> logger;
        /// <summary>
        /// Initializes a new instance of the <see cref="TeamsServices"/> class.
        /// </summary>
        /// <param name="graphServiceClient">graph service client.</param>
        private readonly IGraphServiceClient graphServiceClient;
        internal TeamsServices(IGraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient ?? throw new ArgumentNullException(nameof(graphServiceClient));
        }
        public async Task<IEnumerable<Team>> GetAllJoinedTeams(string UserADID)
        {
            var MeetingTeamsList = new List<Team>();

            var graphResult = await this.graphServiceClient
                    .Users[UserADID]
                    .JoinedTeams
                    .Request()
                    .GetAsync();
            do
            {
                IEnumerable<Team> currentPageEvents = graphResult.CurrentPage;

                MeetingTeamsList.AddRange(currentPageEvents.Cast<Team>());

                // If there are more result.
                if (graphResult.NextPageRequest != null)
                {
                    graphResult = await graphResult.NextPageRequest.GetAsync();
                }
                else
                {
                    break;
                }
            }
            while (graphResult.CurrentPage != null);

            return MeetingTeamsList;
        }
        public async Task<IEnumerable<Channel>> GetAllChannel(string TeamsId)
        {
            var MeetingChannelList = new List<Channel>();

            var graphResult = await this.graphServiceClient
                   .Teams[TeamsId]
                   .Channels
                    .Request()
                    .GetAsync();
            do
            {
                IEnumerable<Channel> currentPageEvents = graphResult.CurrentPage;

                MeetingChannelList.AddRange(currentPageEvents.Cast<Channel>());

                // If there are more result.
                if (graphResult.NextPageRequest != null)
                {
                    graphResult = await graphResult.NextPageRequest.GetAsync();
                }
                else
                {
                    break;
                }
            }
            while (graphResult.CurrentPage != null);
            return MeetingChannelList;
        }
        public async Task<bool> InstallAppForUser(string appId, string userADID)
        {
            try
            {
                var userScopeTeamsAppInstallation = new UserScopeTeamsAppInstallation
                {
                    AdditionalData = new Dictionary<string, object>()
                    {
                        {"teamsApp@odata.bind", $"https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/{appId}"}
                    }
                };

                var graphResult = await this.graphServiceClient
                        .Users[userADID].Teamwork.InstalledApps
                        .Request()
                        .AddAsync(userScopeTeamsAppInstallation);
                if (graphResult == null)
                {
                    return true;
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message, "Error occurred while installing app for a user.");
                return false;
            }
            return false;
        }
    }
}
