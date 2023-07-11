using Microsoft.Extensions.Logging;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.DataAccess.DbAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public class ConversationData : IConversationData
    {
        private readonly ISQLDataAccess _db;

        private readonly ILogger<ConversationData> _logger;
        public ConversationData(ISQLDataAccess db, ILogger<ConversationData> logger)
        {
            this._db = db;
            this._logger = logger;
        }

        public async Task<ConversationModel> GetConversationById(string conversationId)
        {
            try
            {
                var results = await _db.LoadData<ConversationModel, dynamic>("dbo.usp_Conversation_Get", new { conversationId = conversationId });

                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Unable to GetConversationById - conversation id :{conversationId}.");
                return null;
            }
        }

        public async Task<ConversationModel> GetConversationByUserId(Guid userId)
        {
            try
            {
                var results = await _db.LoadData<ConversationModel, dynamic>("dbo.usp_Conversation_Get", new { userId = userId });

                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Unable to GetConversationByUserId - user id :{userId}.");
                return null;
            }
        }

        public async Task<ReturnMessageModel> Insert(ConversationModel data)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_Conversation_Insert",
                new
                {
                    ConversationId = data.ConversationId,
                    BotInstalledOn = data.BotInstalledOn,
                    ServiceUrl = data.ServiceUrl,
                    UserId = data.UserId,
                    ActivityId = data.ActivityId,
                    RecipientId = data.RecipientId,
                    RecipientName = data.RecipientName,
                    UserEmail = data.UserEmail,
                    TenantId = data.TenantId,
                    UserName = data.UserName,
                    UserPrincipalName = data.UserPrincipalName
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Unable to insert conversation data. Conversation Id: {data.ConversationId} User Id:{data.UserId}");
                return null;
            }
        }

        public async Task<ReturnMessageModel> Update(ConversationModel data)
        {
            try
            {
                var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_Conversation_Update",
                new
                {
                    ConversationId = data.ConversationId,
                    BotInstalledOn = data.BotInstalledOn,
                    ServiceUrl = data.ServiceUrl,
                    ActivityId = data.ActivityId,
                    UserEmail = data.UserEmail,
                    UserName = data.UserName,
                    UserPrincipalName = data.UserPrincipalName
                });
                return results.FirstOrDefault();
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Unable to Update conversation data. Conversation Id: {data.ConversationId} User Id:{data.UserId}");
                return null;
            }
        }
    }
}
