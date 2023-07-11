using Dapper;
using Microsoft.Extensions.Configuration;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.DataAccess.DbAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public class TaskDetailsData : ITaskDetailsData
    {
        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;
        public TaskDetailsData(IConfiguration config, ISQLDataAccess db)
        {
            this._db = db;
            this._config = config;
        }
        #region Task
        public async Task<TaskDetailsModel> Get(int id, string connectionId = "Default")
        {
            TaskDetailsModel retObject = null;
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            var results = await connection.QueryMultipleAsync("dbo.usp_TaskDetails_Get",
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);

            if (results != null)
            {
                var taskDetails = results.ReadFirst<TaskDetailsModel>();
                var uploadedfiles = results.Read<TaskFileUploadModel>();
                var taskChecklist = results.Read<TaskChecklistModel>();
                var taskSelfActionHistory = results.Read<TaskSelfActionHistoryModel>();
                var taskLog = results.Read<TaskLogModel>();

                if (taskDetails != null)
                {
                    retObject = taskDetails;
                }
                if (uploadedfiles != null)
                {
                    retObject.TaskFileUpload = (List<TaskFileUploadModel>)uploadedfiles;
                }
                if (taskChecklist != null)
                {
                    retObject.taskChecklistModel = (List<TaskChecklistModel>)taskChecklist;
                }
                if (taskSelfActionHistory != null)
                {
                    retObject.taskSelfActionHistory = (List<TaskSelfActionHistoryModel>)taskSelfActionHistory;
                }
                if (taskLog != null)
                {
                    retObject.taskLog = (List<TaskLogModel>)taskLog;
                }
            }
            return retObject;
        }

        public async Task<ReturnMessageModel> CheckTaskByMeetingId(long MeetingId, long ParentMeetingId, string connectionId = "Default")
        {
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            var results = await connection.QueryMultipleAsync("dbo.usp_Check_TaskDetailsByMeetingId",
                new
                {
                    MeetingId = MeetingId
                    ,ParentMeetingId = ParentMeetingId
                }, commandType: CommandType.StoredProcedure);

                return results.ReadFirstOrDefault<ReturnMessageModel>();
        }

        public async Task<IEnumerable<TaskDetailsModel>> GetByReferenceNo(Guid TaskReferenceNo, string connectionId = "Default")
        {
            List<TaskDetailsModel> retObject = null;
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            var results = await connection.QueryMultipleAsync("dbo.usp_TaskDetails_GetByReferenceNo",
                new
                {
                    TaskReferenceNo = TaskReferenceNo
                }, commandType: CommandType.StoredProcedure);

            if (results != null)
            {
                var taskDetails = results.Read<TaskDetailsModel>();
                if (taskDetails != null)
                {
                    retObject = (List<TaskDetailsModel>)taskDetails;
                }
            }
            return retObject;
        }

        public async Task<IEnumerable<TaskDetailsModel>> GetByUserADID(string UserADID, string connectionId = "Default")
        {
            List<TaskDetailsModel> retObject = null;
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            var results = await connection.QueryMultipleAsync("dbo.usp_TaskDetails_ReassignDetails_Get",
                new
                {
                    AssignedToADID = UserADID
                }, commandType: CommandType.StoredProcedure);

            if (results != null)
            {
                var taskDetails = results.Read<TaskDetailsModel>();
                if (taskDetails != null)
                {
                    retObject = (List<TaskDetailsModel>)taskDetails;
                }
            }
            return retObject;
        }

        public async Task<IEnumerable<TaskDetailsModel>> GetAll(TaskDetailsModel data)
        {
            return await _db.LoadData<TaskDetailsModel, dynamic>("dbo.usp_TaskDetails_GetAll",
                 new
                 {
                     TaskDetailsType = data.TaskDetailsType.ToLower()
                     ,
                     TaskTitle = data.TaskContext
                     ,
                     Status = data.TaskStatus
                     ,
                     FromDate = data.FromDate
                     ,
                     ToDate = data.ToDate
                     ,
                     Priority = data.TaskPriority
                     ,
                     MeetingTitle = data.MeetingTitle
                     ,
                     MeetingType = data.MeetingType
                     ,
                     CreatedBy = data.CreatedBy
                     ,
                     AssignedTo = data.AssignedToEmail
                     ,
                     AssignedBy = data.ActionTakenByEmail
                 });
        }

        public async Task<IEnumerable<TaskDetailsModel>> GetAllKITask(TaskDetailsModel data)
        {
            return await _db.LoadData<TaskDetailsModel, dynamic>("dbo.usp_GetAllKITaskDivisionWise",
                 new
                 {
                     TaskTitle = data.TaskContext
                     ,
                     Status = data.TaskStatus
                     ,
                     FromDate = data.FromDate
                     ,
                     ToDate = data.ToDate
                     ,
                     MeetingTitle = data.MeetingTitle
                     ,
                     MeetingType = data.MeetingType
                     ,
                     CreatedBy = data.CreatedBy
                     ,
                     AssignedBy = data.ActionTakenByEmail
                     ,
                     Division = data.DivisionName
                 });
        }

        public async Task<IEnumerable<TaskDetailsModel>> GetAllTaskDetailsForCIMeetings(TaskDetailsModelForCIMeetings data)
        {
            return await _db.LoadData<TaskDetailsModel, dynamic>("dbo.usp_TaskDetails_GetAllForCIMeetings",
                 new
                 {
                     CIUniqueID = data.CIUniqueID
                 });
        }

        public async Task<IEnumerable<TaskDetailsModel>> GetAllPrev(TaskDetailsModel data)
        {
            return await _db.LoadData<TaskDetailsModel, dynamic>("dbo.usp_TaskDetails_GetAllPrev",
                 new
                 {
                     MeetingId = data.MeetingId
                     ,
                     SeriesMasterId = data.SeriesMasterId
                     ,
                     TaskTitle = data.TaskContext
                     ,
                     AssignedTo = data.AssignedTo
                 });
        }

        public async Task<ReturnMessageModel> Insert(TaskDetailsModel data)
        {
            var udt = GetTaskParticipant_UDT(data.TaskParticipant);

            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskDetails_Insert",
                new
                {
                    MeetingId = data.MeetingId
                    ,
                    TaskContext = data.TaskContext
                    ,
                    TaskActionPlan = data.TaskActionPlan
                    ,
                    TaskPriority = data.TaskPriority
                    ,
                    TaskClosureDate = data.TaskClosureDate
                    ,
                    ActionTakenBy = data.ActionTakenBy
                    ,
                    ActionTakenByEmail = data.ActionTakenByEmail
                    ,
                    ActionTakenByADID = data.ActionTakenByADID
                    ,
                    CreatedBy = data.CreatedBy
                    ,
                    CreatedByEmail = data.CreatedByEmail
                    ,
                    CreatedByADID = data.CreatedByADID
                    ,
                    TaskParticipant = udt.AsTableValuedParameter("UDT_TaskParticipants")
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> InsertResponse(List<TaskNotificationResponseModel> responseList)
        {
            var udt = GetNotificationResponseList_UDT(responseList);
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskResponse_Insert",
                new
                {
                    Response = udt.AsTableValuedParameter("UDT_TaskNotificationResponse")
                });
            return results.FirstOrDefault();
        }

        public async Task<TaskNotificationResponseModel> GetResponse(long id, string connectionId = "Default")
        {
            TaskNotificationResponseModel retObject = null;
            using IDbConnection connection = new SqlConnection(_config.GetConnectionString(connectionId));
            var results = await connection.QueryMultipleAsync("dbo.usp_TaskResponse_Get",
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);

            if (results != null)
            {
                var taskResponse = results.ReadFirst<TaskNotificationResponseModel>();
                if(taskResponse != null)
                {
                    retObject = taskResponse;
                }
            }
            return retObject;
        }

        public async Task<ReturnMessageModel> DeleteResponse(long id)
        {
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskResponse_Delete",
                new
                {
                    Id = id
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> UpdateResponse(long id)
        {
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskResponse_Update",
                new
                {
                    Id = id
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> Update(TaskDetailsModel data)
        {
            //var udt = GetTaskChecklist_UDT(data.taskChecklistModel);
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskDetails_Update",
                new
                {
                    TaskDetailsType = data.TaskDetailsType.ToLower()
                    ,
                    TaskId = data.TaskId
                    ,
                    TaskReferenceNo = data.TaskReferenceNo
                    ,
                    MeetingId = data.MeetingId
                    ,
                    TaskContext = data.TaskContext
                    ,
                    TaskActionPlan = data.TaskActionPlan
                    ,
                    TaskPriority = data.TaskPriority
                    ,
                    TaskClosureDate = data.TaskClosureDate
                    ,
                    TaskStatus = data.TaskStatus
                    ,
                    TaskRemarks = data.TaskRemarks
                    ,
                    UpdatedBy = data.UpdatedBy
                    ,
                    UpdatedByEmail = data.UpdatedByEmail
                    ,
                    UpdatedByADID = data.UpdatedByADID
                    //,
                    //TaskChecklist = udt.AsTableValuedParameter("UDT_TaskChecklist")
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> UpdateTaskSortOrder(IEnumerable<TaskDetailsModel> dataList)
        {
            var udt = GetTaskSortOrderList_UDT(dataList);
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskSortOrder_Update",
                new
                {
                    TaskSortOrderList = udt.AsTableValuedParameter("UDT_TaskSortOrderList")
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> ReassignTask(TaskDetailsModel data)
        {
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskDetails_Reassign",
                new
                {
                    TaskDetailsType = data.TaskDetailsType.ToLower()
                    ,
                    TaskId = data.TaskId
                    ,
                    MeetingId = data.MeetingId
                    ,
                    AssignedTo = data.AssignedTo
                    ,
                    AssignedToEmail = data.AssignedToEmail
                    ,
                    AssignedToADID = data.AssignedToADID
                    ,
                    OldAssignedToADID = data.OldAssignedToADID
                    ,
                    UpdatedBy = data.UpdatedBy
                    ,
                    UpdatedByEmail = data.UpdatedByEmail
                    ,
                    UpdatedByADID = data.UpdatedByADID
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> FileUpload(List<TaskFileUploadModel> fileList, Guid TaskReferenceNo)
        {
            var udt = GetFileUpload_UDT(fileList);
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskFileUpload_Insert",
                new
                {
                    TaskReferenceNo = TaskReferenceNo
                    ,
                    FileUpload = udt.AsTableValuedParameter("UDT_TaskFileUpload")
                });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> FileUploadUpdate(List<TaskFileUploadModel> fileList)
        {
            var udt = GetFileUpload_UDT(fileList);
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_TaskFileUpload_Insert",
                new
                {
                    FileUpload = udt.AsTableValuedParameter("UDT_TaskFileUpload")
                });
            return results.FirstOrDefault();
        }

        #endregion

        #region TaskChecklist
        public async Task<IEnumerable<TaskChecklistModel>> InsertChecklist(TaskChecklistModel data)
        {
            var results = await _db.SaveData<TaskChecklistModel, dynamic>(storedProcedure: "dbo.usp_TaskChecklist_Insert",
                new
                {
                    TaskId = data.TaskId
                   ,
                    MeetingId = data.MeetingId
                   ,
                    ChecklistTitle = data.ChecklistTitle
                   ,
                    ChecklistCompletionDate = data.ChecklistCompletionDate
                   ,
                    ChecklistStatus = data.ChecklistStatus
                   ,
                    CreatedBy = data.CreatedBy
                   ,
                    CreatedByEmail = data.CreatedByEmail
                   ,
                    CreatedByADID = data.CreatedByADID
                });
            return results;
        }

        public async Task<IEnumerable<TaskChecklistModel>> UpdateChecklist(TaskChecklistModel data)
        {
            var results = await _db.SaveData<TaskChecklistModel, dynamic>(storedProcedure: "dbo.usp_TaskChecklist_Update",
                new
                {
                    ChecklistId = data.ChecklistId
                    ,
                    TaskId = data.TaskId
                   ,
                    MeetingId = data.MeetingId
                   ,
                    ChecklistTitle = data.ChecklistTitle
                   ,
                    ChecklistCompletionDate = data.ChecklistCompletionDate
                   ,
                    ChecklistStatus = data.ChecklistStatus
                   ,
                    UpdatedBy = data.UpdatedBy
                   ,
                    UpdatedByEmail = data.UpdatedByEmail
                   ,
                    UpdatedByADID = data.UpdatedByADID
                });
            return results;
        }

        public async Task<IEnumerable<TaskChecklistModel>> DeleteChecklist(long ChecklistId, long TaskId)
        {
            var results = await _db.SaveData<TaskChecklistModel, dynamic>(storedProcedure: "dbo.usp_TaskChecklist_Delete",
                new
                {
                    ChecklistId = ChecklistId
                    ,
                    TaskId = TaskId
                });
            return results;
        }

        #endregion

        #region UDT Methods
        private DataTable GetTaskParticipant_UDT(IEnumerable<TaskParticipantModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("AssignedTo", typeof(string));
            output.Columns.Add("AssignedToEmail", typeof(string));
            output.Columns.Add("AssignedToADID", typeof(string));

            if (udt != null)
            {
                foreach (var row in udt)
                {
                    output.Rows.Add(
                        row.AssignedTo,
                        row.AssignedToEmail,
                        row.AssignedToADID
                        );
                }
            }
            return output;
        }

        private DataTable GetFileUpload_UDT(IEnumerable<TaskFileUploadModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("MeetingId", typeof(long));
            output.Columns.Add("TaskId", typeof(long));
            output.Columns.Add("FileName", typeof(string));
            output.Columns.Add("FileUrl", typeof(string));
            output.Columns.Add("ContentType", typeof(string));
            if (udt != null)
            {
                foreach (var row in udt)
                {
                    output.Rows.Add(
                         row.MeetingId
                        ,row.TaskId
                        , row.FileName
                        , row.FileUrl
                        , row.ContentType
                        );
                }
            }
            return output;
        }

        private DataTable GetTaskChecklist_UDT(IEnumerable<TaskChecklistModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("ChecklistTitle", typeof(string));
            output.Columns.Add("ChecklistCompletionDate", typeof(DateTime));
            output.Columns.Add("ChecklistStatus", typeof(string));
            //output.Columns.Add("TaskId", typeof(long));
            //output.Columns.Add("MeetingId", typeof(long));
            //output.Columns.Add("CreatedBy", typeof(string));
            //output.Columns.Add("CreatedByEmail", typeof(string));
            //output.Columns.Add("CreatedByADID", typeof(string));
            //output.Columns.Add("UpdatedBy", typeof(string));
            //output.Columns.Add("UpdatedByEmail", typeof(string));
            //output.Columns.Add("UpdatedByADID", typeof(string));
            if (udt != null)
            {
                foreach (var row in udt)
                {
                    output.Rows.Add(
                         row.ChecklistTitle
                         ,row.ChecklistCompletionDate
                         ,row.ChecklistStatus
                         //,row.TaskId
                         //,row.MeetingId
                         //,row.CreatedBy
                         //,row.CreatedByEmail
                         //,row.CreatedByADID
                         //,row.UpdatedBy
                         //,row.UpdatedByEmail
                         //,row.UpdatedByADID
                        );
                }
            }
            return output;
        }

        private DataTable GetNotificationResponseList_UDT(IEnumerable<TaskNotificationResponseModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("TaskId", typeof(long));
            output.Columns.Add("MeetingId", typeof(long));
            output.Columns.Add("ActivityId", typeof(string));
            output.Columns.Add("UserADID", typeof(string));
            output.Columns.Add("UserName", typeof(string));
            output.Columns.Add("Status", typeof(string));
            output.Columns.Add("ConversationId", typeof(string));
            output.Columns.Add("ReplyToId", typeof(string));
            output.Columns.Add("ServiceUrl", typeof(string));
            output.Columns.Add("TimeZone", typeof(string));
            if (udt != null)
            {
                foreach (var row in udt)
                {
                    output.Rows.Add(
                         row.TaskId
                         , row.MeetingId
                         ,row.ActivityId
                         , row.UserADID
                         , row.UserName
                         ,row.Status
                         ,row.ConversationId
                         ,row.ReplyToId
                         ,row.ServiceUrl
                         , row.TimeZone
                        );
                }
            }
            return output;
        }

        private DataTable GetTaskSortOrderList_UDT(IEnumerable<TaskDetailsModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("TaskId", typeof(long));
            output.Columns.Add("SortOrder", typeof(long));
            {
                foreach (var row in udt)
                {
                    output.Rows.Add(
                         row.TaskId
                         , row.SortOrder
                        );
                }
            }
            return output;
        }

        #endregion
    }
}
