using Microsoft.Graph;
using System.Threading.Tasks;

namespace TeamsApp.Bot.Services.MicrosoftGraph.Provider
{
    public interface IGraphServiceClientProvider
    {
        Task<GraphServiceClient> GetGraphClientApplication();
        Task<GraphServiceClient> GetGraphClientApplication(string accessToken);
        Task<string> GetApplicationAccessToken();
    }
}