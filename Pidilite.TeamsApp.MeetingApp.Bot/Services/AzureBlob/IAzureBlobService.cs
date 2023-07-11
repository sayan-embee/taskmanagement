using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.AzureBlob
{
    public interface IAzureBlobService
    {
        Task<List<Uri>> UploadFiles(IFormFileCollection files, string meetingId);
        Task<List<Uri>> UploadTaskFiles(IFormFileCollection files, string taskId);
        Task<List<Uri>> UploadFilesUsingIFormFiles(List<IFormFile> files, string meetingId);
    }
}