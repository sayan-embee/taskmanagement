using Microsoft.Bot.Connector;
using Microsoft.Bot.Schema;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Tasks
{
    public interface ITaskHelper
    {
        Task<bool> SendNewTaskNotificationViaEmailAsync(IEnumerable<TaskDetailsModel> taskDetailsModelList);
        Task<bool> SendReassignTaskNotificationViaEmailAsync(TaskDetailsModel taskDetailsModel);
        Task<bool> SendReassignAllTaskNotificationViaEmailAsync(IEnumerable<TaskDetailsModel> taskDetailsList);
        Task<bool> DeleteAdaptiveCardInChat(TaskNotificationResponseModel notifications);
        Task<bool> UpdateAdaptiveCardInChat(TaskNotificationResponseModel notifications, Attachment attachment);
        Task<bool> SendUpdatedTaskNotificationViaEmailAsync(TaskDetailsModel taskDetails);
    }
}