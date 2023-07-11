using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class AdaptiveCardButtonModel
    {
        [JsonProperty("viewUrl")]
        public Uri? ViewUrl { get; set; }

        [JsonProperty("updateUrl")]
        public Uri? UpdateUrl { get; set; }
    }
}
