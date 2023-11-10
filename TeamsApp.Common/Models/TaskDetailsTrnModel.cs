using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class TaskDetailsTrnModel
    {
        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("taskRefNo")]
        public string TaskRefNo { get; set; }

        [JsonProperty("taskUnqId")]
        public Guid TaskUnqId { get; set; }

        [JsonProperty("statusId")]
        public int? StatusId { get; set; }

        [JsonProperty("priorityId")]
        public int? PriorityId { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

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

        //[JsonProperty("assigneeName")]
        //public string AssigneeName { get; set; }

        //[JsonProperty("assigneeEmail")]
        //public string AssigneeEmail { get; set; }

        //[JsonProperty("assigneeUPN")]
        //public string AssigneeUPN { get; set; }

        //[JsonProperty("assigneeADID")]
        //public string AssigneeADID { get; set; }

        [JsonProperty("taskAssigneeList")]
        public List<TaskAssigneeTrnModel> TaskAssigneeList { get; set; }

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

        //Additional Details

        [JsonProperty("isOverdue")]
        public bool IsOverdue { get; set; }

        [JsonProperty("executionTime")]
        public string ExecutionTime { get; set; }
    }

    public class TaskAssigneeTrnModel
    {
        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }

        [JsonProperty("assigneeEmail")]
        public string AssigneeEmail { get; set; }

        [JsonProperty("assigneeUPN")]
        public string AssigneeUPN { get; set; }

        [JsonProperty("assigneeADID")]
        public string AssigneeADID { get; set; }
    }

    public class TaskGetByIdViewModel
    {
        [JsonProperty("loggedInUserRole")]
        public RoleMasterModel LoggedInUserRole { get; set; }

        [JsonProperty("taskDetails")]
        public TaskDetailsTrnModel TaskDetails { get; set; }

        [JsonProperty("taskProgressList")]
        public List<TaskProgressViewModel> TaskProgressList { get; set; }

        [JsonProperty("taskFileList")]
        public List<TaskFileDetailsTrnModel> TaskFileList { get; set; }

        //Additional Details

        [JsonProperty("executionTime")]
        public string ExecutionTime { get; set; }
    }


    public class TaskGetByIdListViewModel
    {
        [JsonProperty("loggedInUserRole")]
        public RoleMasterModel LoggedInUserRole { get; set; }

        [JsonProperty("taskDetails")]
        public TaskDetailsTrnModel TaskDetails { get; set; }

        [JsonProperty("taskAssignmentList")]
        public List<TaskProgressViewModelAssignmentDetails> TaskAssignmentList { get; set; }

        [JsonProperty("taskHistoryList")]
        public List<TaskProgressViewModelHistoryDetails> TaskHistoryList { get; set; }

        [JsonProperty("taskFileList")]
        public List<TaskFileDetailsTrnModel> TaskFileList { get; set; }

        //Additional Details

        [JsonProperty("executionTime")]
        public string ExecutionTime { get; set; }
    }


    public class TaskGetByEmailModel
    {
        [JsonProperty("loggedInUserRoleId")]
        public int LoggedInUserRoleId { get; set; }

        [JsonProperty("loggedInUserRoleName")]
        public string LoggedInUserRoleName { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("taskRefNo")]
        public string TaskRefNo { get; set; }

        [JsonProperty("statusId")]
        public int? StatusId { get; set; }

        [JsonProperty("statusName")]
        public string StatusName { get; set; }

        [JsonProperty("priorityId")]
        public int? PriorityId { get; set; }

        [JsonProperty("priorityName")]
        public string PriorityName { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("roleName")]
        public string RoleName { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

        [JsonProperty("createdOnIST")]
        public DateTime? CreatedOnIST { get; set; }

        [JsonProperty("createdByName")]
        public string CreatedByName { get; set; }

        [JsonProperty("createdByEmail")]
        public string CreatedByEmail { get; set; }

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

        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }

        [JsonProperty("assigneeEmail")]
        public string AssigneeEmail { get; set; }



        [JsonProperty("elapsedDays")]
        public string ElapsedDays { get; set; }

        [JsonProperty("isOverdue")]
        public bool IsOverdue { get; set; }
    }


    public class TaskGetAllViewModel
    {
        [JsonProperty("taskDetailsList")]
        public List<TaskGetByEmailModel> TaskDetailsList { get; set; }

        //Additional Details

        [JsonProperty("executionTime")]
        public string ExecutionTime { get; set; }
    }


    public class TaskGetFilterModel
    {
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

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

        [JsonProperty("taskSubject")]
        public string TaskSubject { get; set; }

        [JsonProperty("assigneeName")]
        public string AssigneeName { get; set; }
    }


    public class TaskDetailsCardModel
    {
        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("taskRefNo")]
        public string TaskRefNo { get; set; }

        [JsonProperty("taskUnqId")]
        public Guid TaskUnqId { get; set; }

        [JsonProperty("statusId")]
        public int? StatusId { get; set; }

        [JsonProperty("statusName")]
        public string StatusName { get; set; }

        [JsonProperty("priorityId")]
        public int? PriorityId { get; set; }

        [JsonProperty("priorityName")]
        public string PriorityName { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("roleName")]
        public string RoleName { get; set; }

        [JsonProperty("parentTaskId")]
        public long? ParentTaskId { get; set; }

        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

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


        [JsonProperty("requestId")]
        public int? RequestId { get; set; }


        [JsonProperty("customMessage")]
        public string CustomMessage { get; set; }

        [JsonProperty("elapsedDays")]
        public string ElapsedDays { get; set; }

        [JsonProperty("isOverdue")]
        public bool IsOverdue { get; set; }
    }


    public class TaskEmailNotificationModel
    {
        [JsonProperty("emailNotificationId")]
        public int EmailNotificationId { get; set; }

        [JsonProperty("reqEmailNotificationId")]
        public int ReqEmailNotificationId { get; set; }

        [JsonProperty("taskId")]
        public long? TaskId { get; set; }

        [JsonProperty("requestId")]
        public int? RequestId { get; set; }

        [JsonProperty("transactionId")]
        public Guid TransactionId { get; set; }

        [JsonProperty("emailSubject")]
        public string EmailSubject { get; set; }

        [JsonProperty("emailBody")]
        public string EmailBody { get; set; }

        [JsonProperty("toRecipient")]
        public string ToRecipient { get; set; }

        [JsonProperty("ccRecipient")]
        public string CcRecipient { get; set; }

        [JsonProperty("fromRecipient")]
        public string FromRecipient { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("isSent")]
        public bool? IsSent { get; set; }

        [JsonProperty("createdOnIST")]
        public DateTime? CreatedOnIST { get; set; }

        [JsonProperty("createdOnUTC")]
        public DateTime? CreatedOnUTC { get; set; }


        [JsonProperty("isOverdue")]
        public bool IsOverdue { get; set; }
    }
}
