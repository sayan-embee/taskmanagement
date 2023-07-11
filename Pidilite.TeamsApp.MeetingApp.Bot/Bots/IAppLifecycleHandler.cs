using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Bots
{
    public interface IAppLifecycleHandler
    {
        /// <summary>
        /// Sends welcome card to user when bot is installed in personal scope.
        /// </summary>
        /// <param name="turnContext">Provides context for a turn in a bot.</param>
        /// <returns>A task that represents a response.</returns>
        Task OnBotInstalledInPersonalAsync(ITurnContext<IConversationUpdateActivity> turnContext);

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
