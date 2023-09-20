using TeamsApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TeamsApp.DataAccess.Data
{
    public interface ITimeZoneData
    {
        Task<IEnumerable<TimeZoneModel>> GetTimeZone();
    }
}