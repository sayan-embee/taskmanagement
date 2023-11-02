using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class SchedularLogModel
    {
        [JsonProperty("runId")]
        public int RunId { get; set; }

        [JsonProperty("isSuccess")]
        public bool? IsSuccess { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("createdOnIST")]
        public DateTime? CreatedOnIST { get; set; }

        [JsonProperty("createdOnUTC")]
        public DateTime? CreatedOnUTC { get; set; }

        [JsonProperty("executionTimeInSecs")]
        public double? ExecutionTimeInSecs { get; set; }

        [JsonProperty("triggerCode")]
        public string TriggerCode { get; set; }

        [JsonProperty("referenceInfo")]
        public string ReferenceInfo { get; set; }
    }
}
