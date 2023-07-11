
namespace Pidilite.TeamsApp.MeetingApp.Bot.Helper
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Caching.Memory;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Options;
    using Microsoft.Graph;
    using Pidilite.TeamsApp.MeetingApp.Bot.Models;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
    using Pidilite.TeamsApp.MeetingApp.Common.Models;
    using Pidilite.TeamsApp.MeetingApp.Common.Models.Enum;

    public class UserHelper : IUserHelper
    {
        /// <summary>
        /// Holds the instance of Graph service to access logged in user's reportees and manager.
        /// </summary>
        private readonly IUsersService userGraphService;

        /// <summary>
        /// Instance of memory cache to cache reportees for managers.
        /// </summary>
        private readonly IMemoryCache memoryCache;

        /// <summary>
        /// A set of key/value application configuration properties.
        /// </summary>
        private readonly IOptions<BotSettings> botOptions;

        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserHelper"/> class.
        /// </summary>
        /// <param name="userGraphService">The instance of user Graph service to access logged in user's reportees and manager.</param>
        /// <param name="memoryCache">Instance of memory cache to cache reportees for managers.</param>
        /// <param name="botOptions">A set of key/value application configuration properties.</param>
        public UserHelper(IUsersService userGraphService, IMemoryCache memoryCache, IOptions<BotSettings> botOptions, IConfiguration configuration)
        {
            this.botOptions = botOptions;
            this.userGraphService = userGraphService;
            this.memoryCache = memoryCache;
            this.configuration = configuration;
        }
        /// <summary>
        /// Get logged in user details.
        /// </summary>
        /// <returns>User Profile Details.</returns>
        public async Task<UserProfileModel> GetMyProfileAsync()
        {
            UserProfileModel userProfile = null;
            var result= await this.userGraphService.GetMyProfileAsync();

            if (result != null)
            {
                userProfile = new UserProfileModel();
                userProfile.Id = result.Id;
                userProfile.DisplayName = result.DisplayName;
                userProfile.GivenName = result.GivenName;
                userProfile.Mail = result.Mail;
                userProfile.UserPrincipalName = result.UserPrincipalName;
                userProfile.Vertical = result.Department;
                userProfile.Division = result.StreetAddress;
                userProfile.JobTitle = result.JobTitle;
                /*
                var resultPhoto = await this.userGraphService.GetMyProfilePhotoAsync();
                userProfile.Photo = resultPhoto;
                */
            }
            return userProfile;
        }
        /// <summary>
        /// Get user list based on filter.
        /// </summary>
        /// <param name="filter">filter query.</param>
        /// <returns>List of users.</returns>
        public async Task<IEnumerable<UserProfileModel>> GetUsersAsync(string filter = null, string userType = null)
        {
            List<UserProfileModel> userList = new List<UserProfileModel>();
            var results= await this.userGraphService.GetUsersAsync(filter, userType);
            if(results!=null && results.Any())
            {
                foreach (var user in results)
                {
                    var userProfile = new UserProfileModel();
                    userProfile.Id = user.Id;
                    userProfile.DisplayName = user.DisplayName;
                    userProfile.GivenName = user.GivenName;
                    userProfile.Mail = user.Mail;
                    userProfile.UserPrincipalName = user.UserPrincipalName;
                    userProfile.Vertical = user.Department;
                    userProfile.Division = user.StreetAddress;
                    userProfile.JobTitle = user.JobTitle;
                    /*
                    var resultPhoto = await this.userGraphService.GetUserProfilePhotoAsync(user.Id);
                    userProfile.Photo = resultPhoto;
                    */
                    userList.Add(userProfile);

                }
            }
            return (userList);   
        }
        public async Task<IEnumerable<UserProfileModel>> GetUsersByDomainNameAsync(string filter = null)
        {
            List<UserProfileModel> userList = new List<UserProfileModel>();
            var results = await this.userGraphService.GetUsersAsync(filter);
            if (results != null && results.Any())
            {
                foreach (var user in results)
                {
                    if(((user.Mail).ToLower()).Contains((EmailDomains.pidilite).ToString()))
                    {
                        var userProfile = new UserProfileModel();
                        userProfile.Id = user.Id;
                        userProfile.DisplayName = user.DisplayName;
                        userProfile.GivenName = user.GivenName;
                        userProfile.Mail = user.Mail;
                        userProfile.UserPrincipalName = user.UserPrincipalName;
                        userProfile.Vertical = user.Department;
                        userProfile.Division = user.StreetAddress;
                        /*
                        try
                        {
                            var resultPhoto = await this.userGraphService.GetUserProfilePhotoAsync(user.Id);
                            userProfile.Photo = resultPhoto;
                        }
                       catch(Exception)
                        {
                            // do nothing
                        }
                        */
                        userList.Add(userProfile);
                    }
                }
            }
            return (userList);
        }
        public async Task<IEnumerable<UserProfileModel>> GetDirectReportsAsync(string userADID)
        {
            List<UserProfileModel> userList = new List<UserProfileModel>();

            var results = await this.userGraphService.GetDirectReports(userADID);
            if (results != null && results.Any())
            {
                foreach (var user in results)
                {
                    var userProfile = new UserProfileModel();
                    userProfile.Id = user.Id;
                    userProfile.DisplayName = user.DisplayName;
                    userProfile.GivenName = user.GivenName;
                    userProfile.Mail = user.Mail;
                    userProfile.UserPrincipalName = user.UserPrincipalName;
                    userProfile.Vertical = user.Department;
                    userProfile.Division = user.StreetAddress;

                    userList.Add(userProfile);
                }
            }
            return userList;
        }
        public async Task<IEnumerable<UserProfileModel>> GetDirectReportsByDomainNameAsync(string userADID)
        {
            List<UserProfileModel> userList = new List<UserProfileModel>();

            var results = await this.userGraphService.GetDirectReports(userADID);
            if (results != null && results.Any())
            {
                foreach (var user in results)
                {
                    if (((user.Mail).ToLower()).Contains((EmailDomains.pidilite).ToString()))
                    {
                        var userProfile = new UserProfileModel();
                        userProfile.Id = user.Id;
                        userProfile.DisplayName = user.DisplayName;
                        userProfile.GivenName = user.GivenName;
                        userProfile.Mail = user.Mail;
                        userProfile.UserPrincipalName = user.UserPrincipalName;
                        userProfile.Vertical = user.Department;
                        userProfile.Division = user.StreetAddress;

                        userList.Add(userProfile);
                    }
                }
            }
            return userList;
        }
    }
}