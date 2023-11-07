using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class TaskRequestDetailsModel
    {
        [JsonProperty("loggedInUserRoleId")]
        public int LoggedInUserRoleId { get; set; }

        [JsonProperty("loggedInUserRoleName")]
        public string LoggedInUserRoleName { get; set; }

        [JsonProperty("requestId")]
        public int RequestId { get; set; }

        [JsonProperty("requestRefNo")]
        public string RequestRefNo { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("statusId")]
        public int? StatusId { get; set; }

        [JsonProperty("statusName")]
        public string StatusName { get; set; }

        [JsonProperty("priorityId")]
        public int? PriorityId { get; set; }

        [JsonProperty("priorityName")]
        public string PriorityName { get; set; }

        [JsonProperty("requestorRoleId")]
        public int? RequestorRoleId { get; set; }

        [JsonProperty("requestorRoleName")]
        public string RequestorRoleName { get; set; }

        [JsonProperty("approverRoleId")]
        public int? ApproverRoleId { get; set; }

        [JsonProperty("approverRoleName")]
        public string ApproverRoleName { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

        [JsonProperty("isCancelled")]
        public bool? IsCancelled { get; set; }

        [JsonProperty("createdOnIST")]
        public DateTime? CreatedOnIST { get; set; }

        [JsonProperty("createdOnUTC")]
        public DateTime? CreatedOnUTC { get; set; }

        [JsonProperty("createdByName")]
        public string CreatedByName { get; set; }

        [JsonProperty("createdByEmail")]
        public string CreatedByEmail { get; set; }

        [JsonProperty("createdByUPN")]
        public string CreatedByUPN { get; set; }

        [JsonProperty("createdByADID")]
        public string CreatedByADID { get; set; }

        [JsonProperty("taskSubject")]
        public string TaskSubject { get; set; }

        [JsonProperty("taskDesc")]
        public string TaskDesc { get; set; }

        [JsonProperty("currentTargetDate")]
        public DateTime? CurrentTargetDate { get; set; }

        [JsonProperty("transactionId")]
        public Guid? TransactionId { get; set; }

        [JsonProperty("progressId")]
        public long? ProgressId { get; set; }

        [JsonProperty("isApproved")]
        public bool? IsApproved { get; set; }

        [JsonProperty("requestRemarks")]
        public string RequestRemarks { get; set; }

        [JsonProperty("approvalRemarks")]
        public string ApprovalRemarks { get; set; }

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


        //[JsonProperty("executionTime")]
        //public string ExecutionTime { get; set; }
    }

    public class TaskRequestDetailsViewModel
    {
        [JsonProperty("requestedTaskDetailsList")]
        public List<TaskRequestDetailsModel> RequestedTaskDetailsList { get; set; }

        [JsonProperty("executionTime")]
        public string ExecutionTime { get; set; }
    }

    public class TaskRequestFilterModel
    {
        [JsonProperty("requestId")]
        public int? RequestId { get; set; }

        [JsonProperty("requestedUserName")]
        public string RequestedUserName { get; set; }

        [JsonProperty("requestedUserEmail")]
        public string RequestedUserEmail { get; set; }

        [JsonProperty("loggedInUserEmail")]
        public string LoggedInUserEmail { get; set; }

        [JsonProperty("fromDate")]
        public DateTime? FromDate { get; set; }

        [JsonProperty("toDate")]
        public DateTime? ToDate { get; set; }

        [JsonProperty("statusId")]
        public int? StatusId { get; set; }

        [JsonProperty("priorityId")]
        public int? PriorityId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

        [JsonProperty("taskSubject")]
        public string TaskSubject { get; set; }
    }
}
