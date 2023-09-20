using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class TaskAssignmentTrnModel
    {
        [JsonProperty("assignId")]
        public int AssignId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("progressId")]
        public long? ProgressId { get; set; }

        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }

        [JsonProperty("assigneeEmail")]
        public string AssigneeEmail { get; set; }

        [JsonProperty("assigneeUPN")]
        public string AssigneeUPN { get; set; }

        [JsonProperty("assigneeADID")]
        public string AssigneeADID { get; set; }

        [JsonProperty("assignmentType")]
        public string AssignmentType { get; set; }
    }


    public class TaskReassignmentTrnModel
    {
        [JsonProperty("assignId")]
        public int AssignId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("progressId")]
        public long? ProgressId { get; set; }

        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }

        [JsonProperty("assigneeEmail")]
        public string AssigneeEmail { get; set; }

        [JsonProperty("assigneeUPN")]
        public string AssigneeUPN { get; set; }

        [JsonProperty("assigneeADID")]
        public string AssigneeADID { get; set; }

        [JsonProperty("assignmentType")]
        public string AssignmentType { get; set; }

        [JsonProperty("taskProgressDetails")]
        public TaskProgressTrnModel TaskProgressDetails { get; set; }
    }
}
