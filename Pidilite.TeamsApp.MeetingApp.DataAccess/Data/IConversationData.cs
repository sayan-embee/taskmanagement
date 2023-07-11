using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public interface IConversationData
    {
        Task<ConversationModel> GetConversationById(string conversationId);
        Task<ConversationModel> GetConversationByUserId(Guid userId);
        Task<ReturnMessageModel> Insert(ConversationModel data);
        Task<ReturnMessageModel> Update(ConversationModel data);
    }
}