using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class PriorityMasterModel
    {
        [JsonProperty("priorityId")]
        public int PriorityId { get; set; }

        [JsonProperty("priorityName")]
        public string PriorityName { get; set; }

        [JsonProperty("priorityCode")]
        public string PriorityCode { get; set; }

        [JsonProperty("sortOrder")]
        public int SortOrder { get; set; }
    }
}
