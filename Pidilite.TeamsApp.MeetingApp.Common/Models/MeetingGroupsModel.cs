using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class MeetingGroupsModel
    {
        [JsonProperty("meetingGroupId")]
        public string MeetingGroupId { get; set; }

        [JsonProperty("meetingId")]
        public long MeetingId { get; set; }

        [JsonProperty("groupId")]
        public string GroupId { get; set; }

        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("groupEmail")]
        public string GroupEmail { get; set; }

        [JsonProperty("groupType")]
        public string GroupType { get; set; }

        [JsonProperty("active")]
        public bool Active { get; set; }
    }
}
