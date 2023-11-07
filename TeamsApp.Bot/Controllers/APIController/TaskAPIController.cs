using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Threading.Tasks;
using System;
using TeamsApp.Bot.Models;
using TeamsApp.Common.Models.Enum;
using TeamsApp.DataAccess.Data;
using TeamsApp.Common.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Linq;
using TeamsApp.Bot.Helpers;
using Microsoft.SqlServer.Server;
using TeamsApp.Bot.Helpers.NotificationHelper;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using TeamsApp.Bot.Helpers.EmailHelper;
using System.Collections.Generic;
using TeamsApp.Bot.Services.AzureBlob;
using TeamsApp.Bot.Helpers.FileHelper;
using Microsoft.Graph;
using Azure;
using System.Text;

namespace TeamsApp.Bot.Controllers.APIController
{
    [Route("api/v1.0/task")]
    [ApiController]
    //[Authorize]
    public class TaskAPIController : BaseController
    {
        private readonly ILogger _logger;
        private readonly TelemetryClient _telemetryClient;

        private readonly ITaskData _taskData;
        private readonly INotificationHelper _notificationHelper;
        private readonly IEmailHelper _emailHelper;
        private readonly IFileHelper _fileHelper;

        public TaskAPIController(
            ILogger<TaskAPIController> logger
            , TelemetryClient telemetryClient
            , ITaskData taskData
            , INotificationHelper notificationHelper
            , IEmailHelper emailHelper
            , IFileHelper fileHelper
            )
            : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient;
            this._taskData = taskData;
            this._notificationHelper = notificationHelper;
            this._emailHelper = emailHelper;
            this._fileHelper = fileHelper;
        }

        #region GET

        [HttpGet]
        [Route("getById")]
        public async Task<IActionResult> GetTaskById(long Id, string Email, bool? IsListView = false)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");
                //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");

                if((bool)IsListView)
                {
                    var response = await this._taskData.GetTaskByIdListView(Id, Email);
                    if (response != null)
                    {
                        DateTime endTime = DateTime.UtcNow;
                        ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");
                        //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                        TimeSpan timeDifference = endTime - startTime;
                        string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                        response.ExecutionTime = formattedTimeDifference;

                        ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                        //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                    }
                    return this.Ok(response);
                }
                else
                {
                    var response = await this._taskData.GetTaskById(Id, Email);
                    if (response != null)
                    {
                        DateTime endTime = DateTime.UtcNow;
                        ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");
                        //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                        TimeSpan timeDifference = endTime - startTime;
                        string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                        response.ExecutionTime = formattedTimeDifference;

                        ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                        //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                    }
                    return this.Ok(response);
                }                
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> GetTaskById() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> GetTaskById() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }


        [HttpGet]
        [Route("getAll")]
        public async Task<IActionResult> GetAllTask(TaskGetFilterModel data)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetAllTask() execution started: {DateTime.UtcNow}");
                //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");

                var response = await this._taskData.GetAllTask(data);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetAllTask() execution ended: {DateTime.UtcNow}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetAllTask() execution time: {formattedTimeDifference}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> GetAllTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> GetAllTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }


        [HttpGet]
        [Route("getSubTaskById")]
        public async Task<IActionResult> GetSubTaskById(TaskGetFilterModel data)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetSubTaskById() execution started: {DateTime.UtcNow}");
                //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");

                var response = await this._taskData.GetSubTaskById(data);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetSubTaskById() execution ended: {DateTime.UtcNow}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetSubTaskById() execution time: {formattedTimeDifference}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> GetSubTaskById() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> GetSubTaskById() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }


        [HttpGet]
        [Route("getSubTaskByEmail")]
        public async Task<IActionResult> GetSubTaskByEmail(TaskGetFilterModel data)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetSubTaskByEmail() execution started: {DateTime.UtcNow}");
                //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");

                var response = await this._taskData.GetSubTaskByEmail(data);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetSubTaskByEmail() execution ended: {DateTime.UtcNow}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetSubTaskByEmail() execution time: {formattedTimeDifference}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> GetSubTaskByEmail() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> GetSubTaskByEmail() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        #endregion

        #region CREATE

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateTask(IFormCollection formdata)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateTask() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> CreateTask() execution started: {DateTime.UtcNow}");

                TaskDetailsTrnModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskDetailsTrnModel>(JObject.Parse(data).ToString());
                }

                // CHECK MANDATORY FIELDS IN BACKEND (ALREADY CHECKED IN FRONTEND)
                if (string.IsNullOrEmpty(dataModel.TaskSubject)
                    || string.IsNullOrEmpty(dataModel.TaskDesc)
                    || string.IsNullOrEmpty(dataModel.AssignerADID)
                    || string.IsNullOrEmpty(dataModel.CoordinatorADID)
                    || string.IsNullOrEmpty(dataModel.CreatedByADID)
                    || dataModel.InitialTargetDate == null
                    || (dataModel.StatusId == null || dataModel.StatusId == 0)
                    || (dataModel.PriorityId == null || dataModel.PriorityId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                if (dataModel.TaskAssigneeList != null && dataModel.TaskAssigneeList.Any())
                {
                    foreach (var assignee in dataModel.TaskAssigneeList)
                    {
                        if (string.IsNullOrEmpty(assignee.AssigneeADID))
                        {
                            return this.Ok("Mandatory fields are required");
                        }
                    }
                }

                if (dataModel.ParentTaskId == null)
                {
                    dataModel.ParentTaskId = 0;
                }

                // ASSIGN ROLE BASED ON LOGGED-IN USER / CREATED BY USER
                if (!string.IsNullOrEmpty(dataModel.CreatedByADID))
                {
                    if(!string.IsNullOrEmpty(dataModel.AssignerADID) && (dataModel.AssignerADID == dataModel.CreatedByADID))
                    {
                        dataModel.RoleId = 1; // LOGGED-IN USER AS ASSIGNEE
                    }
                    if (!string.IsNullOrEmpty(dataModel.CoordinatorADID) && (dataModel.CoordinatorADID == dataModel.CreatedByADID))
                    {
                        dataModel.RoleId = 3; // LOGGED-IN USER AS COORDINATOR
                    }
                }

                var response = await this._taskData.InsertTask(dataModel);
                if (response != null)
                {
                    // UPLOAD FILES
                    if (formdata.Files != null && formdata.Files.Count > 0)
                    {
                        //_ = Task.Run(() => this._fileHelper.ProcesssFile_CreateTask_NonAsync(dataModel, formdata.Files, response.ReferenceNo, response.TransactionId)); // NOT WORKING
                        await this._fileHelper.ProcesssFile_CreateTask_NonAsync(dataModel, formdata.Files, response.ReferenceNo, response.TransactionId);
                    }

                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> CreateTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> CreateTask() execution time: {formattedTimeDifference}");

                    // INITIATE OTHER ACTIVITIES
                    _ = Task.Factory.StartNew(() => this.ProcessOtherActivities_CreateTask(response));

                }
                return this.Ok(response);                
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> CreateTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        private async Task ProcessOtherActivities_CreateTask(ReturnMessageModel response)
        {
            if (response.GuidId != Guid.Empty)
            {
                // SEND CARD NOTIFICATIONS TO STAKEHOLDERS
                var taskListResponse = await this._taskData.GetTaskByUnqId(response.GuidId);
                if (taskListResponse != null && taskListResponse.Any())
                {
                    await this._notificationHelper.ProcesssNotification_CreateTask(taskListResponse);
                }
            }

            if (!string.IsNullOrEmpty(response.ReferenceNo))
            {
                var taskIdList = (response.ReferenceNo).Split(",");

                if (taskIdList != null && taskIdList.Any())
                {
                    // SEND EMAIL NOTIFICATIONS TO STAKEHOLDERS
                    var taskEmailDetails = await this._taskData.GetEmailsByTaskIdList(response.ReferenceNo);
                    if (taskEmailDetails != null && taskEmailDetails.Any())
                    {
                        await this._emailHelper.ProcesssEmail_CreateTask(taskEmailDetails);
                    }
                }
            }
        }

        #endregion

        #region UPDATE

        [HttpPost]
        [Route("update/addComments")]
        public async Task<IActionResult> AddComments(IFormCollection formdata)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> AddComments() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> AddComments() execution started: {DateTime.UtcNow}");

                TaskProgressTrnModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskProgressTrnModel>(JObject.Parse(data).ToString());
                }

                if (string.IsNullOrEmpty(dataModel.ProgressRemarks)
                    || string.IsNullOrEmpty(dataModel.UpdatedByADID)
                    || (dataModel.TaskId == null || dataModel.TaskId == 0)
                    || (dataModel.RoleId == null || dataModel.RoleId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                var response = await this._taskData.InsertComments(dataModel);
                if (response != null)
                {
                    // FILE UPLOAD
                    // SEND NOTIFICATIONS TO STAKEHOLDERS

                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> CreateTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> CreateTask() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> CreateTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }

        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> UpdateTask(IFormCollection formdata)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateTask() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> UpdateTask() execution started: {DateTime.UtcNow}");

                TaskHistoryTrnModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskHistoryTrnModel>(JObject.Parse(data).ToString());
                }

                // CHECK MANDATORY FIELDS IN BACKEND (ALREADY CHECKED IN FRONTEND)
                if (string.IsNullOrEmpty(dataModel.TaskSubject)
                    || string.IsNullOrEmpty(dataModel.TaskDesc)
                    || string.IsNullOrEmpty(dataModel.AssignerADID)
                    || string.IsNullOrEmpty(dataModel.CoordinatorADID)
                    || dataModel.CurrentTargetDate == null
                    || (dataModel.StatusId == null || dataModel.StatusId == 0)
                    || (dataModel.PriorityId == null || dataModel.PriorityId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                if ((dataModel.TaskProgressDetails == null || string.IsNullOrEmpty(dataModel.TaskProgressDetails.ProgressRemarks))
                    || string.IsNullOrEmpty(dataModel.TaskProgressDetails.UpdatedByADID)
                    || (dataModel.TaskId == null || dataModel.TaskId == 0)
                    || (dataModel.RoleId == null || dataModel.RoleId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                if (dataModel.ParentTaskId == null)
                {
                    dataModel.ParentTaskId = 0;
                }

                var response = await this._taskData.UpdateTask(dataModel);
                if (response != null)
                {
                    // UPLOAD FILES
                    if (formdata.Files != null && formdata.Files.Count > 0)
                    {
                        //_ = Task.Run(() => this._fileHelper.ProcesssFile_UpdateTask_NonAsync(dataModel, formdata.Files, response.ReferenceNo, response.TransactionId)); // NOT WORKING
                        await this._fileHelper.ProcesssFile_UpdateTask_NonAsync(dataModel, formdata.Files, response.ReferenceNo, response.TransactionId);
                    }

                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> CreateTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> UpdateTask() execution time: {formattedTimeDifference}");

                    // SEND NOTIFICATIONS TO STAKEHOLDERS
                    _ = Task.Factory.StartNew(() => this.ProcessOtherActivities_UpdateTask(response));
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> UpdateTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> UpdateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        private async Task ProcessOtherActivities_UpdateTask(ReturnMessageModel response)
        {
            if (!string.IsNullOrEmpty(response.Id) && response.GuidId != Guid.Empty)
            {
                long TaskId = long.Parse(response.Id);

                // SEND NOTIFICATIONS TO STAKEHOLDERS
                var taskListResponse = await this._taskData.GetTaskByUnqId(response.GuidId, TaskId);
                if (taskListResponse != null && taskListResponse.Any())
                {
                    await this._notificationHelper.ProcesssNotification_UpdateTask(taskListResponse);
                }
            }

            if (!string.IsNullOrEmpty(response.ReferenceNo))
            {
                var taskIdList = (response.ReferenceNo).Split(",");

                if (taskIdList != null && taskIdList.Any())
                {
                    // SEND EMAIL TO STAKEHOLDERS
                    var taskEmailDetails = await this._taskData.GetEmailsByTaskIdList(response.ReferenceNo);
                    if (taskEmailDetails != null && taskEmailDetails.Any())
                    {
                        await this._emailHelper.ProcesssEmail_UpdateTask(taskEmailDetails);
                    }
                }
            }
        }


        [HttpPost]
        [Route("update/reassign")]
        public async Task<IActionResult> ReassignTask(IFormCollection formdata)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignTask() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> ReassignTask() execution started: {DateTime.UtcNow}");

                TaskReassignmentTrnModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskReassignmentTrnModel>(JObject.Parse(data).ToString());
                }

                // CHECK MANDATORY FIELDS IN BACKEND (ALREADY CHECKED IN FRONTEND)
                if (string.IsNullOrEmpty(dataModel.AssigneeADID)
                    || (dataModel.TaskId == null || dataModel.TaskId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                if ((dataModel.TaskProgressDetails == null || string.IsNullOrEmpty(dataModel.TaskProgressDetails.ProgressRemarks))
                    || string.IsNullOrEmpty(dataModel.TaskProgressDetails.UpdatedByADID)
                    || (dataModel.TaskProgressDetails.RoleId == null || dataModel.TaskProgressDetails.RoleId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                var response = await this._taskData.ReassignTask(dataModel);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> ReassignTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> ReassignTask() execution time: {formattedTimeDifference}");

                    // SEND NOTIFICATIONS TO STAKEHOLDERS
                    _ = Task.Factory.StartNew(() => this.ProcessOtherActivities_ReassignTask(response));
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> ReassignTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> ReassignTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        private async Task ProcessOtherActivities_ReassignTask(ReturnMessageModel response)
        {
            if (!string.IsNullOrEmpty(response.Id) && response.GuidId != Guid.Empty)
            {
                long TaskId = long.Parse(response.Id);

                // SEND NOTIFICATIONS TO STAKEHOLDERS
                var taskListResponse = await this._taskData.GetTaskByUnqId(response.GuidId, TaskId);
                if (taskListResponse != null && taskListResponse.Any())
                {
                    if (!string.IsNullOrEmpty(response.ReferenceNo))
                    {
                        try
                        {
                            var prevAssigneeList = JsonConvert.DeserializeObject<List<TaskAssigneeTrnModel>>(response.ReferenceNo);
                            if (prevAssigneeList != null && prevAssigneeList.Any())
                            {
                                await this._notificationHelper.ProcesssNotification_ReassignTask(taskListResponse, prevAssigneeList);
                            }
                        }
                        catch(Exception ex)
                        {
                            this._logger.LogError(ex, $"TaskAPIController --> ProcessOtherActivities_ReassignTask() execution failed: {JsonConvert.SerializeObject(response.ReferenceNo, Formatting.Indented)}");
                            ExceptionLogging.SendErrorToText(ex);
                        }
                    }
                    else
                    {
                        await this._notificationHelper.ProcesssNotification_ReassignTask(taskListResponse);
                    }                    
                }

                response.ReferenceNo = "," + (response.Id).ToString() + ","; // CUSTOMIZATION
            }

            if (!string.IsNullOrEmpty(response.ReferenceNo))
            {
                var taskIdList = (response.ReferenceNo).Split(",");

                if (taskIdList != null && taskIdList.Any())
                {
                    // SEND EMAIL TO STAKEHOLDERS
                    var taskEmailDetails = await this._taskData.GetEmailsByTaskIdList(response.ReferenceNo);
                    if (taskEmailDetails != null && taskEmailDetails.Any())
                    {
                        await this._emailHelper.ProcesssEmail_UpdateTask(taskEmailDetails);
                    }
                }
            }
        }


        [HttpPost]
        [Route("update/reassignAll")]
        public async Task<IActionResult> ReassignAllTask(IFormCollection formdata)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignAllTask() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> ReassignAllTask() execution started: {DateTime.UtcNow}");

                TaskReassignmentTrnModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskReassignmentTrnModel>(JObject.Parse(data).ToString());
                }

                if ((dataModel.TaskProgressDetails == null || string.IsNullOrEmpty(dataModel.TaskProgressDetails.ProgressRemarks))
                    || string.IsNullOrEmpty(dataModel.TaskProgressDetails.UpdatedByADID)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                var response = await this._taskData.ReassignAllTask(dataModel);
                if (response != null)
                {
                    // FILE UPLOAD
                    // SEND NOTIFICATIONS TO STAKEHOLDERS

                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignAllTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> ReassignAllTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.FirstOrDefault().ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignAllTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> ReassignAllTask() execution time: {formattedTimeDifference}");

                    // SEND NOTIFICATIONS TO STAKEHOLDERS
                    _ = Task.Factory.StartNew(() => this.ProcessOtherActivities_ReassignAllTask(response));
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> ReassignAllTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> ReassignAllTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        private async Task ProcessOtherActivities_ReassignAllTask(List<ReturnMessageModel> response)
        {
            if (response != null && response.Any())
            {
                var reassignAllTaskList = new List<Task>();

                foreach (var item in response)
                {
                    reassignAllTaskList.Add(this.ProcessOtherActivities_ReassignTask(item));
                }

                if (reassignAllTaskList != null && reassignAllTaskList.Any())
                {
                    await Task.WhenAll(reassignAllTaskList);
                }
            }
        }

        #endregion

        #region FILE

        //[HttpPost]
        //[Route("files/upload")]
        //public async Task<IActionResult> UploadFiles(IFormCollection formdata)
        //{
        //    try
        //    {
        //        DateTime startTime = DateTime.UtcNow;
        //        ExceptionLogging.WriteMessageToText($"TaskAPIController --> UploadFiles() execution started: {DateTime.UtcNow}");
        //        this._logger.LogInformation($"TaskAPIController --> AddComments() execution started: {DateTime.UtcNow}");

        //        DateTime endTime = DateTime.UtcNow;
        //        ExceptionLogging.WriteMessageToText($"TaskAPIController --> UploadFiles() execution ended: {DateTime.UtcNow}");
        //        this._logger.LogInformation($"TaskAPIController --> UploadFiles() execution ended: {DateTime.UtcNow}");

        //        TimeSpan timeDifference = endTime - startTime;
        //        string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

        //        //response.ExecutionTime = formattedTimeDifference;

        //        ExceptionLogging.WriteMessageToText($"TaskAPIController --> UploadFiles() execution time: {formattedTimeDifference}");
        //        this._logger.LogInformation($"TaskAPIController --> UploadFiles() execution time: {formattedTimeDifference}");
        //    }
        //    catch (Exception ex)
        //    {
        //        this.RecordEvent("TaskAPIController --> UploadFiles() - Failed to execute.", RequestType.Failed);
        //        this._logger.LogError(ex, $"TaskAPIController --> UploadFiles() execution failed");
        //        ExceptionLogging.SendErrorToText(ex);
        //        return this.Ok();
        //    }            
        //}


        //[HttpPost]
        //[Route("files/remove")]
        //public async Task<IActionResult> RemoveFiles(IFormCollection formdata)
        //{
        //    try
        //    {
        //        DateTime startTime = DateTime.UtcNow;
        //        ExceptionLogging.WriteMessageToText($"TaskAPIController --> RemoveFiles() execution started: {DateTime.UtcNow}");
        //        this._logger.LogInformation($"TaskAPIController --> RemoveFiles() execution started: {DateTime.UtcNow}");

        //        DateTime endTime = DateTime.UtcNow;
        //        ExceptionLogging.WriteMessageToText($"TaskAPIController --> RemoveFiles() execution ended: {DateTime.UtcNow}");
        //        this._logger.LogInformation($"TaskAPIController --> RemoveFiles() execution ended: {DateTime.UtcNow}");

        //        TimeSpan timeDifference = endTime - startTime;
        //        string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

        //        //response.ExecutionTime = formattedTimeDifference;

        //        ExceptionLogging.WriteMessageToText($"TaskAPIController --> RemoveFiles() execution time: {formattedTimeDifference}");
        //        this._logger.LogInformation($"TaskAPIController --> RemoveFiles() execution time: {formattedTimeDifference}");
        //    }
        //    catch (Exception ex)
        //    {
        //        this.RecordEvent("TaskAPIController --> RemoveFiles() - Failed to execute.", RequestType.Failed);
        //        this._logger.LogError(ex, $"TaskAPIController --> RemoveFiles() execution failed");
        //        ExceptionLogging.SendErrorToText(ex);
        //        return this.Ok();
        //    }            
        //}

        #endregion

        #region REQUEST

        [HttpPost]
        [Route("request/get")]
        public async Task<IActionResult> GetRequestedTask(TaskRequestFilterModel data)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetRequestedTask() execution started: {DateTime.UtcNow}");
                //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");

                var response = await this._taskData.GetRequestedTask(data);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetRequestedTask() execution ended: {DateTime.UtcNow}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetRequestedTask() execution time: {formattedTimeDifference}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> GetRequestedTask() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> GetRequestedTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        [HttpPost]
        [Route("request")]
        public async Task<IActionResult> CreateRequest(TaskRequestDetailsModel dataModel)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateRequest() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> CreateRequest() execution started: {DateTime.UtcNow}");

                // CHECK MANDATORY FIELDS IN BACKEND (ALREADY CHECKED IN FRONTEND)
                if (
                   //string.IsNullOrEmpty(dataModel.TaskSubject)
                   //|| string.IsNullOrEmpty(dataModel.TaskDesc)
                   dataModel.CurrentTargetDate == null
                   //|| (dataModel.StatusId == null || dataModel.StatusId == 0)
                   //|| (dataModel.PriorityId == null || dataModel.PriorityId == 0)
                   )
                {
                    return this.Ok("Mandatory fields are required");
                }

                if ((dataModel.TaskId == null || dataModel.TaskId == 0) || (dataModel.RequestorRoleId == null || dataModel.RequestorRoleId == 0))
                {
                    return this.Ok("Mandatory fields are required");
                }

                if (dataModel.ParentTaskId == null)
                {
                    dataModel.ParentTaskId = 0;
                }

                var response = await this._taskData.InsertTaskRequest(dataModel);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateRequest() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> CreateRequest() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> CreateRequest() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> CreateRequest() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> CreateRequest() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> CreateRequest() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }


        [HttpPost]
        [Route("request/update")]
        public async Task<IActionResult> UpdateRequest(TaskRequestDetailsModel dataModel)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateRequest() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> UpdateRequest() execution started: {DateTime.UtcNow}");

                // CHECK MANDATORY FIELDS IN BACKEND (ALREADY CHECKED IN FRONTEND)
                if (
                    //string.IsNullOrEmpty(dataModel.TaskSubject)
                    //|| string.IsNullOrEmpty(dataModel.TaskDesc)
                    dataModel.CurrentTargetDate == null
                    //|| (dataModel.StatusId == null || dataModel.StatusId == 0)
                    //|| (dataModel.PriorityId == null || dataModel.PriorityId == 0)
                    )
                {
                    return this.Ok("Mandatory fields are required");
                }

                if ((dataModel.TaskId == null || dataModel.TaskId == 0) || (dataModel.RequestorRoleId == null || dataModel.RequestorRoleId == 0) || (dataModel.RequestId == 0))
                {
                    return this.Ok("Mandatory fields are required");
                }

                if (dataModel.ParentTaskId == null)
                {
                    dataModel.ParentTaskId = 0;
                }

                var response = await this._taskData.UpdateTaskRequest(dataModel);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateRequest() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> UpdateRequest() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateRequest() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> UpdateRequest() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> UpdateRequest() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> UpdateRequest() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        [HttpPost]
        [Route("request/action")]
        public async Task<IActionResult> ActionOnTaskRequest(TaskRequestDetailsModel dataModel)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> ActionOnTaskRequest() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> ActionOnTaskRequest() execution started: {DateTime.UtcNow}");

                // CHECK MANDATORY FIELDS IN BACKEND (ALREADY CHECKED IN FRONTEND)
                //if (
                //    //string.IsNullOrEmpty(dataModel.TaskSubject)
                //    //|| string.IsNullOrEmpty(dataModel.TaskDesc)
                //    dataModel.CurrentTargetDate == null
                //    //|| (dataModel.StatusId == null || dataModel.StatusId == 0)
                //    //|| (dataModel.PriorityId == null || dataModel.PriorityId == 0)
                //    )
                //{
                //    return this.Ok("Mandatory fields are required");
                //}

                if ((dataModel.TaskId == null || dataModel.TaskId == 0) || (dataModel.ApproverRoleId == null || dataModel.ApproverRoleId == 0) || (dataModel.RequestId == 0))
                {
                    return this.Ok("Mandatory fields are required");
                }

                if (dataModel.ParentTaskId == null)
                {
                    dataModel.ParentTaskId = 0;
                }

                var response = await this._taskData.ActionOnTaskRequest(dataModel);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ActionOnTaskRequest() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> ActionOnTaskRequest() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ActionOnTaskRequest() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> ActionOnTaskRequest() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> ActionOnTaskRequest() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> ActionOnTaskRequest() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return this.Ok();
            }
        }

        #endregion

    }
}
