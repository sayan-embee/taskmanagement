using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class RoomScheduleModel
    {
        [JsonProperty("scheduleId")]
        public string ScheduleId { get; set; }

        [JsonProperty("availabilityView")]
        public string AvailabilityView { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("roomEmail")]
        public string RoomEmail { get; set; }

        [JsonProperty("startDateTime")]
        public string StartDateTime { get; set; }

        [JsonProperty("endDateTime")]
        public string EndDateTime { get; set; }

        [JsonProperty("timezone")]
        public string Timezone { get; set; }

        [JsonProperty("timeInterval")]
        public int TimeInterval { get; set; }
    }
}
