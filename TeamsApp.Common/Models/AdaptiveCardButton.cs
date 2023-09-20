using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class AdaptiveCardButtonModel
    {
        [JsonProperty("viewUrl")]
        public Uri? ViewUrl { get; set; }

        [JsonProperty("updateUrl")]
        public Uri? UpdateUrl { get; set; }
    }
}
