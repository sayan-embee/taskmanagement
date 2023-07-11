using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MSGroups
{
    public interface IMSGroupService
    {
        Task<IList<Group>> SearchForMSGroup(string query);
        Task<IEnumerable<User>> GetGroupMembersAsync(string groupId);
    }
}
