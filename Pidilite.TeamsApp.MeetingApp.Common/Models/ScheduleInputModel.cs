using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class ScheduleInputModel
    {
        [JsonProperty("userAdId")]
        public string UserAdId { get; set; }

        [JsonProperty("EmailIds")]
        public List<string> EmailIds { get; set; }

        [JsonProperty("startDateTime")]
        public DateTime StartDateTime { get; set; }

        [JsonProperty("endDateTime")]
        public DateTime EndDateTime { get; set; }

        [JsonProperty("availabilityViewInterval")]
        public int AvailabilityViewInterval { get; set; }

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

    }
}
