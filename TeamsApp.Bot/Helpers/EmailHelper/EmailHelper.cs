using Microsoft.ApplicationInsights;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamsApp.Bot.Services.Email;
using TeamsApp.Bot.Services.MicrosoftGraph;
using TeamsApp.Bot.Services.Notification;
using TeamsApp.Common.Models;
using TeamsApp.DataAccess.Data;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.Bot.Helpers.EmailHelper
{
    public class EmailHelper : IEmailHelper
    {
        private readonly ILogger _logger;

        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;

        private readonly ITaskData _taskData;
        private readonly IEmailService _emailService;

        public EmailHelper(
            ILogger<EmailHelper> logger
            , TelemetryClient telemetryClient

            , IConfiguration config
            , ISQLDataAccess db
            , ITaskData taskData
            , IEmailService emailService
            )
        {
            this._logger = logger;

            this._db = db;
            this._config = config;
            this._taskData = taskData;
            this._emailService = emailService;
        }

        public async Task<bool> ProcesssEmail_CreateTask(List<TaskEmailNotificationModel> data)
        {
            try
            {
                if (data != null && data.Any())
                {
                    var emailTaskList = new List<Task<TaskEmailNotificationModel>>();

                    foreach (var item in data)
                    {
                        try
                        {
                            if (!string.IsNullOrEmpty(item.EmailSubject) 
                                && !string.IsNullOrEmpty(item.EmailBody)
                                && !string.IsNullOrEmpty(item.ToRecipient)
                                )
                            {
                                emailTaskList.Add(this._emailService.SendEmail_WithoutMessageId(item));
                            }
                        }
                        catch (Exception ex)
                        {
                            this._logger.LogError(ex, $"EmailHelper --> ProcesssEmail_CreateTask() execution failed: {JsonConvert.SerializeObject(item, Formatting.Indented)}");
                            ExceptionLogging.SendErrorToText(ex);
                        }
                    }

                    if (emailTaskList != null && emailTaskList.Any())
                    {
                        var emailTaskList_Response = await Task.WhenAll(emailTaskList);

                        if (emailTaskList_Response != null && emailTaskList_Response.Any())
                        {
                            var dbInsert_Response = await this._taskData.InsertEmailResponse_Multiple(emailTaskList_Response.ToList());

                            if (dbInsert_Response != null && dbInsert_Response.Status == 1) return true;
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"EmailHelper --> ProcesssEmail_CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }
    }
}
