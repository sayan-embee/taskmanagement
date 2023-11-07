using Azure;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using TeamsApp.Bot.Services.AzureBlob;
using TeamsApp.Bot.Services.MicrosoftGraph;
using TeamsApp.Bot.Services.Notification;
using TeamsApp.Common.Models;
using TeamsApp.DataAccess.Data;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.Bot.Helpers.FileHelper
{
    public class FileHelper : IFileHelper
    {
        private readonly ILogger _logger;

        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;

        private readonly ITaskData _taskData;
        private readonly IAzureBlobService _azureBlobService;

        public FileHelper(
            ILogger<FileHelper> logger
            , TelemetryClient telemetryClient

            , IConfiguration config
            , ISQLDataAccess db
            , ITaskData taskData
            , IAzureBlobService azureBlobService
            )
        {
            this._logger = logger;

            this._db = db;
            this._config = config;
            this._taskData = taskData;
            this._azureBlobService = azureBlobService;
        }

        public async Task<bool> ProcesssFile_CreateTask(TaskDetailsTrnModel data, IFormFileCollection files, string TaskIdList, Guid TransactionId)
        {
            try
            {
                if (data != null 
                    && (!string.IsNullOrEmpty(TaskIdList)) 
                    && files != null 
                    && files.Count > 0
                    )
                {
                    var idList = TaskIdList.Split(",");

                    if (idList != null && idList.Any())
                    {
                        var fileuploadTaskList = new List<Task<FileUploadResponseTrnModel>>();
                        foreach (var id in idList)
                        {
                            if (!string.IsNullOrEmpty(id) && id != " ")
                            {
                                foreach (var file in files)
                                {
                                    long long_id = long.Parse(id);

                                    //fileuploadTaskList.Add(this._azureBlobService.UploadTaskFile_Single(file, long_id));

                                    var uploadTask = Task.Run(async () =>
                                    {
                                        using (var fileStream = file.OpenReadStream())
                                        {
                                            return await this._azureBlobService.UploadTaskFile_Single(file, fileStream, long_id);
                                        }
                                    });

                                    fileuploadTaskList.Add(uploadTask);
                                }
                            }
                        }

                        if (fileuploadTaskList != null && fileuploadTaskList.Any())
                        {
                            var fileuploadTaskList_Response = await Task.WhenAll(fileuploadTaskList);

                            if (fileuploadTaskList_Response != null && fileuploadTaskList_Response.Any())
                            {
                                var fileResponseList = new List<TaskFileDetailsTrnModel>();

                                foreach (var response in fileuploadTaskList_Response)
                                {
                                    if (!string.IsNullOrEmpty(response.FileUrl))
                                    {
                                        var fileResponse = new TaskFileDetailsTrnModel();
                                        fileResponse.TaskId = response.TaskId;
                                        fileResponse.TransactionId = TransactionId;
                                        fileResponse.RoleId = data.RoleId;
                                        fileResponse.FileName = response.FileName;
                                        fileResponse.UnqFileName = response.UnqFileName;
                                        fileResponse.FileUrl = response.FileUrl;
                                        fileResponse.ContentType = response.ContentType;
                                        fileResponse.CreatedByName = data.CreatedByName;
                                        fileResponse.CreatedByEmail = data.CreatedByEmail;
                                        fileResponse.CreatedByUPN = data.CreatedByUPN;
                                        fileResponse.CreatedByADID = data.CreatedByADID;

                                        fileResponseList.Add(fileResponse);
                                    }
                                }                                
                            }

                            // SAVE IN DB
                            return true;
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"FileHelper --> ProcesssFile_CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }

        public async Task<bool> ProcesssFile_UploadSingleFile_NonAsync(TaskFileDetailsTrnModel data, IFormFileCollection files)
        {
            try
            {
                if (data != null
                    && files != null
                    && files.Count > 0
                    )
                {
                    var fileResponseList = new List<TaskFileDetailsTrnModel>();
                    var guid = Guid.NewGuid();

                    foreach (var file in files)
                    {
                        var response = new FileUploadResponseTrnModel();

                        using (var fileStream = file.OpenReadStream())
                        {
                            response = await this._azureBlobService.UploadTaskFile_Single(file, fileStream, data.TaskId);
                        }

                        if (response != null && (!string.IsNullOrEmpty(response.FileUrl)))
                        {
                            var fileResponse = new TaskFileDetailsTrnModel();
                            fileResponse.TaskId = response.TaskId;
                            fileResponse.TransactionId = guid;
                            fileResponse.RoleId = data.RoleId;
                            fileResponse.FileName = response.FileName;
                            fileResponse.UnqFileName = response.UnqFileName;
                            fileResponse.FileUrl = response.FileUrl;
                            fileResponse.FileSize = response.FileSize;
                            fileResponse.ContentType = response.ContentType;
                            fileResponse.IsActive = true;
                            fileResponse.CreatedByName = data.CreatedByName;
                            fileResponse.CreatedByEmail = data.CreatedByEmail;
                            fileResponse.CreatedByUPN = data.CreatedByUPN;
                            fileResponse.CreatedByADID = data.CreatedByADID;

                            fileResponseList.Add(fileResponse);
                        }
                    }

                    // SAVE IN DB
                    var dbInsert_Response = await this._taskData.InsertFileResponse_Multiple(fileResponseList);

                    if (dbInsert_Response != null && dbInsert_Response.Status == 1)
                    {
                        return true;
                    }
                }
                return false;
            }                
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"FileHelper --> ProcesssFile_UploadSingleFile_NonAsync() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }

        public async Task<bool> ProcesssFile_CreateTask_NonAsync(TaskDetailsTrnModel data, IFormFileCollection files, string TaskIdList, Guid TransactionId)
        {
            try
            {
                if (data != null
                    && (!string.IsNullOrEmpty(TaskIdList))
                    && files != null
                    && files.Count > 0
                    )
                {
                    var idList = TaskIdList.Split(",");

                    if (idList != null && idList.Any())
                    {
                        var fileResponseList = new List<TaskFileDetailsTrnModel>();

                        foreach (var id in idList)
                        {
                            if (!string.IsNullOrEmpty(id) && id != " ")
                            {
                                foreach (var file in files)
                                {
                                    long long_id = long.Parse(id);

                                    var response = new FileUploadResponseTrnModel();

                                    using (var fileStream = file.OpenReadStream())
                                    {
                                        response = await this._azureBlobService.UploadTaskFile_Single(file, fileStream, long_id);
                                    }

                                    if (response != null && (!string.IsNullOrEmpty(response.FileUrl)))
                                    {
                                        var fileResponse = new TaskFileDetailsTrnModel();
                                        fileResponse.TaskId = response.TaskId;
                                        fileResponse.TransactionId = TransactionId;
                                        fileResponse.RoleId = data.RoleId;
                                        fileResponse.FileName = response.FileName;
                                        fileResponse.UnqFileName = response.UnqFileName;
                                        fileResponse.FileUrl = response.FileUrl;
                                        fileResponse.FileSize = response.FileSize;
                                        fileResponse.ContentType = response.ContentType;
                                        fileResponse.IsActive = true;
                                        fileResponse.CreatedByName = data.CreatedByName;
                                        fileResponse.CreatedByEmail = data.CreatedByEmail;
                                        fileResponse.CreatedByUPN = data.CreatedByUPN;
                                        fileResponse.CreatedByADID = data.CreatedByADID;

                                        fileResponseList.Add(fileResponse);
                                    }
                                }                                
                            }
                        }

                        // SAVE IN DB
                        var dbInsert_Response = await this._taskData.InsertFileResponse_Multiple(fileResponseList);

                        if (dbInsert_Response != null && dbInsert_Response.Status == 1)
                        {
                            return true;
                        }                        
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"FileHelper --> ProcesssFile_CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }


        public async Task<bool> ProcesssFile_UpdateTask_NonAsync(TaskHistoryTrnModel data, IFormFileCollection files, string TaskIdList, Guid TransactionId)
        {
            try
            {
                if (data != null
                    && (!string.IsNullOrEmpty(TaskIdList))
                    && files != null
                    && files.Count > 0
                    )
                {
                    var idList = TaskIdList.Split(",");

                    if (idList != null && idList.Any())
                    {
                        var fileResponseList = new List<TaskFileDetailsTrnModel>();

                        foreach (var id in idList)
                        {
                            if (!string.IsNullOrEmpty(id) && id != " ")
                            {
                                foreach (var file in files)
                                {
                                    long long_id = long.Parse(id);

                                    var response = new FileUploadResponseTrnModel();

                                    using (var fileStream = file.OpenReadStream())
                                    {
                                        response = await this._azureBlobService.UploadTaskFile_Single(file, fileStream, long_id);
                                    }

                                    if (response != null && (!string.IsNullOrEmpty(response.FileUrl)))
                                    {
                                        var fileResponse = new TaskFileDetailsTrnModel();
                                        fileResponse.TaskId = response.TaskId;
                                        fileResponse.TransactionId = TransactionId;
                                        fileResponse.RoleId = data.RoleId;
                                        fileResponse.FileName = response.FileName;
                                        fileResponse.UnqFileName = response.UnqFileName;
                                        fileResponse.FileUrl = response.FileUrl;
                                        fileResponse.FileSize = response.FileSize;
                                        fileResponse.ContentType = response.ContentType;
                                        fileResponse.IsActive = true;
                                        fileResponse.CreatedByName = data.TaskProgressDetails.UpdatedByName;
                                        fileResponse.CreatedByEmail = data.TaskProgressDetails.UpdatedByEmail;
                                        fileResponse.CreatedByUPN = data.TaskProgressDetails.UpdatedByUPN;
                                        fileResponse.CreatedByADID = data.TaskProgressDetails.UpdatedByADID;

                                        fileResponseList.Add(fileResponse);
                                    }
                                }
                            }
                        }

                        // SAVE IN DB
                        var dbInsert_Response = await this._taskData.InsertFileResponse_Multiple(fileResponseList);

                        if (dbInsert_Response != null && dbInsert_Response.Status == 1)
                        {
                            return true;
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"FileHelper --> ProcesssFile_CreateTask() execution failed");
                ExceptionLogging.SendErrorToText(ex);
                return false;
            }
        }
    }
}
