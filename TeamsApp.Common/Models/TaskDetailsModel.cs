using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class TaskDetailsModel
    {
        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("meetingId")]
        public long? MeetingId { get; set; }

        [JsonProperty("meetingTitle")]
        public string? MeetingTitle { get; set; }

        [JsonProperty("meetingType")]
        public string? MeetingType { get; set; }

        [JsonProperty("divisionName")]
        public string? DivisionName { get; set; }

        [JsonProperty("verticalName")]
        public string? VerticalName { get; set; }

        [JsonProperty("seriesMasterId")]
        public string? SeriesMasterId { get; set; }

        [JsonProperty("taskContext")]
        public string? TaskContext { get; set; }

        [JsonProperty("taskActionPlan")]
        public string TaskActionPlan { get; set; }

        [JsonProperty("taskPriority")]
        public string TaskPriority { get; set; }

        [JsonProperty("actionTakenBy")]
        public string ActionTakenBy { get; set; }

        [JsonProperty("actionTakenByEmail")]
        public string ActionTakenByEmail { get; set; }

        [JsonProperty("actionTakenByADID")]
        public string ActionTakenByADID { get; set; }

        [JsonProperty("assignedTo")]
        public string? AssignedTo { get; set; }

        [JsonProperty("assignedToEmail")]
        public string? AssignedToEmail { get; set; }

        [JsonProperty("assignedToADID")]
        public string? AssignedToADID { get; set; }

        [JsonProperty("oldAssignedToADID")]
        public string? OldAssignedToADID { get; set; }

        [JsonProperty("taskClosureDate")]
        public DateTime? TaskClosureDate { get; set; }

        [JsonProperty("createdOn")]
        public DateTime? CreatedOn { get; set; }

        [JsonProperty("createdBy")]
        public string? CreatedBy { get; set; }

        [JsonProperty("createdByADID")]
        public string? CreatedByADID { get; set; }

        [JsonProperty("updatedOn")]
        public DateTime? UpdatedOn { get; set; }

        [JsonProperty("updatedBy")]
        public string? UpdatedBy { get; set; }

        [JsonProperty("updatedByADID")]
        public string? UpdatedByADID { get; set; }

        [JsonProperty("taskStatus")]
        public string TaskStatus { get; set; }

        [JsonProperty("taskRemarks")]
        public string? TaskRemarks { get; set; }

        [JsonProperty("taskReferenceNo")]
        public Guid TaskReferenceNo { get; set; }

        [JsonProperty("createdByEmail")]
        public string? CreatedByEmail { get; set; }

        [JsonProperty("updatedByEmail")]
        public string? UpdatedByEmail { get; set; }

        [JsonProperty("fromDate")]
        public DateTime? FromDate { get; set; }

        [JsonProperty("toDate")]
        public DateTime? ToDate { get; set; }

        [JsonProperty("currentMeetingId")]
        public long? CurrentMeetingId { get; set; }

        [JsonProperty("prevMeetingId")]
        public long? PrevMeetingId { get; set; }

        [JsonProperty("prevToPrevMeetingId")]
        public long? PrevToPrevMeetingId { get; set; }

        [JsonProperty("prevMeetingDate")]
        public DateTime? PrevMeetingDate { get; set; }

        [JsonProperty("prevToPrevMeetingDate")]
        public DateTime? PrevToPrevMeetingDate { get; set; }

        [JsonProperty("taskDetailsType")]
        public string? TaskDetailsType { get; set; }

        [JsonProperty("adaptiveCardButton")]
        public AdaptiveCardButtonModel? AdaptiveCardButton { get; set; }

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

        [JsonProperty("sortOrder")]
        public long? SortOrder { get; set; }

    }
}
