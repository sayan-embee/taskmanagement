using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class ScheduleItemsModel
    {
        [JsonProperty("scheduleId")]
        public string ScheduleId { get; set; }
        
        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("startDateTime")]
        public DateTime StartDateTime { get; set; }

        [JsonProperty("endDateTime")]
        public DateTime EndDateTime { get; set; }
        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }
    }
}
