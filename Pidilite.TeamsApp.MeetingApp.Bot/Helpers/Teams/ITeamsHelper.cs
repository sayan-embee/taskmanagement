using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Teams
{
    public interface ITeamsHelper
    {
        Task<IEnumerable<MeetingTeamsModel>> GetAllJoinedTeamsAsync(string userADID = null);
    }
}