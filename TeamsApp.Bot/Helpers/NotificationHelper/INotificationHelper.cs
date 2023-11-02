using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Helpers.NotificationHelper
{
    public interface INotificationHelper
    {
        Task<bool> ProcesssNotification_CreateTask(List<TaskDetailsCardModel> data);
        Task<bool> ProcesssNotification_UpdateTask(List<TaskDetailsCardModel> data);
        Task<bool> ProcesssNotification_ReassignTask(List<TaskDetailsCardModel> data, List<TaskAssigneeTrnModel> prevAssigneeList = null);
        Task<bool> ProcesssPriorityNotification(List<TaskDetailsCardModel> data);
    }
}