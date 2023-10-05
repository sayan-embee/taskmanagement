using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.AzureBlob
{
    public interface IAzureBlobService
    {
        Task<List<Uri>> UploadFiles(IFormFileCollection files, string meetingId);
        Task<List<FileUploadResponseTrnModel>> UploadTaskFile_Multiple(IFormFileCollection files, long Id);
        Task<FileUploadResponseTrnModel> UploadTaskFile_Single(IFormFile file, System.IO.Stream stream, long Id);
        Task<List<Uri>> UploadFilesUsingIFormFiles(List<IFormFile> files, string meetingId);
    }
}