using Microsoft.Bot.Schema;
using System;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.Notification
{
    public interface INotificationService
    {
        Task<NotificationResponseTrnModel> SendCard_PersonalScope(string userADID, Attachment cardAttachment, long referenceId);
    }
}