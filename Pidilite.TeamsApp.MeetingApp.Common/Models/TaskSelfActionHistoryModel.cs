using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskSelfActionHistoryModel
    {
        [JsonProperty("taskActionHistoryId")]
        public long TaskActionHistoryId { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("meetingId")]
        public long MeetingId { get; set; }

        [JsonProperty("createdOn")]
        public DateTime CreatedOn { get; set; }

        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty("createdByEmail")]
        public string CreatedByEmail { get; set; }

        [JsonProperty("createdByADID")]
        public string CreatedByADID { get; set; }

        [JsonProperty("taskClosureDate")]
        public DateTime TaskClosureDate { get; set; }

        [JsonProperty("taskStatus")]
        public string TaskStatus { get; set; }

        [JsonProperty("taskRemarks")]
        public string TaskRemarks { get; set; }
    }
}
