using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamsApp.Common.Models;
using TeamsApp.Common.Models.Enum;
using TeamsApp.DataAccess.DbAccess;

namespace TeamsApp.DataAccess.Data
{
    public class MasterAPIData : IMasterAPIData
    {
        private readonly ILogger _logger;

        private readonly ISQLDataAccess _db;
        private readonly IConfiguration _config;

        public MasterAPIData(
            ILogger<MasterAPIData> logger
            , TelemetryClient telemetryClient

            , IConfiguration config
            , ISQLDataAccess db)
        {
            this._logger = logger;

            this._db = db;
            this._config = config;
        }

        #region Status Master

        #region Get

        public async Task<List<StatusMasterModel>> GetAllStatus()
        {
            try
            {
                var result = await _db.LoadData<StatusMasterModel, dynamic>("dbo.usp_MstStatus_GetAll",
                new
                {
                });

                if(result != null && result.Any())
                {
                    return result.ToList();
                }

                return null;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"MasterAPIData --> GetAllStatus() --> SQL(usp_MstStatus_GetAll) execution failed");
                return null;
            }
        }

        #endregion

        #endregion









        #region Priority Master

        #region Get

        public async Task<List<PriorityMasterModel>> GetAllPriority()
        {
            try
            {
                var result = await _db.LoadData<PriorityMasterModel, dynamic>("dbo.usp_MstPriority_GetAll",
                new
                {
                });

                if (result != null && result.Any())
                {
                    return result.ToList();
                }

                return null;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"MasterAPIData --> GetAllPriority() --> SQL(usp_MstPriority_GetAll) execution failed");
                return null;
            }
        }

        #endregion

        #endregion









        #region Role Master

        #region Get

        public async Task<List<RoleMasterModel>> GetAllRole()
        {
            try
            {
                var result = await _db.LoadData<RoleMasterModel, dynamic>("dbo.usp_MstRole_GetAll",
                new
                {
                });

                if (result != null && result.Any())
                {
                    return result.ToList();
                }

                return null;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"MasterAPIData --> GetAllRole() --> SQL(usp_MstRole_GetAll) execution failed");
                return null;
            }
        }

        #endregion

        #endregion
    }
}
