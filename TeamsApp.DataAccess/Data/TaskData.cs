using Dapper;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamsApp.Common.Models;
using TeamsApp.Common.Models.Enum;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.DataAccess.Data
{
    public class TaskData : ITaskData
    {
        private readonly ILogger _logger;

        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;

        public TaskData(
            ILogger<TaskData> logger
            , TelemetryClient telemetryClient

            , IConfiguration config
            , ISQLDataAccess db)
        {
            this._logger = logger;

            this._db = db;
            this._config = config;
        }

        #region GET

        public async Task<TaskGetByIdViewModel> GetTaskById(long Id, string Email)
        {
            try
            {
                var returnModel = new TaskGetByIdViewModel();
                using IDbConnection connection = new SqlConnection(_config.GetConnectionString("Default"));
                var results = await connection.QueryMultipleAsync("usp_Task_GetById",
                new
                {
                    Id,
                    Email
                }, commandType: CommandType.StoredProcedure);

                if (results != null)
                {
                    // Role
                    var loggedInUserRole = await results.ReadAsync<RoleMasterModel>();

                    // TaskDetails
                    var taskDetails = await results.ReadAsync<TaskDetailsTrnModel>();
                    if (taskDetails != null)
                    {                      
                        returnModel.LoggedInUserRole = loggedInUserRole.FirstOrDefault();

                        returnModel.TaskDetails = taskDetails.FirstOrDefault();

                        // Task Progress
                        var taskProgressList = await results.ReadAsync<TaskProgressViewModel>();

                        // Task Assignment
                        var taskAssignmentList = await results.ReadAsync<TaskAssignmentTrnModel>();

                        // Task History
                        var taskHistoryList = await results.ReadAsync<TaskHistoryViewModel>();                        

                        if (taskProgressList != null && taskProgressList.Any())
                        {
                            foreach (var progress in taskProgressList)
                            {
                                if (taskHistoryList != null && taskHistoryList.Any())
                                {
                                    var taskHistorySubList = taskHistoryList.Where(x => x.ProgressId == progress.ProgressId);
                                    if (taskHistorySubList != null && taskHistorySubList.Any())
                                    {
                                        progress.TaskHistoryDetails = taskHistorySubList.FirstOrDefault();
                                    }
                                }


                                if (taskAssignmentList != null && taskAssignmentList.Any())
                                {
                                    var taskAssignmentSubList = taskAssignmentList.Where(x => x.ProgressId == progress.ProgressId);
                                    if (taskAssignmentSubList != null && taskAssignmentSubList.Any())
                                    {
                                        progress.TaskAssignmentDetails = taskAssignmentSubList.FirstOrDefault();
                                    }
                                }
                            }                           

                            returnModel.TaskProgressList = taskProgressList.ToList();
                        }
                    }
                }
                return returnModel;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> GetTaskById() --> SQL(usp_Task_GetById) execution failed");
                return null;
            }
        }


        public async Task<List<TaskDetailsCardModel>> GetTaskByUnqId(Guid TaskUnqId)
        {
            var returnObject = new List<TaskDetailsCardModel>();
            try
            {
                var results = await _db.LoadData<TaskDetailsCardModel, dynamic>("dbo.usp_Task_GetByUnqId",
                new
                {
                    TaskUnqId
                });

                if (results != null && results.Any()) { returnObject = results.ToList(); }

                return returnObject;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> GetTaskByUnqId() --> SQL(usp_Task_GetByUnqId) execution failed");
                return null;
            }
        }


        public async Task<TaskGetByIdListViewModel> GetTaskByIdListView(long Id, string Email)
        {
            try
            {
                var returnModel = new TaskGetByIdListViewModel();
                using IDbConnection connection = new SqlConnection(_config.GetConnectionString("Default"));
                var results = await connection.QueryMultipleAsync("usp_Task_GetByIdListView",
                new
                {
                    Id,
                    Email
                }, commandType: CommandType.StoredProcedure);

                if (results != null)
                {
                    // Role
                    var loggedInUserRole = await results.ReadAsync<RoleMasterModel>();

                    // TaskDetails
                    var taskDetails = await results.ReadAsync<TaskDetailsTrnModel>();
                    if (taskDetails != null)
                    {
                        returnModel.LoggedInUserRole = loggedInUserRole.FirstOrDefault();

                        returnModel.TaskDetails = taskDetails.FirstOrDefault();

                        // Task Assignment
                        var taskAssignmentList = await results.ReadAsync<TaskProgressViewModelAssignmentDetails>();

                        // Task History
                        var taskHistoryList = await results.ReadAsync<TaskProgressViewModelHistoryDetails>();

                        if (taskAssignmentList != null && taskAssignmentList.Any())
                        {
                            returnModel.TaskAssignmentList = taskAssignmentList.ToList();
                        }

                        if (taskHistoryList != null && taskHistoryList.Any())
                        {
                            returnModel.TaskHistoryList = taskHistoryList.ToList();
                        }
                    }
                }
                return returnModel;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> GetTaskByIdListView() --> SQL(usp_Task_GetByIdListView) execution failed");
                return null;
            }
        }


        public async Task<TaskGetAllViewModel> GetAllTask(TaskGetFilterModel data)
        {
            var returnObject = new TaskGetAllViewModel();
            try
            {
                var results = await _db.LoadData<TaskGetByEmailModel, dynamic>("dbo.usp_Task_GetAll",
                new
                {
                    data.LoggedInUserEmail,
                    data.StatusId,
                    data.PriorityId,
                    data.RoleId,
                    data.ParentTaskId,
                    data.TaskSubject,
                    data.FromDate,
                    data.ToDate
                });

                if (results != null && results.Any()) { returnObject.TaskDetailsList = results.ToList(); }

                return returnObject;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> GetAllTask() --> SQL(usp_Task_GetAll) execution failed");
                return null;
            }
        }


        public async Task<TaskGetAllViewModel> GetAllSubTask(TaskGetFilterModel data)
        {
            var returnObject = new TaskGetAllViewModel();
            try
            {
                var results = await _db.LoadData<TaskGetByEmailModel, dynamic>("dbo.usp_SubTask_GetAll",
                new
                {
                    data.LoggedInUserEmail,
                    data.StatusId,
                    data.PriorityId,
                    data.RoleId,
                    data.ParentTaskId,
                    data.TaskSubject,
                    data.FromDate,
                    data.ToDate
                });

                if (results != null && results.Any()) { returnObject.TaskDetailsList = results.ToList(); }

                return returnObject;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> GetAllSubTask() --> SQL(usp_SubTask_GetAll) execution failed");
                return null;
            }
        }

        #endregion

        #region CREATE

        public async Task<ReturnMessageModel> InsertTask(TaskDetailsTrnModel data)
        {
            try
            {
                var udt = GetTaskAssigneeList_UDT(data.TaskAssigneeList);

                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Task_Insert",
                new
                {
                    data.StatusId,
                    data.PriorityId,
                    data.RoleId,
                    data.ParentTaskId,
                    data.CreatedByName,
                    data.CreatedByEmail,
                    data.CreatedByUPN,
                    data.CreatedByADID,
                    data.TaskSubject,
                    data.TaskDesc,
                    data.InitialTargetDate,
                    data.AssignerName,
                    data.AssignerEmail,
                    data.AssignerUPN,
                    data.AssignerADID,
                    //data.AssigneeName,
                    //data.AssigneeEmail,
                    //data.AssigneeUPN,
                    //data.AssigneeADID,
                    data.CoordinatorName,
                    data.CoordinatorEmail,
                    data.CoordinatorUPN,
                    data.CoordinatorADID,
                    data.CollaboratorName,
                    data.CollaboratorEmail,
                    data.CollaboratorUPN,
                    data.CollaboratorADID,
                    udt_TaskAssignee = udt.AsTableValuedParameter("udt_TaskAssignee")
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> CreateTask() --> SQL(usp_Task_Insert) execution failed");
                return null;
            }
        }


        private DataTable GetTaskAssigneeList_UDT(List<TaskAssigneeListTrnModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("AssigneeName", typeof(string));
            output.Columns.Add("AssigneeEmail", typeof(string));
            output.Columns.Add("AssigneeUPN", typeof(string));
            output.Columns.Add("AssigneeADID", typeof(string));

            if (udt != null)
            {
                foreach (var row in udt)
                {
                    output.Rows.Add(
                        row.AssigneeName,
                        row.AssigneeEmail,
                        row.AssigneeUPN,
                        row.AssigneeADID
                        );
                }
            }
            return output;
        }

        #endregion

        #region UPDATE

        public async Task<ReturnMessageModel> InsertComments(TaskProgressTrnModel data)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Task_InsertComments",
                new
                {
                    data.TaskId,
                    data.RoleId,
                    data.ProgressRemarks,
                    data.UpdatedByName,
                    data.UpdatedByEmail,
                    data.UpdatedByUPN,
                    data.UpdatedByADID
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> InsertComments() --> SQL(usp_Task_InsertComments) execution failed");
                return null;
            }
        }


        public async Task<ReturnMessageModel> UpdateTask(TaskHistoryTrnModel data)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Task_Update",
                new
                {
                    data.TaskId,
                    data.StatusId,
                    data.PriorityId,
                    data.RoleId,
                    data.ParentTaskId,
                    data.TaskProgressDetails.UpdatedByName,
                    data.TaskProgressDetails.UpdatedByEmail,
                    data.TaskProgressDetails.UpdatedByUPN,
                    data.TaskProgressDetails.UpdatedByADID,
                    data.TaskSubject,
                    data.TaskDesc,
                    data.CurrentTargetDate,
                    data.AssignerName,
                    data.AssignerEmail,
                    data.AssignerUPN,
                    data.AssignerADID,
                    //data.AssigneeName,
                    //data.AssigneeEmail,
                    //data.AssigneeUPN,
                    //data.AssigneeADID,
                    data.CoordinatorName,
                    data.CoordinatorEmail,
                    data.CoordinatorUPN,
                    data.CoordinatorADID,
                    data.CollaboratorName,
                    data.CollaboratorEmail,
                    data.CollaboratorUPN,
                    data.CollaboratorADID,
                    data.TaskProgressDetails.ProgressRemarks,
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> UpdateTask() --> SQL(usp_Task_Update) execution failed");
                return null;
            }
        }


        public async Task<ReturnMessageModel> ReassignTask(TaskReassignmentTrnModel data)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Task_Reassign",
                new
                {
                    data.TaskId,
                    data.TaskProgressDetails.UpdatedByName,
                    data.TaskProgressDetails.UpdatedByEmail,
                    data.TaskProgressDetails.UpdatedByUPN,
                    data.TaskProgressDetails.UpdatedByADID,
                    data.AssigneeName,
                    data.AssigneeEmail,
                    data.AssigneeUPN,
                    data.AssigneeADID,
                    data.TaskProgressDetails.RoleId,
                    data.TaskProgressDetails.ProgressRemarks,
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> ReassignTask() --> SQL(usp_Task_Reassign) execution failed");
                return null;
            }
        }


        public async Task<List<ReturnMessageModel>> ReassignAllTask(TaskReassignmentTrnModel data)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Task_ReassignAll",
                new
                {
                    data.TaskProgressDetails.UpdatedByName,
                    data.TaskProgressDetails.UpdatedByEmail,
                    data.TaskProgressDetails.UpdatedByUPN,
                    data.TaskProgressDetails.UpdatedByADID,
                    data.AssigneeName,
                    data.AssigneeEmail,
                    data.AssigneeUPN,
                    data.AssigneeADID,
                    data.TaskProgressDetails.ProgressRemarks,
                });

                if (results != null && results.Any()) { return results.ToList(); }

                return null;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> ReassignAllTask() --> SQL(usp_Task_ReassignAll) execution failed");
                return null;
            }
        }

        #endregion

        #region NOTIFICATION

        public async Task<ReturnMessageModel> InsertTaskNotificationResponse_Multiple(List<NotificationResponseTrnModel> data)
        {
            try
            {
                var udt = GetTaskNotificationResponse_UDT(data);

                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "usp_Task_Insert_NotificationResponse",
                new
                {
                    udt_NotificationResponse = udt.AsTableValuedParameter("udt_TaskNotificationResponse")
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"TaskData --> InsertTaskNotificationResponse() --> SQL(usp_Task_Insert_NotificationResponse) execution failed");
                return null;
            }
        }

        private DataTable GetTaskNotificationResponse_UDT(List<NotificationResponseTrnModel> udt)
        {
            var output = new DataTable();
            output.Columns.Add("ReplyToId", typeof(string));
            output.Columns.Add("ActivityId", typeof(string));
            output.Columns.Add("ConversationId", typeof(string));
            output.Columns.Add("ServiceUrl", typeof(string));
            output.Columns.Add("UserName", typeof(string));
            output.Columns.Add("UserADID", typeof(string));
            output.Columns.Add("Status", typeof(string));
            output.Columns.Add("TaskId", typeof(long));

            if (udt != null)
            {
                foreach (var row in udt)
                {
                    if (row != null)
                    {
                        output.Rows.Add(
                        row.ReplyToId,
                        row.ActivityId,
                        row.ConversationId,
                        row.ServiceUrl,
                        row.UserName,
                        row.UserADID,
                        row.Status,
                        row.TaskId
                        );
                    }
                }
            }
            return output;
        }

        #endregion
    }
}
