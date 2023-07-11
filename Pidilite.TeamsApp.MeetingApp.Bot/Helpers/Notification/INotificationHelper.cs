using Microsoft.Bot.Schema;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helper
{
    public interface INotificationHelper
    {
        Task<TaskNotificationResponseModel> SendNewNotificationInPersonalScopeAsync(string userAdId, Attachment cardToSend);
    }
}