using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class TaskProgressTrnModel
    {
        [JsonProperty("progressId")]
        public long ProgressId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("progressRemarks")]
        public string ProgressRemarks { get; set; }

        [JsonProperty("updatedOnIST")]
        public DateTime? UpdatedOnIST { get; set; }

        [JsonProperty("updatedOnUTC")]
        public DateTime? UpdatedOnUTC { get; set; }

        [JsonProperty("updatedByName")]
        public string UpdatedByName { get; set; }

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByUPN")]
        public string UpdatedByUPN { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }
    }

    public class TaskProgressViewModel
    {
        [JsonProperty("progressId")]
        public long ProgressId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("progressRemarks")]
        public string ProgressRemarks { get; set; }

        [JsonProperty("updatedOnIST")]
        public DateTime? UpdatedOnIST { get; set; }

        [JsonProperty("updatedOnUTC")]
        public DateTime? UpdatedOnUTC { get; set; }

        [JsonProperty("updatedByName")]
        public string UpdatedByName { get; set; }

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByUPN")]
        public string UpdatedByUPN { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }

        [JsonProperty("taskAssignmentDetails")]
        public TaskAssignmentTrnModel TaskAssignmentDetails { get; set; }

        [JsonProperty("taskHistoryDetails")]
        public TaskHistoryViewModel TaskHistoryDetails { get; set; }
    }


    public class TaskProgressViewModelAssignmentDetails
    {
        [JsonProperty("progressId")]
        public long ProgressId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("progressRemarks")]
        public string ProgressRemarks { get; set; }

        [JsonProperty("updatedOnIST")]
        public DateTime? UpdatedOnIST { get; set; }

        [JsonProperty("updatedOnUTC")]
        public DateTime? UpdatedOnUTC { get; set; }

        [JsonProperty("updatedByName")]
        public string UpdatedByName { get; set; }

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByUPN")]
        public string UpdatedByUPN { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }



        [JsonProperty("assignId")]
        public int AssignId { get; set; }

        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }

        [JsonProperty("assigneeEmail")]
        public string AssigneeEmail { get; set; }

        [JsonProperty("assigneeUPN")]
        public string AssigneeUPN { get; set; }

        [JsonProperty("assigneeADID")]
        public string AssigneeADID { get; set; }

        [JsonProperty("assignmentType")]
        public string AssignmentType { get; set; }
    }


    public class TaskProgressViewModelHistoryDetails
    {
        [JsonProperty("progressId")]
        public long ProgressId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("progressRemarks")]
        public string ProgressRemarks { get; set; }

        [JsonProperty("updatedOnIST")]
        public DateTime? UpdatedOnIST { get; set; }

        [JsonProperty("updatedOnUTC")]
        public DateTime? UpdatedOnUTC { get; set; }

        [JsonProperty("updatedByName")]
        public string UpdatedByName { get; set; }

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByUPN")]
        public string UpdatedByUPN { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }



        [JsonProperty("historyId")]
        public int HistoryId { get; set; }

        [JsonProperty("statusId")]
        public int? StatusId { get; set; }

        [JsonProperty("priorityId")]
        public int? PriorityId { get; set; }

        [JsonProperty("taskRefNo")]
        public string TaskRefNo { get; set; }

        [JsonProperty("taskUnqId")]
        public Guid TaskUnqId { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("taskSubject")]
        public string TaskSubject { get; set; }

        [JsonProperty("taskDesc")]
        public string TaskDesc { get; set; }

        [JsonProperty("initialTargetDate")]
        public DateTime? InitialTargetDate { get; set; }

        [JsonProperty("currentTargetDate")]
        public DateTime? CurrentTargetDate { get; set; }

        [JsonProperty("assignerName")]
        public string AssignerName { get; set; }

        [JsonProperty("assignerEmail")]
        public string AssignerEmail { get; set; }

        [JsonProperty("assignerUPN")]
        public string AssignerUPN { get; set; }

        [JsonProperty("assignerADID")]
        public string AssignerADID { get; set; }

        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }

        [JsonProperty("assigneeEmail")]
        public string AssigneeEmail { get; set; }

        [JsonProperty("assigneeUPN")]
        public string AssigneeUPN { get; set; }

        [JsonProperty("assigneeADID")]
        public string AssigneeADID { get; set; }

        [JsonProperty("coordinatorName")]
        public string CoordinatorName { get; set; }

        [JsonProperty("coordinatorEmail")]
        public string CoordinatorEmail { get; set; }

        [JsonProperty("coordinatorUPN")]
        public string CoordinatorUPN { get; set; }

        [JsonProperty("coordinatorADID")]
        public string CoordinatorADID { get; set; }

        [JsonProperty("collaboratorName")]
        public string CollaboratorName { get; set; }

        [JsonProperty("collaboratorEmail")]
        public string CollaboratorEmail { get; set; }

        [JsonProperty("collaboratorUPN")]
        public string CollaboratorUPN { get; set; }

        [JsonProperty("collaboratorADID")]
        public string CollaboratorADID { get; set; }
    }
}
