

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph
{
    using System.Threading.Tasks;

    /// <summary>
    /// Chats Service.
    /// </summary>
    public interface IChatsService
    {
        /// <summary>
        /// Get chatThread Id for the user.
        /// </summary>
        /// <param name="userId">User Id.</param>
        /// <param name="appId">Teams App Id.</param>
        /// <returns>ChatThread Id.</returns>
        public Task<string> GetChatThreadIdAsync(string userId, string appId);
    }
}
