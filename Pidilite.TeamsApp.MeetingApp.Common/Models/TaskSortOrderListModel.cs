using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskSortOrderListModel
    {
        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("sortOrder")]
        public long SortOrder { get; set; }
    }
}
