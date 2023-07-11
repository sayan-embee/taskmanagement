using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public interface ITaskDetailsData
    {
        Task<TaskDetailsModel> Get(int id, string connectionId = "Default");
        Task<ReturnMessageModel> CheckTaskByMeetingId(long MeetingId, long ParentMeetingId, string connectionId = "Default");
        Task<IEnumerable<TaskDetailsModel>> GetByReferenceNo(Guid TaskReferenceNo, string connectionId = "Default");
        Task<IEnumerable<TaskDetailsModel>> GetAll(TaskDetailsModel data);
        Task<IEnumerable<TaskDetailsModel>> GetAllKITask(TaskDetailsModel data);
        Task<IEnumerable<TaskDetailsModel>> GetAllTaskDetailsForCIMeetings(TaskDetailsModelForCIMeetings data);
        Task<IEnumerable<TaskDetailsModel>> GetAllPrev(TaskDetailsModel data);
        Task<ReturnMessageModel> Insert(TaskDetailsModel data);
        Task<ReturnMessageModel> Update(TaskDetailsModel data);
        Task<ReturnMessageModel> FileUpload(List<TaskFileUploadModel> fileList, Guid TaskReferenceNo);
        Task<IEnumerable<TaskChecklistModel>> InsertChecklist(TaskChecklistModel data);
        Task<TaskNotificationResponseModel> GetResponse(long id, string connectionId = "Default");
        Task<ReturnMessageModel> DeleteResponse(long id);
        Task<IEnumerable<TaskChecklistModel>> UpdateChecklist(TaskChecklistModel data);
        Task<IEnumerable<TaskChecklistModel>> DeleteChecklist(long ChecklistId, long TaskId);
        Task<ReturnMessageModel> FileUploadUpdate(List<TaskFileUploadModel> fileList);
        Task<ReturnMessageModel> ReassignTask(TaskDetailsModel data);
        Task<ReturnMessageModel> InsertResponse(List<TaskNotificationResponseModel> responseList);
        Task<ReturnMessageModel> UpdateResponse(long id);
        Task<IEnumerable<TaskDetailsModel>> GetByUserADID(string UserADID, string connectionId = "Default");
        Task<ReturnMessageModel> UpdateTaskSortOrder(IEnumerable<TaskDetailsModel> dataList);
    }
}