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

        public TaskAPIController(
            ILogger<TaskAPIController> logger
            , TelemetryClient telemetryClient
            , ITaskData taskData

            )
            : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient;
            this._taskData = taskData;
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
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskByEmail() execution started: {DateTime.UtcNow}");
                //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution started: {DateTime.UtcNow}");

                var response = await this._taskData.GetAllTask(data);
                if (response != null)
                {
                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskByEmail() execution ended: {DateTime.UtcNow}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> GetTaskByEmail() execution time: {formattedTimeDifference}");
                    //this._logger.LogInformation($"TaskAPIController --> GetTaskById() execution time: {formattedTimeDifference}");
                }
                return this.Ok(response);
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> GetTaskByEmail() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> GetTaskByEmail() execution failed");
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
                    || dataModel.InitialTargetDate == null
                    || (dataModel.TaskId == null || dataModel.TaskId == 0)
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
                    // FILE UPLOAD
                    // SEND NOTIFICATIONS TO STAKEHOLDERS

                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> UpdateTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> UpdateTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> UpdateTask() execution time: {formattedTimeDifference}");
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
                    // FILE UPLOAD
                    // SEND NOTIFICATIONS TO STAKEHOLDERS

                    DateTime endTime = DateTime.UtcNow;
                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignTask() execution ended: {DateTime.UtcNow}");
                    this._logger.LogInformation($"TaskAPIController --> ReassignTask() execution ended: {DateTime.UtcNow}");

                    TimeSpan timeDifference = endTime - startTime;
                    string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                    response.ExecutionTime = formattedTimeDifference;

                    ExceptionLogging.WriteMessageToText($"TaskAPIController --> ReassignTask() execution time: {formattedTimeDifference}");
                    this._logger.LogInformation($"TaskAPIController --> ReassignTask() execution time: {formattedTimeDifference}");
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

        #endregion
    }
}
