using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskChecklistModel
    {
        [JsonProperty("checklistId")]
        public long? ChecklistId { get; set; }

        [JsonProperty("checklistTitle")]
        public string ChecklistTitle { get; set; }

        [JsonProperty("checklistCompletionDate")]
        public DateTime? ChecklistCompletionDate { get; set; }

        [JsonProperty("checklistStatus")]
        public string ChecklistStatus { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("meetingId")]
        public long MeetingId { get; set; }

        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty("createdByEmail")]
        public string CreatedByEmail { get; set; }

        [JsonProperty("createdByADID")]
        public string CreatedByADID { get; set; }

        [JsonProperty("updatedBy")]
        public string UpdatedBy { get; set; }

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }
    }
}
