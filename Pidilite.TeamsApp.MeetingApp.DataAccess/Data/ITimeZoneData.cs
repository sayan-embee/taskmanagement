using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public interface ITimeZoneData
    {
        Task<IEnumerable<TimeZoneModel>> GetTimeZone();
    }
}