using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskFileUploadModel
    {
        [JsonProperty("taskFileId")]
        public long TaskFileId { get; set; }

        [JsonProperty("meetingId")]
        public long MeetingId { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("fileName")]
        public string FileName { get; set; }

        [JsonProperty("fileUrl")]
        public string FileUrl { get; set; }

        [JsonProperty("contentType")]
        public string ContentType { get; set; }
    }
}
