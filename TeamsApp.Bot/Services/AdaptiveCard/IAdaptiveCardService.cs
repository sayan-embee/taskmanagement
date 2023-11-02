using Microsoft.Bot.Schema;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.MicrosoftGraph
{
    public interface IAdaptiveCardService
    {
        Attachment GetWelcomeCardForPersonalScope();
        Attachment GetCard_CreateTask_ActionButton_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_CreateTask_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_UpdateTask_ActionButton_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_UpdateTask_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_ReassignTask_ActionButton_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_ReassignTask_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_ReassignTask_NoAction_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_PriorityNotification_ActionButton_PersonalScope(TaskDetailsCardModel data);
        Attachment GetCard_PriorityNotification_PersonalScope(TaskDetailsCardModel data);
    }
}