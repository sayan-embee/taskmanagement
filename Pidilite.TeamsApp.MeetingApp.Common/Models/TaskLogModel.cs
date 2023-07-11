using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskLogModel
    {
        [JsonProperty("taskLogId")]
        public long TaskLogId { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("meetingId")]
        public long MeetingId { get; set; }

        [JsonProperty("taskContext")]
        public string TaskContext { get; set; }

        [JsonProperty("taskActionPlan")]
        public string TaskActionPlan { get; set; }

        [JsonProperty("taskPriority")]
        public string TaskPriority { get; set; }

        [JsonProperty("actionTakenBy")]
        public string ActionTakenBy { get; set; }

        [JsonProperty("actionTakenByEmail")]
        public string ActionTakenByEmail { get; set; }

        [JsonProperty("actionTakenByADID")]
        public string ActionTakenByADID { get; set; }

        [JsonProperty("assignedTo")]
        public string AssignedTo { get; set; }

        [JsonProperty("assignedToEmail")]
        public string AssignedToEmail { get; set; }

        [JsonProperty("assignedToADID")]
        public string AssignedToADID { get; set; }

        [JsonProperty("taskClosureDate")]
        public DateTime TaskClosureDate { get; set; }

        [JsonProperty("taskCreatedOn")]
        public DateTime? TaskCreatedOn { get; set; }

        [JsonProperty("taskStatus")]
        public string TaskStatus { get; set; }

        [JsonProperty("taskReferenceNo")]
        public string TaskReferenceNo { get; set; }


    }
}
