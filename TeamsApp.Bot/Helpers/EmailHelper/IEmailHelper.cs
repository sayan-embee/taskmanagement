using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Helpers.EmailHelper
{
    public interface IEmailHelper
    {
        Task<bool> ProcesssEmail_CreateTask(List<TaskEmailNotificationModel> data);
        Task<bool> ProcesssEmail_UpdateTask(List<TaskEmailNotificationModel> data);
    }
}