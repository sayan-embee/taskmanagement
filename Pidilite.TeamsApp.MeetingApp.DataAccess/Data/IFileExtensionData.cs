using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public interface IFileExtensionData
    {
        Task<FileExtensionModel> GetFileExtension(int id);
        Task<IEnumerable<FileExtensionModel>> GetFileExtensions();
        Task<ReturnMessageModel> InsertFileExtension(FileExtensionModel fileextension);
        Task<ReturnMessageModel> UpdateFileExtension(FileExtensionModel fileextension);
        Task<ReturnMessageModel> DeleteFileExtension(int Id);
    }
}