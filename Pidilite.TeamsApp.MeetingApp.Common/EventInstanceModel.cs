using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common
{
    public class EventInstanceModel
    {
        [JsonProperty("seriesMasterId")]
        public string? SeriesMasterId { get; set; }

        [JsonProperty("iCalUId")]
        public string? ICalUId { get; set; }

        [JsonProperty("chatId")]
        public string? ChatId { get; set; }

        [JsonProperty("eventId")]
        public string? EventId { get; set; }

        [JsonProperty("eventType")]
        public string? EventType { get; set; }

        [JsonProperty("joinUrl")]
        public string? JoinUrl { get; set; }

        [JsonProperty("startDate")]
        public DateTime? StartDateTime { get; set; }

        [JsonProperty("endDate")]
        public DateTime? EndDateTime { get; set; }

        //[JsonProperty("transactionId")]
        //public string? TransactionId { get; set; }
    }
}
