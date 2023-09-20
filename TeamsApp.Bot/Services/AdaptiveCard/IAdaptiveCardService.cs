using Microsoft.Bot.Schema;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.MicrosoftGraph
{
    public interface IAdaptiveCardService
    {
        Attachment GetCardOnTaskCreationInPersonalScope(TaskDetailsModel data);
        Attachment GetWelcomeCardForPersonalScope();
        Attachment GetCardOnTaskReassignInPersonalScope(TaskDetailsModel data);
        Attachment GetCardOnUpdatedTaskInPersonalScope(TaskDetailsModel data);
    }
}