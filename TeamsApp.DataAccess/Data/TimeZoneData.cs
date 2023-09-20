using TeamsApp.Common.Models;
using TeamsApp.DataAccess.DbAccess;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TeamsApp.DataAccess.Data
{
    public class TimeZoneData : ITimeZoneData
    {
        private readonly ISQLDataAccess _db;

        public TimeZoneData(ISQLDataAccess db)
        {
            this._db = db;
        }

        public async Task<IEnumerable<TimeZoneModel>> GetTimeZone()
        {
            return await _db.LoadData<TimeZoneModel, dynamic>("dbo.usp_GetTimeZones", new { });
        }
    }
}
