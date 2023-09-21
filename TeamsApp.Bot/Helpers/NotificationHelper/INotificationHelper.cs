using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Helpers.NotificationHelper
{
    public interface INotificationHelper
    {
        Task<bool> ProcesssNotification_CreateTask(List<TaskDetailsCardModel> data);
    }
}