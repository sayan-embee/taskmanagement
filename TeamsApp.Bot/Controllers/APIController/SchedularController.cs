using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Threading.Tasks;
using System;
using TeamsApp.Bot.Helpers.EmailHelper;
using TeamsApp.Bot.Helpers.FileHelper;
using TeamsApp.Bot.Helpers.NotificationHelper;
using TeamsApp.Bot.Models;
using TeamsApp.DataAccess.Data;
using TeamsApp.Common.Models;
using System.Linq;
using TeamsApp.Bot.Helpers;

namespace TeamsApp.Bot.Controllers.APIController
{
    [Route("api/v1.0/notification")]
    [ApiController]
    //[Authorize]
    public class SchedularController : BaseController
    {
        private readonly ILogger _logger;
        private readonly TelemetryClient _telemetryClient;

        private readonly ITaskData _taskData;
        private readonly INotificationHelper _notificationHelper;
        private readonly IEmailHelper _emailHelper;
        private readonly IFileHelper _fileHelper;

        public SchedularController(
            ILogger<SchedularController> logger
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

        #region NOTIFICATION

        [HttpGet]
        [Route("priority")]
        public async Task<IActionResult> SendPriorityNotification()
        {
            DateTime? fromDate = null;
            DateTime? toDate = null;
            var returnModel = new SchedularLogModel();
            returnModel.RunId = 0;

            try
            {
                var result = await this._taskData.GetSchedularLog(fromDate, toDate, "PRIORITY-NOTIFICATION", "CHECK");
                if (result != null && result.Any() && result.FirstOrDefault().IsSuccess == true)
                {
                    returnModel.IsSuccess = false;
                    returnModel.ExecutionTimeInSecs = 0;
                    returnModel.TriggerCode = "PRIORITY-NOTIFICATION";
                    returnModel.Message = "SCHEDULAR APP HAS ALREADY RUN TODAY";

                    return this.Ok(returnModel);
                }
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> InsertSchedularLog() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> InsertSchedularLog() execution failed");
                ExceptionLogging.SendErrorToText(ex);
            }

            try
            {
                DateTime startTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> SendPriorityNotification() execution started: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> SendPriorityNotification() execution started: {DateTime.UtcNow}");


                var resultList = await _taskData.GetTaskForPriorityNotification(fromDate, toDate);
                if (resultList != null && resultList.Any())
                {
                    var result = await this._notificationHelper.ProcesssPriorityNotification(resultList);

                    DateTime local_endTime = DateTime.UtcNow;
                    TimeSpan local_timeDifference = local_endTime - startTime;
                    double seconds = local_timeDifference.TotalSeconds;

                    if (result)
                    {
                        string taskIdList = string.Empty;
                        StringBuilder taskIds = new StringBuilder();

                        foreach (var r in resultList)
                        {
                            taskIds.Append(r.TaskId);
                            taskIds.Append(",");
                        }

                        if (taskIds.Length > 0)
                        {
                            taskIds.Length--; // Remove the last character, which is the trailing comma
                        }

                        taskIdList = taskIds.ToString();

                        returnModel.IsSuccess = true;
                        returnModel.ExecutionTimeInSecs = seconds;
                        returnModel.TriggerCode = "PRIORITY-NOTIFICATION";
                        returnModel.ReferenceInfo = taskIdList;
                        returnModel.Message = "SUCCESS";
                    }
                    else
                    {
                        returnModel.IsSuccess = true;
                        returnModel.ExecutionTimeInSecs = seconds;
                        returnModel.TriggerCode = "PRIORITY-NOTIFICATION";
                        returnModel.Message = "INTERRUPTED";
                    }
                }
                else
                {
                    returnModel.IsSuccess = true;
                    returnModel.ExecutionTimeInSecs = 0;
                    returnModel.TriggerCode = "PRIORITY-NOTIFICATION";
                    returnModel.Message = "NOT-FOUND";
                }


                DateTime endTime = DateTime.UtcNow;
                ExceptionLogging.WriteMessageToText($"TaskAPIController --> SendPriorityNotification() execution ended: {DateTime.UtcNow}");
                this._logger.LogInformation($"TaskAPIController --> SendPriorityNotification() execution ended: {DateTime.UtcNow}");

                TimeSpan timeDifference = endTime - startTime;
                string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                ExceptionLogging.WriteMessageToText($"TaskAPIController --> SendPriorityNotification() execution time: {formattedTimeDifference}");
                this._logger.LogInformation($"TaskAPIController --> SendPriorityNotification() execution time: {formattedTimeDifference}");

            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> SendPriorityNotification() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> SendPriorityNotification() execution failed");
                ExceptionLogging.SendErrorToText(ex);

                returnModel.IsSuccess = false;
                returnModel.ExecutionTimeInSecs = 0;
                returnModel.TriggerCode = "PRIORITY-NOTIFICATION";
                returnModel.ReferenceInfo = "ERROR: " + ex.ToString();
                returnModel.Message = "FAILED";
            }

            try
            {
                var result = await this._taskData.InsertSchedularLog(returnModel);
                if (result != null && result.Status == 1)
                {
                    if (!string.IsNullOrEmpty(result.Id))
                    {
                        returnModel.RunId = int.Parse(result.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                this.RecordEvent("TaskAPIController --> InsertSchedularLog() - Failed to execute.", RequestType.Failed);
                this._logger.LogError(ex, $"TaskAPIController --> InsertSchedularLog() execution failed");
                ExceptionLogging.SendErrorToText(ex);
            }

            return this.Ok(returnModel);
        }

        #endregion
    }
}
