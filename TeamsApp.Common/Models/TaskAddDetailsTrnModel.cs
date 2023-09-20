using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class TaskAddDetailsTrnModel
    {
        [JsonProperty("taskAddId")]
        public long TaskAddId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("isOverdue")]
        public bool? IsOverdue { get; set; }

        [JsonProperty("noOfExtensionRequested")]
        public int? NoOfExtensionRequested { get; set; }

        [JsonProperty("noOfDeadlineMissed")]
        public int? NoOfDeadlineMissed { get; set; }

        [JsonProperty("updatedOnIST")]
        public DateTime? UpdatedOnIST { get; set; }

        [JsonProperty("updatedOnUTC")]
        public DateTime? UpdatedOnUTC { get; set; }
    }
}
