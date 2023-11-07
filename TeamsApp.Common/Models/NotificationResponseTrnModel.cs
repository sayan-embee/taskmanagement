using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class NotificationResponseTrnModel
    {
        [JsonProperty("notificationId")]
        public long NotificationId { get; set; }

        [JsonProperty("reqNotificationId")]
        public long ReqNotificationId { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

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

        [JsonProperty("notificationDateTimeIST")]
        public DateTime? NotificationDateTimeIST { get; set; }

        [JsonProperty("notificationDateTimeUTC")]
        public DateTime? NotificationDateTimeUTC { get; set; }
    }
}
