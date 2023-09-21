using Microsoft.Bot.Schema;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.MicrosoftGraph
{
    public interface IAdaptiveCardService
    {
        Attachment GetWelcomeCardForPersonalScope();
        Attachment GetCard_CreateTask_ActionButton_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_CreateTask_PersonalScope(TaskDetailsCardModel data);
    }
}