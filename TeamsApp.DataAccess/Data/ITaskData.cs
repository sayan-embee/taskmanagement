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
        Task<List<TaskDetailsCardModel>> GetTaskByUnqId(Guid TaskUnqId);
        Task<List<TaskEmailNotificationModel>> GetEmailsByTaskIdList(string TaskIdList);
        Task<TaskGetByIdListViewModel> GetTaskByIdListView(long Id, string Email);
        Task<TaskGetAllViewModel> GetAllTask(TaskGetFilterModel data);
        Task<ReturnMessageModel> ReassignTask(TaskReassignmentTrnModel data);
        Task<List<ReturnMessageModel>> ReassignAllTask(TaskReassignmentTrnModel data);
        Task<ReturnMessageModel> InsertTaskNotificationResponse_Multiple(List<NotificationResponseTrnModel> data);
        Task<ReturnMessageModel> InsertEmailResponse_Multiple(List<TaskEmailNotificationModel> data);
    }
}