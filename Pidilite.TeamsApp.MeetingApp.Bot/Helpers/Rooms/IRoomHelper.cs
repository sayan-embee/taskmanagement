using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helper
{
    public interface IRoomHelper
    {
        Task<IEnumerable<RoomModel>> GetAllRoomsAsync(string filter = null);
        Task<RoomModel> GetRoomAsync(string roomId);
        Task<RoomScheduleModel> GetRoomScheduleAsync(RoomScheduleModel roomScheduleModel);
    }
}