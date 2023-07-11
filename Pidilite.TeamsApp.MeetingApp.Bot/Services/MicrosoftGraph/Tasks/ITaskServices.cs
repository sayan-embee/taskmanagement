using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Tasks
{
    public interface ITaskServices
    {
       Task<bool> SendNewTaskNotificationViaEmail(IEnumerable<TaskDetailsModel> taskDetailsModelList);
        Task<bool> SendReassignTaskNotificationViaEmail(TaskDetailsModel taskDetailsModel);
        Task<bool> SendReassignAllTaskNotificationViaEmail(IEnumerable<TaskDetailsModel> taskDetailsList);
        Task<bool> SendUpdatedTaskNotificationViaEmail(TaskDetailsModel taskDetails);
    }
}