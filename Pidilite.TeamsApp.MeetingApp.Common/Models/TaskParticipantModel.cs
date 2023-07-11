using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class TaskParticipantModel
    {
        [JsonProperty("assignedTo")]
        public string AssignedTo { get; set; }

        [JsonProperty("assignedToEmail")]
        public string AssignedToEmail { get; set; }

        [JsonProperty("assignedToADID")]
        public string AssignedToADID { get; set; }
    }
}
