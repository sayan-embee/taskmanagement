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
        Task<TaskGetByIdListViewModel> GetTaskByIdListView(long Id, string Email);
        Task<TaskGetAllViewModel> GetAllTask(TaskGetFilterModel data);
        Task<ReturnMessageModel> ReassignTask(TaskReassignmentTrnModel data);
        Task<List<ReturnMessageModel>> ReassignAllTask(TaskReassignmentTrnModel data);
    }
}