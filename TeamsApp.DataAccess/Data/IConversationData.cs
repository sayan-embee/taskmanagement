using TeamsApp.Common.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace TeamsApp.DataAccess.Data
{
    public interface IConversationData
    {
        Task<IEnumerable<ConversationModel>> GetAllPersonalConversations();
        Task<ConversationModel> GetConversationById(string conversationId);
        Task<ConversationModel> GetConversationByUserId(Guid userId);
        Task<ConversationModel> GetConversationByUserId(Guid userId, string appName);
        Task<ReturnMessageModel> Insert(ConversationModel data);
        Task<ReturnMessageModel> Update(ConversationModel data);
        Task<ReturnMessageModel> Remove(ConversationModel data);

        Task<IEnumerable<ConversationTeamsModel>> GetAllTeamsConversations();
        Task<ConversationTeamsModel> GetConversationByTeamAadGroupId(string aadGroupId, string appName);
        Task<ReturnMessageModel> UpdateTeamConversation(ConversationTeamsModel data);
        Task<ReturnMessageModel> InsertTeamConversation(ConversationTeamsModel data);
        Task<ReturnMessageModel> RemoveTeamConversation(ConversationTeamsModel data);
    }
}