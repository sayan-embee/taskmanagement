using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskDetailsModelForCIMeetings
    {
        [JsonProperty("ciUniqueID")]
        public string CIUniqueID { get; set; }

        [JsonProperty("ciName")]
        public string CIName { get; set; }

        [JsonProperty("issueDiscussed")]
        public string IssueDiscussed { get; set; }

        [JsonProperty("actionTaken")]
        public string ActionTaken { get; set; }

        [JsonProperty("priority")]
        public string Priority { get; set; }

        //[JsonProperty("originalTargetOrClosureDate")]
        //public DateTime? OriginalTargetOrClosureDate { get; set; }

        [JsonProperty("originalTargetOrClosureDate")]
        public string OriginalTargetOrClosureDate { get; set; }

        //[JsonProperty("revisedTargetOrClosureDate")]
        //public DateTime? RevisedTargetOrClosureDate { get; set; }

        [JsonProperty("revisedTargetOrClosureDate")]
        public string RevisedTargetOrClosureDate { get; set; }

        [JsonProperty("latestCommentsOrRemarks")]
        public string LatestCommentsOrRemarks { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("personResponsible")]
        public string PersonResponsible { get; set; }
    }
}
