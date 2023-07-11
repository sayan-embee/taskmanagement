using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Teams
{
    public class TeamsHelper : ITeamsHelper
    {
        private readonly ITeamsServices teamsGraphServices;
        /// <summary>
        /// Instance of memory cache to cache
        /// </summary>
        private readonly IMemoryCache memoryCache;
        /// <summary>
        /// A set of key/value application configuration properties.
        /// </summary>
        private readonly IOptions<BotSettings> botOptions;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserHelper"/> class.
        /// </summary>
        /// <param name="userGraphService">The instance of user Graph service to access logged in user's reportees and manager.</param>
        /// <param name="memoryCache">Instance of memory cache to cache reportees for managers.</param>
        /// <param name="botOptions">A set of key/value application configuration properties.</param>
        public TeamsHelper(ITeamsServices teamsGraphServices, IMemoryCache memoryCache, IOptions<BotSettings> botOptions)
        {
            this.botOptions = botOptions;
            this.teamsGraphServices = teamsGraphServices;
            this.memoryCache = memoryCache;
        }
        //public async Task<IEnumerable<MeetingTeamsModel>> GetAllJoinedTeamsAsync(string userADID = null)
        //{
        //    List<MeetingTeamsModel> teamModalList = new List<MeetingTeamsModel>();
        //    var teamsResults = await this.teamsGraphServices.GetAllJoinedTeams(userADID);
        //    if (teamsResults != null && teamsResults.Count() > 0)
        //    {
        //        foreach (var user in teamsResults)
        //        {                   
        //            var teamModal = new MeetingTeamsModel();
        //            teamModal.TeamsId = user.Id;
        //            if(teamModal.TeamsId != null)
        //            {
        //                List<MeetingChannelModel> channelModalList = new List<MeetingChannelModel>();
        //                var channelResults = await this.teamsGraphServices.GetAllChannel(teamModal.TeamsId);
        //                if (channelResults != null && channelResults.Count() > 0)
        //                {
        //                    foreach (var c in channelResults)
        //                    {
        //                        var channelModal = new MeetingChannelModel();
        //                        channelModal.ChannelId = c.Id;
        //                        channelModal.ChannelName = c.DisplayName;
        //                        channelModal.ChannelType = c.MembershipType.ToString();
        //                        channelModalList.Add(channelModal);
        //                    }
        //                }
        //                teamModal.MeetingChannel = channelModalList;
        //            }
        //            teamModal.TeamsName = user.DisplayName;

        //            teamModalList.Add(teamModal);
        //        }
        //    }
        //    return (teamModalList);
        //}

        public async Task<IEnumerable<MeetingTeamsModel>> GetAllJoinedTeamsAsync(string userADID = null)
        {
            List<MeetingTeamsModel> teamModalList = new List<MeetingTeamsModel>();
            var teamsResults = await this.teamsGraphServices.GetAllJoinedTeams(userADID);
            if (teamsResults != null && teamsResults.Count() > 0)
            {
                foreach (var user in teamsResults)
                {
                    if (user.Id != null)
                    {
                        var channelResults = await this.teamsGraphServices.GetAllChannel(user.Id);
                        if (channelResults != null && channelResults.Count() > 0)
                        {
                            foreach (var c in channelResults)
                            {
                                var teamModal = new MeetingTeamsModel();
                                teamModal.TeamsId = user.Id;
                                teamModal.TeamsName = user.DisplayName;
                                teamModal.ChannelId = c.Id;
                                teamModal.ChannelName = c.DisplayName;
                                teamModal.ChannelType = c.MembershipType.ToString();                       
                                teamModalList.Add(teamModal);
                            }
                        }
                    }  
                }
            }
            return (teamModalList);
        }
    }
}
