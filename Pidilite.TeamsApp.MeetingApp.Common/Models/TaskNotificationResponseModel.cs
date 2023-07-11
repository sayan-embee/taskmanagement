using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskNotificationResponseModel
    {
        [JsonProperty("notificationId")]
        public long NotificationId { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("meetingId")]
        public long MeetingId { get; set; }

        [JsonProperty("activityId")]
        public string ActivityId { get; set; }

        [JsonProperty("userADID")]
        public string UserADID { get; set; }

        [JsonProperty("userName")]
        public string UserName { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("conversationId")]
        public string ConversationId { get; set; }

        [JsonProperty("replyToId")]
        public string ReplyToId { get; set; }

        [JsonProperty("serviceUrl")]
        public string ServiceUrl { get; set; }

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

        [JsonProperty("notificationDateTime")]
        public DateTime? NotificationDateTime { get; set; }

        [JsonProperty("notificationDateTimeUTC")]
        public DateTime? NotificationDateTimeUTC { get; set; }
    }
}
