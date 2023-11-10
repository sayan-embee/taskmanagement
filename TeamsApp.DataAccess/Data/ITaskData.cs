using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.DataAccess.Data
{
    public interface ITaskData
    {
        Task<ReturnMessageModel> InsertTask(TaskDetailsTrnModel data);
        Task<ReturnMessageModel> InsertComments(TaskProgressTrnModel data);
        Task<ReturnMessageModel> UpdateTask(TaskHistoryTrnModel data);
        Task<TaskGetByIdViewModel> GetTaskById(long Id, string Email);
        Task<List<TaskDetailsCardModel>> GetTaskByUnqId(Guid TaskUnqId, long TaskId = 0);
        Task<List<TaskEmailNotificationModel>> GetEmailsByTaskIdList(string TaskIdList);
        Task<TaskGetByIdListViewModel> GetTaskByIdListView(long Id, string Email);
        Task<TaskGetAllViewModel> GetAllTask(TaskGetFilterModel data);
        Task<TaskGetAllViewModel> GetSubTaskByEmail(TaskGetFilterModel data);
        Task<TaskGetAllViewModel> GetSubTaskById(TaskGetFilterModel data);
        Task<ReturnMessageModel> ReassignTask(TaskReassignmentTrnModel data);
        Task<List<ReturnMessageModel>> ReassignAllTask(TaskReassignmentTrnModel data);
        Task<ReturnMessageModel> InsertTaskNotificationResponse_Multiple(List<NotificationResponseTrnModel> data, string Status);
        Task<ReturnMessageModel> InsertRequestedTaskNotificationResponse_Multiple(List<NotificationResponseTrnModel> data, string Status);
        Task<ReturnMessageModel> GetRequestedTaskNotificationResponse(long TaskId, string Status);
        Task<ReturnMessageModel> InsertEmailResponse_Multiple(List<TaskEmailNotificationModel> data);
        Task<ReturnMessageModel> InsertFileResponse_Multiple(List<TaskFileDetailsTrnModel> data);
        Task<List<TaskDetailsCardModel>> GetTaskForPriorityNotification(DateTime? FromDate, DateTime? ToDate);
        Task<ReturnMessageModel> InsertSchedularLog(SchedularLogModel data);
        Task<List<SchedularLogModel>> GetSchedularLog(DateTime? FromDate, DateTime? ToDate, string TriggerCode, string Type);
        Task<ReturnMessageModel> InsertTaskRequest(TaskRequestDetailsModel data);
        Task<ReturnMessageModel> UpdateTaskRequest(TaskRequestDetailsModel data);
        Task<ReturnMessageModel> ActionOnTaskRequest(TaskRequestDetailsModel data);
        Task<TaskRequestDetailsViewModel> GetRequestedTask(TaskRequestFilterModel data);
        Task<List<TaskFileDetailsTrnModel>> RemoveFileResponse(long Id);
        Task<List<TaskEmailNotificationModel>> GetEmailsByRequestIdList(string RequestIdList);
    }
}