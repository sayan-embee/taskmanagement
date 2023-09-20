using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.DataAccess.Data
{
    public interface IMasterAPIData
    {
        Task<List<StatusMasterModel>> GetAllStatus();
        Task<List<PriorityMasterModel>> GetAllPriority();
        Task<List<RoleMasterModel>> GetAllRole();
    }
}