using Microsoft.Graph;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
using Pidilite.TeamsApp.MeetingApp.Common.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MSGroups
{
    public class MSGroupService : IMSGroupService
    {
        private readonly IGraphServiceClient graphServiceClient;

        public MSGroupService(IGraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient ?? throw new ArgumentNullException(nameof(graphServiceClient));
        }

        private int MaxResultCount { get; set; } = 25;

        private int MaxRetry { get; set; } = 2;

        private async Task<IGraphServiceGroupsCollectionPage> SearchAsync(string filterQuery, int resultCount)
        {
            return await this.graphServiceClient
                                   .Groups
                                   .Request()
                                   .WithMaxRetry(this.MaxRetry)
                                   .Filter(filterQuery)
                                   .Select(group => new
                                   {
                                       group.Id,
                                       group.Mail,
                                       group.DisplayName,
                                       group.Visibility,
                                       group.GroupTypes,
                                   }).
                                   Top(resultCount)
                                   .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Delegate.ToString())
                                   .GetAsync();
        }

        private async Task<List<Group>> SearchM365GroupsAsync(string query, int resultCount, bool includeHiddenMembership = false)
        {
            string filterforM365Groups = "";
            if (query != null)
            {
                filterforM365Groups = $"groupTypes/any(c:c+eq+'Unified') and mailEnabled eq true and (startsWith(mail,'{query}') or startsWith(displayName,'{query}'))";
            }
            else
            {
                filterforM365Groups = $"groupTypes/any(c:c+eq+'Unified') and mailEnabled eq true";
            }
            var groupsPaged = await this.SearchAsync(filterforM365Groups, resultCount);
            if (includeHiddenMembership)
            {
                return groupsPaged.CurrentPage.ToList();
            }

            var groupList = groupsPaged.CurrentPage.
                                        Where(group => !group.IsHiddenMembership()).
                                        ToList();
            while (groupsPaged.NextPageRequest != null && groupList.Count() < resultCount)
            {
                groupsPaged = await groupsPaged.NextPageRequest.GetAsync();
                groupList.AddRange(groupsPaged.CurrentPage.
                          Where(group => !group.IsHiddenMembership()));
            }

            return groupList.Take(resultCount).ToList();
        }

        private async Task<IEnumerable<Group>> SearchDistributionListGroupAsync(string query, int resultCount)
        {
            if (resultCount == 0)
            {
                return new List<Group>();
            }
            string filterforDL = "";
            if (query != null)
            {
                filterforDL = $"mailEnabled eq true and securityEnabled eq false and (startsWith(mail,'{query}') or startsWith(displayName,'{query}'))";
            }
            else
            {
                filterforDL = $"mailEnabled eq true and securityEnabled eq false";
            }
            var distributionGroups = await this.SearchAsync(filterforDL, resultCount);

            // Filtering the result only for distribution groups.
            var distributionGroupList = distributionGroups.CurrentPage.
                                                           Where(dg => dg.GroupTypes.IsNullOrEmpty()).ToList();
            while (distributionGroups.NextPageRequest != null && distributionGroupList.Count() < resultCount)
            {
                distributionGroups = await distributionGroups.NextPageRequest.GetAsync();
                distributionGroupList.AddRange(distributionGroups.CurrentPage.Where(dg => dg.GroupTypes.IsNullOrEmpty()));
            }

            return distributionGroupList.Take(resultCount);
        }

        private async Task<IEnumerable<Group>> SearchSecurityGroupAsync(string query, int resultCount)
        {
            if (resultCount == 0)
            {
                return new List<Group>();
            }
            string filterforSG = "";
            if (query != null)
            {
                filterforSG = $"mailEnabled eq false and securityEnabled eq true and startsWith(displayName,'{query}')";
            }
            else
            {
                filterforSG = $"mailEnabled eq false and securityEnabled eq true";
            }
            //string filterforSG = $"mailEnabled eq false and securityEnabled eq true and startsWith(displayName,'{query}')";
            var sgGroups = await this.SearchAsync(filterforSG, resultCount);
            return sgGroups.CurrentPage.Take(resultCount);
        }

        public async Task<IList<Group>> SearchForMSGroup(string query)
        {
            if (query != null) query = Uri.EscapeDataString(query);

            var groupList = new List<Group>();
            groupList.AddRange(await this.SearchM365GroupsAsync(query, this.MaxResultCount - groupList.Count()));
            groupList.AddRange(await this.SearchDistributionListGroupAsync(query, this.MaxResultCount - groupList.Count()));
            groupList.AddRange(await this.SearchSecurityGroupAsync(query, this.MaxResultCount - groupList.Count()));
            return groupList;
        }

        public async Task<IEnumerable<User>> GetGroupMembersAsync(string groupId)
        {
            var membersList = new List<User>();

            var members = await graphServiceClient
                .Groups[groupId]
                .Members
                .Request()
                .Select("displayName,userPrincipalName,id")
                .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Delegate.ToString())
                .GetAsync();

            do
            {
                IEnumerable<DirectoryObject> currentPageEvents = members.CurrentPage;

                membersList.AddRange(currentPageEvents.Cast<User>().ToList());

                // If there are more result.
                if (members.NextPageRequest != null)
                {
                    members = await members.NextPageRequest.GetAsync();
                }
                else
                {
                    break;
                }
            }
            while (members.CurrentPage != null);

            return membersList;
        }


    }
}
