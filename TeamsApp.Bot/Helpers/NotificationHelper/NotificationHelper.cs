using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamsApp.Bot.Services.MicrosoftGraph;
using TeamsApp.Bot.Services.Notification;
using TeamsApp.Common.Models;
using TeamsApp.DataAccess.Data;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.Bot.Helpers.NotificationHelper
{
    public class NotificationHelper : INotificationHelper
    {
        private readonly ILogger _logger;

        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;

        private readonly ITaskData _taskData;
        private readonly IAdaptiveCardService _adaptiveCardService;
        private readonly INotificationService _notificationService;

        public NotificationHelper(
            ILogger<NotificationHelper> logger
            , TelemetryClient telemetryClient

            , IConfiguration config
            , ISQLDataAccess db
            , ITaskData taskData
            , IAdaptiveCardService adaptiveCardService
            , INotificationService notificationService
            )
        {
            this._logger = logger;

            this._db = db;
            this._config = config;
            this._taskData = taskData;
            this._adaptiveCardService = adaptiveCardService;
            this._notificationService = notificationService;
        }

        public async Task<bool> ProcesssNotification_CreateTask(List<TaskDetailsCardModel> data)
        {
            try
            {
                if (data != null && data.Any())
                {
                    var sendCardTaskList = new List<Task<NotificationResponseTrnModel>>();

                    foreach (var item in data)
                    {
                        try
                        {
                            var cardAttachment_ActionButton = this._adaptiveCardService.GetCard_CreateTask_ActionButton_PersonalScope(item);
                            if (cardAttachment_ActionButton != null)
                            {
                                sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.AssignerADID, cardAttachment_ActionButton, item.TaskId));

                                if (!string.IsNullOrEmpty(item.CoordinatorADID))
                                {
                                    sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.CoordinatorADID, cardAttachment_ActionButton, item.TaskId));
                                }

                                if (!string.IsNullOrEmpty(item.AssigneeADID))
                                {
                                    sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.AssigneeADID, cardAttachment_ActionButton, item.TaskId));
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            this._logger.LogError(ex, $"NotificationHelper --> GetCard_CreateTask_ActionButton_PersonalScope() execution failed: {JsonConvert.SerializeObject(item, Formatting.Indented)}");
                            ExceptionLogging.SendErrorToText(ex);
                        }

                        try
                        {

                            var cardAttachment = this._adaptiveCardService.GetCard_CreateTask_PersonalScope(item);
                            if (cardAttachment != null)
                            {
                                if (!string.IsNullOrEmpty(item.CollaboratorADID))
                                {
                                    sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.CollaboratorADID, cardAttachment, item.TaskId));
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            this._logger.LogError(ex, $"NotificationHelper --> GetCard_CreateTask_PersonalScope() execution failed: {JsonConvert.SerializeObject(item, Formatting.Indented)}");
                            ExceptionLogging.SendErrorToText(ex);
                        }
                        
                    }

                    if (sendCardTaskList != null && sendCardTaskList.Any())
                    {
                        var sendCardTaskList_Response = await Task.WhenAll(sendCardTaskList);

                        if (sendCardTaskList_Response != null && sendCardTaskList_Response.Any())
                        {
                            var dbInsert_Response = await this._taskData.InsertTaskNotificationResponse_Multiple(sendCardTaskList_Response.ToList(), "CREATE-TASK");

                            if(dbInsert_Response != null && dbInsert_Response.Status == 1) return true;
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"NotificationHelper --> ProcesssNotification_CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }

        public async Task<bool> ProcesssNotification_UpdateTask(List<TaskDetailsCardModel> data)
        {
            try
            {
                if (data != null && data.Any())
                {
                    var sendCardTaskList = new List<Task<NotificationResponseTrnModel>>();

                    foreach (var item in data)
                    {
                        if (item.StatusId == 3) //CLOSED
                        {
                            try
                            {
                                var cardAttachment = this._adaptiveCardService.GetCard_UpdateTask_PersonalScope(item);
                                if (cardAttachment != null)
                                {
                                    sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.AssignerADID, cardAttachment, item.TaskId));

                                    if (!string.IsNullOrEmpty(item.CoordinatorADID))
                                    {
                                        sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.CoordinatorADID, cardAttachment, item.TaskId));
                                    }

                                    if (!string.IsNullOrEmpty(item.AssigneeADID))
                                    {
                                        sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.AssigneeADID, cardAttachment, item.TaskId));
                                    }

                                    if (!string.IsNullOrEmpty(item.CollaboratorADID))
                                    {
                                        sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.CollaboratorADID, cardAttachment, item.TaskId));
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                this._logger.LogError(ex, $"NotificationHelper --> ProcesssNotification_UpdateTask() execution failed: {JsonConvert.SerializeObject(item, Formatting.Indented)}");
                                ExceptionLogging.SendErrorToText(ex);
                            }
                        }
                        else
                        {
                            try
                            {
                                var cardAttachment_ActionButton = this._adaptiveCardService.GetCard_UpdateTask_ActionButton_PersonalScope(item);
                                if (cardAttachment_ActionButton != null)
                                {
                                    sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.AssignerADID, cardAttachment_ActionButton, item.TaskId));

                                    if (!string.IsNullOrEmpty(item.CoordinatorADID))
                                    {
                                        sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.CoordinatorADID, cardAttachment_ActionButton, item.TaskId));
                                    }

                                    if (!string.IsNullOrEmpty(item.AssigneeADID))
                                    {
                                        sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.AssigneeADID, cardAttachment_ActionButton, item.TaskId));
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                this._logger.LogError(ex, $"NotificationHelper --> ProcesssNotification_UpdateTask() execution failed: {JsonConvert.SerializeObject(item, Formatting.Indented)}");
                                ExceptionLogging.SendErrorToText(ex);
                            }

                            try
                            {

                                var cardAttachment = this._adaptiveCardService.GetCard_UpdateTask_PersonalScope(item);
                                if (cardAttachment != null)
                                {
                                    if (!string.IsNullOrEmpty(item.CollaboratorADID))
                                    {
                                        sendCardTaskList.Add(_notificationService.SendCard_PersonalScope(item.CollaboratorADID, cardAttachment, item.TaskId));
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                this._logger.LogError(ex, $"NotificationHelper --> ProcesssNotification_UpdateTask() execution failed: {JsonConvert.SerializeObject(item, Formatting.Indented)}");
                                ExceptionLogging.SendErrorToText(ex);
                            }
                        }
                    }

                    if (sendCardTaskList != null && sendCardTaskList.Any())
                    {
                        var sendCardTaskList_Response = await Task.WhenAll(sendCardTaskList);

                        if (sendCardTaskList_Response != null && sendCardTaskList_Response.Any())
                        {
                            var dbInsert_Response = await this._taskData.InsertTaskNotificationResponse_Multiple(sendCardTaskList_Response.ToList(), "UPDATE-TASK");

                            if (dbInsert_Response != null && dbInsert_Response.Status == 1)
                            {
                                // DELETE PREVIOUS CARDS

                                if (!string.IsNullOrEmpty(dbInsert_Response.ReferenceNo))
                                {
                                    try
                                    {
                                        var notificationList = JsonConvert.DeserializeObject<List<NotificationResponseTrnModel>>(dbInsert_Response.ReferenceNo);
                                        if (notificationList != null && notificationList.Any())
                                        {
                                            var deleteCardTaskList = new List<Task<bool>>();
                                            foreach (var notification in notificationList)
                                            {
                                                deleteCardTaskList.Add(_notificationService.DeleteCard_PersonalScope(notification));
                                            }

                                            if (deleteCardTaskList != null && deleteCardTaskList.Any())
                                            {
                                                var deleteCardTaskList_Response = await Task.WhenAll(deleteCardTaskList);
                                                if (deleteCardTaskList_Response != null && deleteCardTaskList_Response.Any())
                                                {
                                                    return true;
                                                }
                                            }
                                        }
                                    }
                                    catch (Exception ex) 
                                    {
                                        this._logger.LogError(ex, $"NotificationHelper --> ProcesssNotification_UpdateTask() execution failed: {JsonConvert.SerializeObject(dbInsert_Response.ReferenceNo, Formatting.Indented)}");
                                        ExceptionLogging.SendErrorToText(ex);
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"NotificationHelper --> ProcesssNotification_UpdateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }
    }
}
