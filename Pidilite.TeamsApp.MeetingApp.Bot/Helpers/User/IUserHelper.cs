using Microsoft.Graph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helper
{
    public interface IUserHelper
    {
        Task<UserProfileModel> GetMyProfileAsync();
        Task<IEnumerable<UserProfileModel>> GetUsersAsync(string filter = null, string userType = null);
        Task<IEnumerable<UserProfileModel>> GetUsersByDomainNameAsync(string filter = null);
        Task<IEnumerable<UserProfileModel>> GetDirectReportsAsync(string userADID);
        Task<IEnumerable<UserProfileModel>> GetDirectReportsByDomainNameAsync(string userADID);
    }
}