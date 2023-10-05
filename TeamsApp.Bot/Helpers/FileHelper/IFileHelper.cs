using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Helpers.FileHelper
{
    public interface IFileHelper
    {
        Task<bool> ProcesssFile_CreateTask(TaskDetailsTrnModel data, IFormFileCollection files, string TaskIdList, Guid TransactionId);
        Task<bool> ProcesssFile_CreateTask_NonAsync(TaskDetailsTrnModel data, IFormFileCollection files, string TaskIdList, Guid TransactionId);
    }
}