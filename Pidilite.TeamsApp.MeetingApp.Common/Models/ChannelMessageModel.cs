using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class ChannelMessageModel
    {
        [JsonProperty("teamsId")]
        public string TeamsId { get; set; }

        [JsonProperty("channelId")]
        public string ChannelId { get; set; }

        [JsonProperty("locationName")]
        public string LocationName { get; set; }

        [JsonProperty("meetingTitle")]
        public string MeetingTitle { get; set; }

        [JsonProperty("meetingDescription")]
        public string MeetingDescription { get; set; }

        [JsonProperty("startDateTime")]
        public DateTime? StartDateTime { get; set; }

        [JsonProperty("endDateTime")]
        public DateTime? EndDateTime { get; set; }

        [JsonProperty("anchorName")]
        public string AnchorName { get; set; }

        [JsonProperty("organiserName")]
        public string OrganiserName { get; set; }

        [JsonProperty("joinUrl")]
        public string JoinUrl { get; set; }
    }
}
