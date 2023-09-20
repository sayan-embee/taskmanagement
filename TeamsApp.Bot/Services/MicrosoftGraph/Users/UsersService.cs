using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TeamsApp.Bot.Services.MicrosoftGraph.Provider;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.MicrosoftGraph.Users
{
    public class UsersService : IUsersService
    {
        //private readonly IGraphServiceClient graphServiceClient;

        private readonly IGraphServiceClientProvider graphServiceClientProvider;

        public UsersService(
            //IGraphServiceClient graphServiceClient,
            IGraphServiceClientProvider graphServiceClientProvider
            )
        {
            //this.graphServiceClient = graphServiceClient ?? throw new ArgumentNullException(nameof(graphServiceClient));
            this.graphServiceClientProvider = graphServiceClientProvider ?? throw new ArgumentNullException(nameof(graphServiceClientProvider));
        }


        

        public async Task<User> GetMyProfile()
        {
            GraphServiceClient graphClient = await this.graphServiceClientProvider.GetGraphClientApplication();

            var graphResult = await graphClient
                    .Me
                    .Request()
                    .Select(user => new
                    {
                        user.Id,
                        user.DisplayName,
                        user.UserPrincipalName,
                        user.Mail,
                        user.Department,
                        user.JobTitle,
                        user.OfficeLocation
                    })
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Delegate.ToString())
                    .GetAsync();

            return graphResult;
        }

        public async Task<string> GetUserProfilePhoto(string userId)
        {
            GraphServiceClient graphClient = await this.graphServiceClientProvider.GetGraphClientApplication();

            string photo = null;

            // Get user photo
            using (var photoStream = await graphClient
            .Users[userId]
            .Photo
            .Content
            .Request()
            .GetAsync())
            {
                byte[] photoByte = ((MemoryStream)photoStream).ToArray();
                photo = "data:image/png;base64, " + Convert.ToBase64String(photoByte);
            }
            return photo;
        }

        public async Task<User> GetUserProfile(string userId)
        {
            GraphServiceClient graphClient = await this.graphServiceClientProvider.GetGraphClientApplication();

            var graphResult = await graphClient
                .Users[$"{userId}"]
                .Request()
                .Select(user => new
                   {
                       user.Id,
                       user.DisplayName,
                       user.UserPrincipalName,
                       user.Mail,
                       user.Department,
                       user.JobTitle,
                       user.OfficeLocation
                   })
                .WithMaxRetry(GraphConstants.MaxRetry)
                .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                .GetAsync();


            return graphResult;
        }

        public async Task<User> GetUserManager(string userId)
        {
            GraphServiceClient graphClient = await this.graphServiceClientProvider.GetGraphClientApplication();

            var graphResult = (User)await graphClient
                    .Users[$"{userId}"]
                    .Manager
                    .Request()
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                    .GetAsync();

            return graphResult;
        }

        public async Task<IEnumerable<User>> GetFilteredUsers(int maxUser, string filter = null, string userType = null)
        {
            GraphServiceClient graphClient = await this.graphServiceClientProvider.GetGraphClientApplication();

            var usersList = new List<User>();
            // match with display name or email
            var filterString = $"(startswith(displayName,'{filter}') or startswith(mail,'{filter}'))";

            // match with user type (Member/Guest)
            if (!String.IsNullOrEmpty(userType))
            {
                filterString = filterString + $" and (userType eq '{userType}')";
            }


            var filteredUsers = await graphClient
                .Users
                .Request()
                .WithMaxRetry(GraphConstants.MaxRetry)
                .Filter(filterString)
                .Top(maxUser)
                .Select("id,displayName,userPrincipalName,mail,department,userType,jobTitle,officeLocation")
                .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Delegate.ToString())
                .GetAsync();

            if (maxUser == 0)
            {
                do
                {
                    IEnumerable<DirectoryObject> searchedUsers = filteredUsers.CurrentPage;

                    usersList.AddRange(searchedUsers.Cast<User>());

                    // If there are more result.
                    if (filteredUsers.NextPageRequest != null)
                    {
                        filteredUsers = await filteredUsers.NextPageRequest.GetAsync();
                    }
                    else
                    {
                        break;
                    }
                }
                while (filteredUsers.CurrentPage != null);
            }
            else
            {
                IEnumerable<DirectoryObject> searchedUsers = filteredUsers.CurrentPage;
                usersList.AddRange(searchedUsers.Cast<User>());
            }


            if (usersList != null && usersList.Count() < 1)
            {
                var filterString2 = $"(userType eq '{userType}')";

                var queryOptions = new List<QueryOption>()
            {
                new QueryOption("$count", "true"),
                new QueryOption("$search", $"\"displayName:{filter}\"")
            };

                var filteredUsers2 = await graphClient
                    .Users
                    .Request(queryOptions)
                    .Header("ConsistencyLevel", "eventual")
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .Filter(filterString2)
                    .Top(maxUser)
                    .Select("id,displayName,userPrincipalName,mail,department,userType,jobTitle,officeLocation")
                    .OrderBy("displayName")
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                    .GetAsync();

                if (maxUser == 0)
                {
                    do
                    {
                        IEnumerable<DirectoryObject> searchedReportees = filteredUsers2.CurrentPage;

                        usersList.AddRange(searchedReportees.Cast<User>());

                        // If there are more result.
                        if (filteredUsers2.NextPageRequest != null)
                        {
                            filteredUsers2 = await filteredUsers2.NextPageRequest.GetAsync();
                        }
                        else
                        {
                            break;
                        }
                    }
                    while (filteredUsers2.CurrentPage != null);
                }
                else
                {
                    IEnumerable<DirectoryObject> searchedReportees = filteredUsers2.CurrentPage;
                    usersList.AddRange(searchedReportees.Cast<User>());
                }
            }
            return usersList;
        }
    }
}
