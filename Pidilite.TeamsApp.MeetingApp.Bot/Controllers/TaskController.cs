using AdaptiveCards;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Pidilite.TeamsApp.MeetingApp.Bot.Helper;
using Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Tasks;
using Pidilite.TeamsApp.MeetingApp.Bot.Helpers.TokenHelper;
using Pidilite.TeamsApp.MeetingApp.Bot.MeetingApp;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.AzureBlob;
using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.Common.Models.Enum;
using Pidilite.TeamsApp.MeetingApp.DataAccess.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Controllers
{
    [Route("api/v1.0/task")]
    [ApiController]
    [Authorize]
    public class TaskController : BaseController
    {
        /// <summary>
        /// Logs errors and information.
        /// </summary>
        private readonly ILogger _logger;

        /// <summary>
        /// Telemetry client to log event and errors.
        /// </summary>
        ///
        private readonly TelemetryClient _telemetryClient;

        private readonly ITaskDetailsData _taskDetailsData;
        private readonly IAzureBlobService _azureBlobService;
        private readonly INotificationHelper _notificationHelper;
        private readonly IAdaptiveCardService _adaptiveCardService;
        private readonly IConversationData _conversationData;
        private readonly IOptions<BotSettings> botOptions;
        private readonly ITaskHelper _taskHelper;
        private readonly ITokenHelper _tokenHelper;
        public TaskController(
            ILogger<TaskController> logger,
            TelemetryClient telemetryClient,
            ITaskDetailsData taskDetailsData,
            IAzureBlobService azureBlobService,
            INotificationHelper notificationHelper,
            IAdaptiveCardService adaptiveCardService,
            IConversationData conversationData,
            IOptions<BotSettings> botOptions,
            ITaskHelper taskHelper,
            ITokenHelper tokenHelper
            ) : base(telemetryClient)
        {
            this._logger = logger;
            this._telemetryClient = telemetryClient ?? throw new ArgumentNullException(nameof(telemetryClient));
            this._taskDetailsData = taskDetailsData ?? throw new ArgumentNullException(nameof(taskDetailsData));
            this._azureBlobService = azureBlobService ?? throw new ArgumentNullException(nameof(azureBlobService));
            this._notificationHelper = notificationHelper ?? throw new ArgumentNullException(nameof(notificationHelper));
            this._adaptiveCardService = adaptiveCardService ?? throw new ArgumentNullException(nameof(adaptiveCardService));
            this._conversationData = conversationData ?? throw new ArgumentNullException(nameof(conversationData));
            this.botOptions = botOptions ?? throw new ArgumentNullException(nameof(botOptions));
            this._taskHelper = taskHelper ?? throw new ArgumentNullException(nameof(taskHelper));
            this._tokenHelper = tokenHelper ?? throw new ArgumentNullException(nameof(tokenHelper));
        }

        #region Task
        [HttpGet]
        [Route("GetTaskDetailsById")]
        public async Task<IActionResult> GetTaskDetailsById([FromQuery] int id)
        {
            try
            {
                var results = await _taskDetailsData.Get(id);
                if (results == null)
                {
                    return this.NotFound();
                }
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching task details.");
                return this.Problem(ex.Message);
            }
        }

        [HttpGet]
        [Route("CheckTaskByMeetingId")]
        public async Task<IActionResult> CheckTaskByMeetingId([FromQuery] long MeetingId, [FromQuery]  long ParentMeetingId)
        {
            try
            {
                var results = await _taskDetailsData.CheckTaskByMeetingId(MeetingId, ParentMeetingId);
                if (results == null)
                {
                    return this.NotFound();
                }
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Error occurred while fetching task details by using meeting id : {MeetingId} & parent-meeting id : {ParentMeetingId}");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetAllTaskDetails")]
        public async Task<IActionResult> GetAllTaskDetails(TaskDetailsModel data)
        {
            try
            {
                var results = await _taskDetailsData.GetAll(data);
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching task details.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetAllPrevTaskDetails")]
        public async Task<IActionResult> GetAllPrevTaskDetails(TaskDetailsModel data)
        {
            try
            {
                var results = await _taskDetailsData.GetAllPrev(data);
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching task details.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("CreateTask")]
        public async Task<IActionResult> CreateTask(IFormCollection formdata)
        {
            try
            {
                TaskDetailsModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskDetailsModel>(JObject.Parse(data).ToString());

                }
                var insertResults = await _taskDetailsData.Insert(dataModel);
                if (insertResults == null)
                {
                    return this.NotFound();
                }
                if (formdata.Files.Count > 0)
                {
                    try
                    {
                        var resultsDoc = await _azureBlobService.UploadTaskFiles(formdata.Files, (insertResults.GuidReferenceNo).ToString());
                        List<TaskFileUploadModel> returnList = null;
                        if (resultsDoc != null && resultsDoc.Count > 0)
                        {
                            returnList = new List<TaskFileUploadModel>();
                            for (var i = 0; i < resultsDoc.Count; i++)
                            {
                                var fileUploadModel = new TaskFileUploadModel();
                                fileUploadModel.TaskId = Convert.ToInt32(insertResults.Id);
                                fileUploadModel.MeetingId = (long)dataModel.MeetingId;
                                fileUploadModel.ContentType = formdata.Files[i].ContentType;
                                fileUploadModel.FileUrl = resultsDoc[i].ToString();
                                fileUploadModel.FileName = formdata.Files[i].FileName;
                                returnList.Add(fileUploadModel);
                            }
                            var FileUploadResults = await _taskDetailsData.FileUpload(returnList, (Guid)insertResults.GuidReferenceNo);
                            //if (FileUploadResults == null)
                            //{
                            //    return this.NotFound();
                            //}
                        }
                    }
                    catch (Exception ex)
                    {
                        this.RecordEvent("Unable to upload or save task attachments - UploadTaskFiles/FileUpload methods.", RequestType.Failed);
                        this._logger.LogError(ex, "Error occurred while saving task attachments.");
                    }
                }
                //Send Adaptive Card notification
                if (dataModel.TaskParticipant != null && dataModel.TaskParticipant.Any())
                {
                    if (insertResults.GuidReferenceNo != null)
                    {
                        dataModel.TaskReferenceNo = (Guid)insertResults.GuidReferenceNo;
                        try
                        {
                            await sendTaskNotification(dataModel);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Failed to send task notification - sendTaskNotification method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via adaptive card.");
                        }
                        try
                        {
                            await sendTaskEmail(dataModel);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Failed to send task notification via email - sendTaskEmail method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via email.");
                        }
                    }
                }
                return this.Ok(insertResults);
            }
            catch (Exception ex)
            {
                this.RecordEvent("Insert Task - The HTTP Post call to insert task has failed.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while insert task.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateTask")]
        public async Task<IActionResult> UpdateTask(IFormCollection formdata)
        {
            try
            {
                TaskDetailsModel dataModel = null;
                var strKey = formdata.Keys.Where(x => x == "taskData").FirstOrDefault();
                if (strKey != null)
                {
                    var data = formdata[strKey];
                    dataModel = JsonConvert.DeserializeObject<TaskDetailsModel>(JObject.Parse(data).ToString());

                }
                var updateResults = await _taskDetailsData.Update(dataModel);
                if (updateResults == null)
                {
                    return this.NotFound();
                }
                if (formdata.Files.Count > 0)
                {
                    try
                    {
                        var resultsDoc = await _azureBlobService.UploadTaskFiles(formdata.Files, (updateResults.GuidReferenceNo).ToString());
                        List<TaskFileUploadModel> returnList = null;
                        if (resultsDoc != null && resultsDoc.Count > 0)
                        {
                            returnList = new List<TaskFileUploadModel>();
                            for (var i = 0; i < resultsDoc.Count; i++)
                            {
                                var fileUploadModel = new TaskFileUploadModel();
                                fileUploadModel.TaskId = Convert.ToInt32(updateResults.Id);
                                fileUploadModel.MeetingId = (long)dataModel.MeetingId;
                                fileUploadModel.ContentType = formdata.Files[i].ContentType;
                                fileUploadModel.FileUrl = resultsDoc[i].ToString();
                                fileUploadModel.FileName = formdata.Files[i].FileName;
                                returnList.Add(fileUploadModel);
                            }
                            var FileUploadResults = await _taskDetailsData.FileUploadUpdate(returnList);
                            //if (FileUploadResults == null)
                            //{
                            //    return this.NotFound();
                            //}
                        }
                    }
                    catch (Exception ex)
                    {
                        this.RecordEvent("Unable to upload or save task attachments - UploadTaskFiles/FileUpload methods.", RequestType.Failed);
                        this._logger.LogError(ex, "Error occurred while saving task attachments.");
                    }
                }
                if (dataModel.TaskDetailsType.ToLower() == "assignedbyme")
                {
                    // Send adaptive card with updated details
                    var updatedTaskDetails = await _taskDetailsData.Get(Convert.ToInt32(dataModel.TaskId));
                    if (updatedTaskDetails.AssignedTo != null)
                    {
                        try
                        {
                            await this.sendUpdatedTaskNotification(updatedTaskDetails);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Unable to send updated task notification - Failed executing sendUpdatedTaskNotification method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending updated task notification via adaptive card.");
                        }
                        try
                        {
                            await sendUpdatedTaskEmail(updatedTaskDetails);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Unable to send task notification via email - Failed executing sendTaskEmail method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via email.");
                        }
                    }
                }
                return this.Ok(updateResults);
            }
            catch (Exception ex)
            {
                this.RecordEvent("Update Task - The HTTP Post call to update task has failed.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while updating task.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateTaskSortOrder")]
        public async Task<IActionResult> UpdateTaskSortOrder(IEnumerable<TaskDetailsModel> dataModelList)
        {
            try
            {
                var updateResults = await _taskDetailsData.UpdateTaskSortOrder(dataModelList);
                if (updateResults == null)
                {
                    return this.NotFound();
                }
                return this.Ok(updateResults);
            }
            catch (Exception ex)
            {
                this.RecordEvent("Update Task Sort Order- The HTTP Post call to update task sort order.", RequestType.Failed);
                this._logger.LogError(ex, "Error occurred while updating task sort order.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("ReassignTask")]
        public async Task<IActionResult> ReassignTask(TaskDetailsModel data)
        {
            IEnumerable<TaskDetailsModel> taskDetailsBeforeReassignList = null;
            try
            {
                if (data.TaskId == null || data.TaskId == 0)
                {
                    taskDetailsBeforeReassignList = await _taskDetailsData.GetByUserADID(data.OldAssignedToADID);
                    await Task.Delay(5000);
                }
                var insertResult = await _taskDetailsData.ReassignTask(data);
                //Send Adaptive Card notification
                if (insertResult.Status == 1)
                {
                    if (taskDetailsBeforeReassignList != null && taskDetailsBeforeReassignList.Any())
                    {
                        try
                        {
                            await sendReassignTaskNotification(taskDetailsBeforeReassignList);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Failed to send re-assign task notification - sendReassignTaskNotification method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via adaptive card.");
                        }
                        try
                        {
                            await sendReassignTaskEmail(taskDetailsBeforeReassignList);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Failed to send re-assign task notification via email - sendReassignTaskEmail method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via email.");
                        }
                    }
                    else
                    {
                        try
                        {
                            await sendTaskNotification(data);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Failed to send task notification - sendTaskNotification method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via adaptive card.");
                        }
                        try
                        {
                            await sendTaskEmail(data);
                        }
                        catch (Exception ex)
                        {
                            this.RecordEvent("Failed to send task notification via email - sendTaskEmail method.", RequestType.Failed);
                            this._logger.LogError(ex, "Error occurred while sending task notification via email.");
                        }
                    }
                }
                return this.Ok(insertResult);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while reassigning task details.");
                return this.Problem(ex.Message);
            }
        }

        #region TASK DETAILS FOR CI MEETINGS

        [HttpGet]
        [Route("GetAllTaskDetailsForCIMeetings")]
        public async Task<IActionResult> GetAllTaskDetailsForCIMeetings(string Id)
        {
            try
            {
                if (Id != "")
                {
                    var data = new TaskDetailsModelForCIMeetings();
                    data.CIUniqueID = Id;

                    var results = await _taskDetailsData.GetAllTaskDetailsForCIMeetings(data);
                    return this.Ok(results);
                }
                else
                {
                    return this.Ok("Id cannot be blank or Zero");
                }                
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching task details for ci meetings.");
                return this.Problem(ex.Message);
            }
        }

        #endregion

        #region TASK DETAILS FOR KI TASKS

        [HttpPost]
        [Route("GetAllKITaskDetails")]
        public async Task<IActionResult> GetAllKITaskDetailsDivisionWise(TaskDetailsModel data)
        {
            try
            {
                var results = await _taskDetailsData.GetAllKITask(data);
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while fetching all KI task details - divison wise.");
                return this.Problem(ex.Message);
            }
        }

        #endregion

        #endregion

        #region TaskChecklist
        [HttpPost]
        [Route("CreateChecklist")]
        public async Task<IActionResult> CreateChecklist(TaskChecklistModel data)
        {
            try
            {
                var results = await _taskDetailsData.InsertChecklist(data);
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while creating task checklist.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateChecklist")]
        public async Task<IActionResult> UpdateChecklist(TaskChecklistModel data)
        {
            try
            {
                var results = await _taskDetailsData.UpdateChecklist(data);
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while updating task checklist.");
                return this.Problem(ex.Message);
            }
        }

        [HttpPost]
        [Route("DeleteChecklist")]
        public async Task<IActionResult> DeleteChecklist(long ChecklistId, long TaskId)
        {
            try
            {
                var results = await _taskDetailsData.DeleteChecklist(ChecklistId, TaskId);
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, "Error occurred while deleting task checklist.");
                return this.Problem(ex.Message);
            }
        }
        #endregion

        #region SendAdaptiveCardNotification

        private async Task<Object> sendTaskNotification(TaskDetailsModel dataModel)
        {

            List<TaskNotificationResponseModel> responseModelList = new List<TaskNotificationResponseModel>();
            //Get Task Details
            if (dataModel.TaskId != null)
            {
                var taskResults = await _taskDetailsData.Get(Convert.ToInt32(dataModel.TaskId));
                if (taskResults != null)
                {
                    dataModel.MeetingTitle = taskResults.MeetingTitle;
                    //Get adaptive card
                    var cardAttachment = this._adaptiveCardService.GetCardOnTaskCreationInPersonalScope(taskResults);
                    if (cardAttachment != null)
                    {
                        var notificationResults = await this._notificationHelper.SendNewNotificationInPersonalScopeAsync(taskResults.AssignedToADID, cardAttachment);
                        var responseModel = new TaskNotificationResponseModel();
                        responseModel.ReplyToId = notificationResults.ReplyToId;
                        responseModel.ActivityId = notificationResults.ActivityId;
                        responseModel.ConversationId = notificationResults.ConversationId;
                        responseModel.ServiceUrl = notificationResults.ServiceUrl;
                        responseModel.UserName = notificationResults.UserName;
                        responseModel.UserADID = notificationResults.UserADID;
                        responseModel.TaskId = (long)dataModel.TaskId;
                        responseModel.MeetingId = (long)dataModel.MeetingId;
                        responseModel.TimeZone = dataModel.TimeZone;
                        responseModel.Status = TaskNotificationType.Reassign.ToString();
                        responseModelList.Add(responseModel);
                    }
                    if (responseModelList.Any())
                    {
                        var taskResponseResult = await _taskDetailsData.GetResponse((long)dataModel.TaskId);
                        if (taskResponseResult != null)
                        {
                            var reassignCardAttachment = this._adaptiveCardService.GetCardOnTaskReassignInPersonalScope(taskResults);
                            if (reassignCardAttachment != null)
                            {
                                var updateAdaptiveCardResult = await _taskHelper.UpdateAdaptiveCardInChat(taskResponseResult, reassignCardAttachment);
                                if (updateAdaptiveCardResult)
                                {
                                    var updateResponseResult = await _taskDetailsData.UpdateResponse((long)dataModel.TaskId);
                                    if (updateResponseResult == null)
                                    {
                                        return this.NotFound();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                var taskResults = await _taskDetailsData.GetByReferenceNo(dataModel.TaskReferenceNo);
                if (taskResults != null)
                {
                    foreach (var item in taskResults)
                    {
                        dataModel.MeetingTitle = item.MeetingTitle;

                        //Get adaptive card
                        var cardAttachment = this._adaptiveCardService.GetCardOnTaskCreationInPersonalScope(item);
                        if (cardAttachment != null)
                        {
                            // send adaptive card
                            var notificationResults = await this._notificationHelper.SendNewNotificationInPersonalScopeAsync(item.AssignedToADID, cardAttachment);
                            var responseModel = new TaskNotificationResponseModel();
                            responseModel.ReplyToId = notificationResults.ReplyToId;
                            responseModel.ActivityId = notificationResults.ActivityId;
                            responseModel.ConversationId = notificationResults.ConversationId;
                            responseModel.ServiceUrl = notificationResults.ServiceUrl;
                            responseModel.UserName = notificationResults.UserName;
                            responseModel.UserADID = notificationResults.UserADID;
                            responseModel.TaskId = (long)item.TaskId;
                            responseModel.MeetingId = (long)item.MeetingId;
                            responseModel.TimeZone = item.TimeZone;
                            responseModel.Status = TaskNotificationType.New.ToString();
                            responseModelList.Add(responseModel);
                        }
                    }
                }
            }
            var insertResult = await _taskDetailsData.InsertResponse(responseModelList);
            if (insertResult == null)
            {
                return this.NotFound();
            }
            return this.Ok(insertResult);
        }

        private async Task<Object> sendTaskEmail(TaskDetailsModel dataModel)
        {
            if (dataModel.TaskId != null)
            {
                var taskResults = await _taskDetailsData.Get(Convert.ToInt32(dataModel.TaskId));
                if (taskResults != null)
                {
                    var emailResult = await _taskHelper.SendReassignTaskNotificationViaEmailAsync(taskResults);
                    if (emailResult)
                    {
                        return this.Ok();
                    }
                }
            }
            else
            {
                var taskResults = await _taskDetailsData.GetByReferenceNo(dataModel.TaskReferenceNo);
                if (taskResults != null)
                {
                    var emailResult = await _taskHelper.SendNewTaskNotificationViaEmailAsync(taskResults);
                    if (emailResult)
                    {
                        return this.Ok();
                    }
                }
            }
            return this.NotFound();
        }

        private async Task<Object> sendUpdatedTaskEmail(TaskDetailsModel taskDetails)
        {
            if (taskDetails.AssignedTo != null)
            {
                var emailResult = await _taskHelper.SendUpdatedTaskNotificationViaEmailAsync(taskDetails);
                if (emailResult)
                {
                    return this.Ok();
                }
            }
            return this.NotFound();
        }

        private async Task<Object> sendReassignTaskNotification(IEnumerable<TaskDetailsModel> taskDetailsList)
        {
            var taskNotificationResponseList = new List<TaskNotificationResponseModel>();

            // Send new adaptive cards
            foreach (var task in taskDetailsList)
            {
                var newAssignedTaskDetails = await _taskDetailsData.Get(Convert.ToInt32(task.TaskId));
                if (newAssignedTaskDetails.TaskId > 0)
                {
                    //Get new adaptive card
                    var cardAttachment = this._adaptiveCardService.GetCardOnTaskCreationInPersonalScope(newAssignedTaskDetails);
                    if (cardAttachment != null)
                    {
                        // Send new adaptive card & add each response to a list
                        var notificationResults = await this._notificationHelper.SendNewNotificationInPersonalScopeAsync(newAssignedTaskDetails.AssignedToADID, cardAttachment);
                        var response = new TaskNotificationResponseModel();
                        response.ReplyToId = notificationResults.ReplyToId;
                        response.ActivityId = notificationResults.ActivityId;
                        response.ConversationId = notificationResults.ConversationId;
                        response.ServiceUrl = notificationResults.ServiceUrl;
                        response.UserName = notificationResults.UserName;
                        response.UserADID = notificationResults.UserADID;
                        response.TaskId = (long)task.TaskId;
                        response.MeetingId = (long)task.MeetingId;
                        response.TimeZone = task.TimeZone;
                        response.Status = TaskNotificationType.New.ToString();
                        taskNotificationResponseList.Add(response);
                    }
                }
            }
            // Update existing adaptive card
            foreach (var task in taskDetailsList)
            {
                var taskResponseResult = await _taskDetailsData.GetResponse((long)task.TaskId);
                if (taskResponseResult.TaskId > 0)
                {
                    var newAssignedTaskDetails = await _taskDetailsData.Get(Convert.ToInt32(task.TaskId));
                    if (newAssignedTaskDetails.TaskId > 0)
                    {
                        // Get adaptive card
                        var reassignCardAttachment = this._adaptiveCardService.GetCardOnTaskReassignInPersonalScope(newAssignedTaskDetails);
                        if (reassignCardAttachment != null)
                        {
                            var updateAdaptiveCardResult = await _taskHelper.UpdateAdaptiveCardInChat(taskResponseResult, reassignCardAttachment);
                            if (updateAdaptiveCardResult)
                            {
                                var updateResponseResult = await _taskDetailsData.UpdateResponse((long)task.TaskId);
                                if (updateResponseResult == null)
                                {
                                    return this.NotFound();
                                }
                            }
                        }
                    }
                }
            }
            var insertResult = await _taskDetailsData.InsertResponse(taskNotificationResponseList);
            if (insertResult == null)
            {
                return this.NotFound();
            }
            return this.Ok(insertResult);
        }

        private async Task<Object> sendReassignTaskEmail(IEnumerable<TaskDetailsModel> taskDetailsList)
        {
            if (taskDetailsList != null && taskDetailsList.Any())
            {
                var taskList = new List<TaskDetailsModel>();
                foreach (var eachTask in taskDetailsList)
                {
                    var taskResults = await _taskDetailsData.Get(Convert.ToInt32(eachTask.TaskId));
                    var task = new TaskDetailsModel();
                    task.TaskContext = taskResults.TaskContext;
                    task.TaskClosureDate = taskResults.TaskClosureDate;
                    task.TaskPriority = taskResults.TaskPriority;
                    task.MeetingTitle = taskResults.MeetingTitle;
                    task.CreatedBy = taskResults.CreatedBy;
                    task.AssignedTo = taskResults.AssignedTo;
                    task.AssignedToEmail = taskResults.AssignedToEmail;
                    task.ActionTakenByADID = taskResults.ActionTakenByADID;
                    taskList.Add(task);
                }
                if (taskList != null && taskList.Any())
                {
                    var emailResult = await _taskHelper.SendReassignAllTaskNotificationViaEmailAsync(taskList);
                    if (emailResult)
                    {
                        return this.Ok();
                    }
                }
            }
            return this.NotFound();
        }

        private async Task<Object> sendUpdatedTaskNotification(TaskDetailsModel taskDetails)
        {
            var taskNotificationResponseList = new List<TaskNotificationResponseModel>();
            if (taskDetails != null)
            {
                //Get new adaptive card
                var cardAttachment = this._adaptiveCardService.GetCardOnTaskCreationInPersonalScope(taskDetails);
                if (cardAttachment != null)
                {
                    // Send new adaptive card & add each response to a list
                    var notificationResults = await this._notificationHelper.SendNewNotificationInPersonalScopeAsync(taskDetails.AssignedToADID, cardAttachment);
                    var response = new TaskNotificationResponseModel();
                    response.ReplyToId = notificationResults.ReplyToId;
                    response.ActivityId = notificationResults.ActivityId;
                    response.ConversationId = notificationResults.ConversationId;
                    response.ServiceUrl = notificationResults.ServiceUrl;
                    response.UserName = notificationResults.UserName;
                    response.UserADID = notificationResults.UserADID;
                    response.TaskId = (long)taskDetails.TaskId;
                    response.MeetingId = (long)taskDetails.MeetingId;
                    response.TimeZone = taskDetails.TimeZone;
                    response.Status = TaskNotificationType.Updated.ToString();
                    taskNotificationResponseList.Add(response);

                    if (taskNotificationResponseList != null && taskNotificationResponseList.Any())
                    {
                        var taskResponseResult = await _taskDetailsData.GetResponse((long)taskDetails.TaskId);
                        if (taskResponseResult.TaskId > 0)
                        {
                            // Get updated adaptive card
                            var updatedCardAttachment = this._adaptiveCardService.GetCardOnUpdatedTaskInPersonalScope(taskDetails);
                            if (updatedCardAttachment != null)
                            {
                                var updateAdaptiveCardResult = await _taskHelper.UpdateAdaptiveCardInChat(taskResponseResult, updatedCardAttachment);
                                if (updateAdaptiveCardResult)
                                {
                                    var updateResponseResult = await _taskDetailsData.UpdateResponse((long)taskDetails.TaskId);
                                    if (updateResponseResult == null)
                                    {
                                        return this.NotFound();
                                    }
                                }
                            }
                        }
                    }
                    var insertResult = await _taskDetailsData.InsertResponse(taskNotificationResponseList);
                    if (insertResult == null)
                    {
                        return this.NotFound();
                    }
                    return this.Ok(insertResult);
                }

            }
            return this.NotFound();
        }

        private async Task<string> getAPIAuthToken(string userADID)
        {
            var token = "";
            Guid userId;
            if (Guid.TryParse(userADID, out userId))
            {
                var conversation = await _conversationData.GetConversationByUserId(userId);
                if (conversation != null)
                {
                    token = this._tokenHelper.GenerateAPIAuthToken(applicationBasePath: conversation.ServiceUrl, fromId: userADID, jwtExpiryMinutes: 60);
                }
            }
            return token;
        }
        #endregion
    }
}
