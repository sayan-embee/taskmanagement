using Microsoft.Graph;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TeamsApp.Bot.Services.MicrosoftGraph.Users
{
    public interface IUsersService
    {
        Task<User> GetMyProfile();
        Task<string> GetUserProfilePhoto(string userId);
        Task<User> GetUserProfile(string userId);
        Task<User> GetUserManager(string userId);
        Task<IEnumerable<User>> GetFilteredUsers(int maxUser, string filter = null, string userType = null);
    }
}