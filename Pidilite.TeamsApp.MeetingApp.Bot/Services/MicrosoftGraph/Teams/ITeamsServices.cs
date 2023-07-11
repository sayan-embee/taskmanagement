using Microsoft.Graph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams
{
    public interface ITeamsServices
    {
        Task<IEnumerable<Team>> GetAllJoinedTeams(string UserADID);
        Task<IEnumerable<Channel>> GetAllChannel(string TeamsId);
        Task<bool> InstallAppForUser(string appId, string userADID);
    }
}