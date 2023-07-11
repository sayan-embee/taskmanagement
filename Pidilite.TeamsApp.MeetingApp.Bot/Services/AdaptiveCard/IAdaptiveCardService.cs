using Microsoft.Bot.Schema;
using Pidilite.TeamsApp.MeetingApp.Common.Models;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph
{
    public interface IAdaptiveCardService
    {
        Attachment GetCardOnTaskCreationInPersonalScope(TaskDetailsModel data);
        Attachment GetWelcomeCardForPersonalScope();
        Attachment GetCardOnTaskReassignInPersonalScope(TaskDetailsModel data);
        Attachment GetCardOnUpdatedTaskInPersonalScope(TaskDetailsModel data);
    }
}