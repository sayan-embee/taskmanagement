// <copyright file="UsersService.cs" company="Microsoft">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Graph;
    using Newtonsoft.Json.Linq;
    using Pidilite.TeamsApp.MeetingApp.Common.Extensions;
    using Pidilite.TeamsApp.MeetingApp.Common.Models;

    /// <summary>
    /// Users service.
    /// </summary>
    internal class UsersService : IUsersService
    {
        private const string TeamsLicenseId = "57ff2da0-773e-42df-b2af-ffb7a2317929";
        /// <summary>
        /// MS Graph batch limit is 20
        /// https://docs.microsoft.com/en-us/graph/known-issues#json-batching.
        /// </summary>
        private const int BatchSplitCount = 20;

        private readonly IGraphServiceClient graphServiceClient;
        private readonly IConfiguration _configuration;
        /// <summary>
        /// Initializes a new instance of the <see cref="UsersService"/> class.
        /// </summary>
        /// <param name="graphServiceClient">graph service client.</param>
        internal UsersService(IGraphServiceClient graphServiceClient, IConfiguration configuration)
        {
            this.graphServiceClient = graphServiceClient ?? throw new ArgumentNullException(nameof(graphServiceClient));
            this._configuration = configuration ?? throw new ArgumentException(nameof(configuration));
        }

        #region Me
        /// <summary>
        /// Get User details of logged in user.
        /// </summary>
        /// <returns>User Object</returns>
        public async Task<User> GetMyProfileAsync()
        {
            var graphResult = await this.graphServiceClient
                    .Me
                    .Request()
                    .Select(user => new
                    {
                        user.Id,
                        user.DisplayName,
                        user.UserPrincipalName,
                        user.Mail,
                        user.GivenName,
                        user.StreetAddress,
                        user.Department,
                        user.JobTitle
                    })
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    //.Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Delegate.ToString())
                    .GetAsync();

            return graphResult;
        }

        /// <summary>
        /// Get photo of logged in user.
        /// </summary>
        /// <returns>Base64String</returns>
        public async Task<string> GetMyProfilePhotoAsync()
        {
            string photo = null;
            try
            {
                // Get user photo
                using (var photoStream = await this.graphServiceClient
                    .Me
                    .Photo
                    .Content
                    .Request()
                    .GetAsync())
                {
                    byte[] photoByte = ((MemoryStream)photoStream).ToArray();
                    photo = Convert.ToBase64String(photoByte);
                }
            }
            catch (Exception ex)
            {
            }
            return photo;
        }
        #endregion

        #region Other then Me

        /// <summary>
        /// Get photo of logged in user.
        /// </summary>
        /// <returns>Base64String</returns>
        public async Task<string> GetUserProfilePhotoAsync(string userId)
        {
            string photo = null;
            try
            {
                // Get user photo
                using (var photoStream = await this.graphServiceClient
                    .Users[userId]
                    .Photo
                    .Content
                    .Request()
                    .GetAsync())
                {
                    byte[] photoByte = ((MemoryStream)photoStream).ToArray();
                    photo = Convert.ToBase64String(photoByte);
                }
            }
            catch (Exception ex)
            {
            }
            return photo;
        }
        /// <inheritdoc/>
        public async Task<IEnumerable<User>> GetBatchByUserIds(IEnumerable<IEnumerable<string>> userIdsByGroups)
        {
            if (userIdsByGroups == null)
            {
                throw new ArgumentNullException(nameof(userIdsByGroups));
            }

            var users = new List<User>();
            var batches = this.GetBatchRequest(userIdsByGroups);
            foreach (var batchRequestContent in batches)
            {
                var response = await this.graphServiceClient
                    .Batch
                    .Request()
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .PostAsync(batchRequestContent);

                Dictionary<string, HttpResponseMessage> responses = await response.GetResponsesAsync();

                foreach (string key in responses.Keys)
                {
                    HttpResponseMessage httpResponse = default;
                    try
                    {
                        httpResponse = await response.GetResponseByIdAsync(key);
                        if (httpResponse == null)
                        {
                            throw new ArgumentNullException(nameof(httpResponse));
                        }

                        httpResponse.EnsureSuccessStatusCode();
                        var responseContent = await httpResponse.Content.ReadAsStringAsync();
                        JObject content = JObject.Parse(responseContent);
                        var userstemp = content["value"]
                            .Children()
                            .OfType<JObject>()
                            .Select(obj => obj.ToObject<User>());
                        if (userstemp == null)
                        {
                            continue;
                        }

                        users.AddRange(userstemp);
                    }
                    catch (HttpRequestException httpRequestException)
                    {
                        var error = new Error
                        {
                            Code = httpResponse.StatusCode.ToString(),
                            Message = httpResponse.ReasonPhrase,
                        };
                        throw new ServiceException(error, httpResponse.Headers, httpResponse.StatusCode, httpRequestException.InnerException);
                    }
                    finally
                    {
                        if (httpResponse != null)
                        {
                            httpResponse.Dispose();
                        }
                    }
                }
            }

            return users;
        }

        public async Task<IEnumerable<User>> GetUsersWithEmailDomainAsync(string filter = null, string domainFilter = null)
        {
            var filterString = "startswith(displayName, '" + filter + "')";
            if (!string.IsNullOrEmpty(domainFilter))
            {
                filterString = filterString + $"and endswith(mail,'{domainFilter}')";
            }
            var usersList = new List<User>();

            var filteredUsers = await this.graphServiceClient
                .Users
                .Request()
                .WithMaxRetry(GraphConstants.MaxRetry)
                .Filter(filterString)
                .Top(2)
                .Select("id,displayName,userPrincipalName,mail,streetAddress,department").GetAsync();

            do
            {
                IEnumerable<DirectoryObject> searchedReportees = filteredUsers.CurrentPage;

                usersList.AddRange(searchedReportees.Cast<User>());

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

            return usersList;

        }

        /// <inheritdoc/>
        public async Task<IEnumerable<User>> GetUsersAsync2(string filter = null, string userType = null)
        {
            // to retrive specified no. of users from graph call
            var noOfUsers = _configuration.GetValue<string>("GraphCallRules:noOfUsers");
            int users;
            bool isMaxUsers = Int32.TryParse(noOfUsers, out users);
            if (users < 1)
            {
                users = 99;
            }

            // match with display name or email
            var filterString = $"(startswith(displayName,'{filter}') or startswith(mail,'{filter}'))";

            // match with user type (Member/Guest)
            if (!String.IsNullOrEmpty(userType))
            {
                filterString = filterString + $" and (userType eq '{userType}')";
            }

            var usersList = new List<User>();

            var filteredUsers = await this.graphServiceClient
                .Users
                .Request()
                .WithMaxRetry(GraphConstants.MaxRetry)               
                .Filter(filterString)
                .Top(users)
                .Select("id,displayName,userPrincipalName,mail,streetAddress,department,userType,jobTitle")
                .GetAsync();

            if (!isMaxUsers)
            {
                do
                {
                    IEnumerable<DirectoryObject> searchedReportees = filteredUsers.CurrentPage;

                    usersList.AddRange(searchedReportees.Cast<User>());

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
                IEnumerable<DirectoryObject> searchedReportees = filteredUsers.CurrentPage;
                usersList.AddRange(searchedReportees.Cast<User>());
            }

            return usersList;

        }

        public async Task<IEnumerable<User>> GetUsersAsync(string filter = null, string userType = null)
        {
            // to retrive specified no. of users from graph call
            var noOfUsers = _configuration.GetValue<string>("GraphCallRules:noOfUsers");
            int users;
            bool isMaxUsers = Int32.TryParse(noOfUsers, out users);
            if (users < 1)
            {
                users = 99;
            }

            // match with display name or email
            var filterString = $"(startswith(displayName,'{filter}') or startswith(mail,'{filter}'))";

            // match with user type (Member/Guest)
            if (!String.IsNullOrEmpty(userType))
            {
                filterString = filterString + $" and (userType eq '{userType}')";
            }

            var usersList = new List<User>();

            var filteredUsers = await this.graphServiceClient
                .Users
                .Request()
                .WithMaxRetry(GraphConstants.MaxRetry)
                .Filter(filterString)
                .Top(users)
                .Select("id,displayName,userPrincipalName,mail,streetAddress,department,userType,jobTitle")
                .GetAsync();

            if (!isMaxUsers)
            {
                do
                {
                    IEnumerable<DirectoryObject> searchedReportees = filteredUsers.CurrentPage;

                    usersList.AddRange(searchedReportees.Cast<User>());

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
                IEnumerable<DirectoryObject> searchedReportees = filteredUsers.CurrentPage;
                usersList.AddRange(searchedReportees.Cast<User>());
            }

            if (usersList != null && usersList.Count() < 1)
            {
                var filterString2 = $"(userType eq '{userType}')";

                // match with user type (Member/Guest)
                //if (!String.IsNullOrEmpty(userType))
                //{
                //    filterString2 = filterString2 + $" and (userType eq '{userType}')";
                //}

                var queryOptions = new List<QueryOption>()
                {
                    new QueryOption("$count", "true"),
                    new QueryOption("$search", $"\"displayName:{filter}\"")
                };

                var filteredUsers2 = await this.graphServiceClient
                    .Users
                    .Request(queryOptions)
                    .Header("ConsistencyLevel", "eventual")
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .Filter(filterString2)
                    .Top(users)
                    .Select("id,displayName,userPrincipalName,mail,streetAddress,department,userType,jobTitle")
                    .OrderBy("displayName")
                    .GetAsync();

                if (!isMaxUsers)
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

        /// <inheritdoc/>
        public async Task<User> GetUserAsync(string userId)
        {
            var graphResult = await this.graphServiceClient
                    .Users[userId]
                    .Request()
                    .Select(user => new
                    {
                        user.Id,
                        user.DisplayName,
                        user.UserPrincipalName,
                        user.Mail,
                    })
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();
            return graphResult;
        }

        /// <inheritdoc/>
        public async Task<(IEnumerable<User>, string)> GetAllUsersAsync(string deltaLink = null)
        {
            var users = new List<User>();
            IUserDeltaCollectionPage collectionPage;
            if (string.IsNullOrEmpty(deltaLink))
            {
                collectionPage = await this.graphServiceClient
                    .Users
                    .Delta()
                    .Request()
                    .Select("id, displayName, userPrincipalName, userType")
                    .Top(GraphConstants.MaxPageSize)
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();
            }
            else
            {
                collectionPage = new UserDeltaCollectionPage();
                collectionPage.InitializeNextPageRequest(this.graphServiceClient, deltaLink);
                collectionPage = await collectionPage
                    .NextPageRequest
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();
            }

            users.AddRange(collectionPage);

            while (collectionPage.NextPageRequest != null)
            {
                collectionPage = await collectionPage
                    .NextPageRequest
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();

                users.AddRange(collectionPage);
            }

            collectionPage.AdditionalData.TryGetValue("@odata.deltaLink", out object delta);
            return (users, delta as string);
        }

        /// <inheritdoc/>
        public async Task<bool> HasTeamsLicenseAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var licenseCollection = await this.graphServiceClient
                .Users[userId]
                .LicenseDetails
                .Request()
                .Top(GraphConstants.MaxPageSize)
                .WithMaxRetry(GraphConstants.MaxRetry)
                .GetAsync();

            if (this.HasTeamsLicense(licenseCollection))
            {
                return true;
            }

            while (licenseCollection.NextPageRequest != null)
            {
                licenseCollection = await licenseCollection
                    .NextPageRequest
                    .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();

                if (this.HasTeamsLicense(licenseCollection))
                {
                    return true;
                }
            }

            return false;
        }

        /// <inheritdoc/>
        public async Task<bool> SendMailToUserAsync(string userId, string subject, string toMailAddress, string bodyContent, bool saveToSentItems)
        {
            // setup graph client
            var message = new Message
            {
                Subject = subject,
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = bodyContent,
                },
                ToRecipients = new List<Recipient>()
                {
                new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = toMailAddress,
                    },
                },
                },
            };

            await this.graphServiceClient
           .Users[userId]
           .SendMail(message, saveToSentItems)
           .Request()
           .PostAsync();
            return true;
        }

        private string GetUserIdFilter(IEnumerable<string> userIds)
        {
            StringBuilder filterUserIds = new StringBuilder();
            foreach (var id in userIds)
            {
                if (!string.IsNullOrEmpty(filterUserIds.ToString()))
                {
                    filterUserIds.Append(" or ");
                }

                filterUserIds.Append($"id eq '{id}'");
            }

            return filterUserIds.ToString();
        }

        private IEnumerable<BatchRequestContent> GetBatchRequest(IEnumerable<IEnumerable<string>> userIdsByGroups)
        {
            var batches = new List<BatchRequestContent>();
            int maxNoBatchItems = 20;

            var batchRequestContent = new BatchRequestContent();
            int requestId = 1;

            foreach (var userIds in userIdsByGroups)
            {
                if (userIds.Count() == 0)
                {
                    continue;
                }

                if (userIds.Count() > 15)
                {
                    throw new InvalidOperationException("The id count should be less than or equal to 15");
                }

                var filterUserIds = this.GetUserIdFilter(userIds);
                var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, $"https://graph.microsoft.com/v1.0/users?$filter={filterUserIds}&$select=id,displayName,userPrincipalName");
                batchRequestContent.AddBatchRequestStep(new BatchRequestStep(requestId.ToString(), httpRequestMessage));

                if (batchRequestContent.BatchRequestSteps.Count() % maxNoBatchItems == 0)
                {
                    batches.Add(batchRequestContent);
                    batchRequestContent = new BatchRequestContent();
                }

                requestId++;
            }

            if (batchRequestContent.BatchRequestSteps.Count > 0 && batchRequestContent.BatchRequestSteps.Count < maxNoBatchItems)
            {
                batches.Add(batchRequestContent);
            }

            return batches;
        }

        /// <summary>
        /// Get users information from graph API.
        /// </summary>
        /// <param name="userObjectIds">Collection of AAD Object ids of users.</param>
        /// <returns>Returns user id and details key value pairs.</returns>
        public async Task<Dictionary<Guid, User>> GetUsersAsync(IEnumerable<string> userObjectIds)
        {
            userObjectIds = userObjectIds ?? throw new ArgumentNullException(nameof(userObjectIds));
            var userDetails = new List<User>();
            var userObjectIdBatches = userObjectIds.ToList().SplitList(BatchSplitCount);

            BatchRequestContent batchRequestContent;
            foreach (var userObjectIdBatch in userObjectIdBatches)
            {
                var batchIds = new List<string>();
                var userDetailsBatch = new List<User>();
                using (batchRequestContent = new BatchRequestContent())
                {
                    foreach (string userObjectId in userObjectIdBatch)
                    {
                        var request = this.graphServiceClient
                            .Users[userObjectId]
                            .Request();

                        batchIds.Add(batchRequestContent.AddBatchRequestStep(request));
                    }

                    var response = await this.graphServiceClient.Batch.Request().PostAsync(batchRequestContent);
                    for (int i = 0; i < batchIds.Count; i++)
                    {
                        userDetailsBatch.Add(await response.GetResponseByIdAsync<User>(batchIds[i]));
                    }

                    userDetails.AddRange(userDetailsBatch);
                }
            }

            return userDetails.ToDictionary(user => Guid.Parse(user.Mail), user => user);
        }

        private bool HasTeamsLicense(IUserLicenseDetailsCollectionPage licenseCollection)
        {
            foreach (var license in licenseCollection)
            {
                if (license.ServicePlans == null)
                {
                    continue;
                }

                if (license.ServicePlans.Any(sp => string.Equals(sp.ServicePlanId?.ToString(), TeamsLicenseId)))
                {
                    return true;
                }
            }

            return false;
        }

        #endregion

        #region Direct Reports

        public async Task<IEnumerable<User>> GetDirectReports(string userADID)
        {
            var usersList = new List<User>();

            var directReports = await this.graphServiceClient
                    .Users[userADID]
                    .DirectReports
                    .Request()
                     .WithMaxRetry(GraphConstants.MaxRetry)
                    .GetAsync();
            if (directReports != null && directReports.Any())
            {
                do
                {
                    IEnumerable<DirectoryObject> searchedReportees = directReports.CurrentPage;

                    usersList.AddRange(searchedReportees.Cast<User>());

                    // If there are more result.
                    if (directReports.NextPageRequest != null)
                    {
                        directReports = await directReports.NextPageRequest.GetAsync();
                    }
                    else
                    {
                        break;
                    }
                }
                while (directReports.CurrentPage != null);
            }
            return usersList;
        }

        #endregion
    }
}