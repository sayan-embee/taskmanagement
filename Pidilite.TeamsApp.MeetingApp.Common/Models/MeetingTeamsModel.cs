using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class MeetingTeamsModel
    {
        [JsonProperty("teamsId")]
        public string TeamsId { get; set; }

        [JsonProperty("teamsName")]
        public string TeamsName { get; set; }

        [JsonProperty("channelId")]
        public string ChannelId { get; set; }

        [JsonProperty("channelName")]
        public string ChannelName { get; set; }

        [JsonProperty("channelType")]
        public string ChannelType { get; set; }

        //[JsonProperty("meetingChannel")]
        //public List<MeetingChannelModel> MeetingChannel { get; set; }
    }
}
