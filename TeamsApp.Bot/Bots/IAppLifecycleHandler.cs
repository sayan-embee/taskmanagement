using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using System.Threading.Tasks;

namespace TeamsApp.Bot.Bots
{
    public interface IAppLifecycleHandler
    {
        Task OnBotInstalledInPersonalAsync(ITurnContext<IConversationUpdateActivity> turnContext, string appName);
        Task OnBotInstalledInTeamsAsync(ITurnContext<IConversationUpdateActivity> turnContext, string appName, TeamsChannelData teamsChannelData);
        Task OnBotRemovedInPersonalAsync(ITurnContext turnContext, string appName);
        Task OnBotRemovedInTeamsAsync(ITurnContext turnContext, string appName, TeamsChannelData teamsChannelData);

        /// <summary>
        /// Fetch task module
        /// </summary>
        /// <param name="turnContext"></param>
        /// <param name="taskModuleRequest"></param>
        /// <returns></returns>
        Task<TaskModuleResponse> OnFetchAsync(ITurnContext<IInvokeActivity> turnContext, TaskModuleRequest taskModuleRequest);
        Task<TaskModuleResponse> OnSubmitAsync(ITurnContext<IInvokeActivity> turnContext, TaskModuleRequest taskModuleRequest);
    }
}
