using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.Email
{
    public interface IEmailService
    {
        Task<TaskEmailNotificationModel> SendEmail_WithoutMessageId(TaskEmailNotificationModel data);
    }
}