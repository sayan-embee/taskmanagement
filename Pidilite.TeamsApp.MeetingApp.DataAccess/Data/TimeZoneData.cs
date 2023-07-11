using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.DataAccess.DbAccess;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
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
