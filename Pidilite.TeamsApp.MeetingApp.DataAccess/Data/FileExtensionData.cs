using Pidilite.TeamsApp.MeetingApp.Common.Models;
using Pidilite.TeamsApp.MeetingApp.DataAccess.DbAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.DataAccess.Data
{
    public class FileExtensionData : IFileExtensionData
    {
        private readonly ISQLDataAccess _db;

        public FileExtensionData(ISQLDataAccess db)
        {
            this._db = db;
        }
        public async Task<IEnumerable<FileExtensionModel>> GetFileExtensions()
        {
            return await _db.LoadData<FileExtensionModel, dynamic>("dbo.usp_FileExtension_GetAll", new { });
        }

        public async Task<FileExtensionModel> GetFileExtension(int id)
        {
            var results = await _db.LoadData<FileExtensionModel, dynamic>("dbo.usp_FileExtension_Get", new { Id = id });

            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> InsertFileExtension(FileExtensionModel fileextension)
        {
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_FileExtension_Insert", new { Name = fileextension.ExtName, Active = fileextension.Active, CreatedBy = fileextension.CreatedBy, CreatedByEmail = fileextension.CreatedByEmail });
            return results.FirstOrDefault();
        }

        public async Task<ReturnMessageModel> UpdateFileExtension(FileExtensionModel fileextension)
        {
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_FileExtension_Update", new { Id = fileextension.ExtId, Name = fileextension.ExtName, Active = fileextension.Active, UpdatedBy = fileextension.UpdatedBy, UpdatedByEmail = fileextension.UpdatedByEmail });
            return results.FirstOrDefault();

        }

        public async Task<ReturnMessageModel> DeleteFileExtension(int Id)
        {
            var results = await _db.SaveData<ReturnMessageModel, dynamic>(storedProcedure: "dbo.usp_FileExtension_Delete", new { ExtId = Id });
            return results.FirstOrDefault();
        }
    }
}
