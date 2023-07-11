using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pidilite.TeamsApp.MeetingApp.Bot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.AzureBlob
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly IOptions<AzureBlobSettings> blobOptions;
        private readonly ILogger<AzureBlobService> logger;
        public AzureBlobService(
            ILogger<AzureBlobService> logger, IOptions<AzureBlobSettings> blobOptions)
        {
            this.blobOptions = blobOptions ?? throw new ArgumentNullException(nameof(blobOptions));
            this.logger = logger;
        }
        public async Task<List<Uri>> UploadFiles(IFormFileCollection files, string meetingId)
        {
            List<Uri> listUri = null;
            try
            {
                BlobContainerClient container = new BlobContainerClient(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName);

                var result = await container.ExistsAsync(cancellationToken: default);
                if (result)
                {
                    listUri = new List<Uri>();
                    foreach (var file in files)
                    {

                        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
                        // Get a reference to a blob
                        BlobClient blobClient = container.GetBlobClient(fileName);

                        this.logger.LogInformation($"Uploading file {fileName}.");
                        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);
                        this.logger.LogInformation($"Setting metadata meetingId for file : {fileName}.");

                        IDictionary<string, string> metadata = new Dictionary<string, string>();
                        // Add metadata to the dictionary by using key/value syntax
                        metadata["meetingId"] = meetingId;
                        // Set the blob's metadata.
                        await blobClient.SetMetadataAsync(metadata);
                        listUri.Add(blobClient.Uri);

                    }
                    return listUri;
                }
                else
                {
                    this.logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return listUri;
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"Error occurred while uploading file -> Meeting Id :{meetingId}");
                return listUri; ;
            }
        }

        public async Task<List<Uri>> UploadFilesUsingIFormFiles(List<IFormFile> files, string meetingId)
        {
            List<Uri> listUri = null;
            try
            {
                BlobContainerClient container = new BlobContainerClient(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName);

                var result = await container.ExistsAsync(cancellationToken: default);
                if (result)
                {
                    listUri = new List<Uri>();
                    foreach (var file in files)
                    {

                        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
                        // Get a reference to a blob
                        BlobClient blobClient = container.GetBlobClient(fileName);

                        this.logger.LogInformation($"Uploading file {fileName}.");
                        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);
                        this.logger.LogInformation($"Setting metadata meetingId for file : {fileName}.");

                        IDictionary<string, string> metadata = new Dictionary<string, string>();
                        // Add metadata to the dictionary by using key/value syntax
                        metadata["meetingId"] = meetingId;
                        // Set the blob's metadata.
                        await blobClient.SetMetadataAsync(metadata);
                        listUri.Add(blobClient.Uri);

                    }
                    return listUri;
                }
                else
                {
                    this.logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return listUri;
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"Error occurred while uploading file -> Meeting Id :{meetingId}");
                return listUri; ;
            }
        }

        public async Task<List<Uri>> UploadTaskFiles(IFormFileCollection files, string taskId)
        {
            List<Uri> listUri = null;
            try
            {
                BlobContainerClient container = new BlobContainerClient(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName);

                var result = await container.ExistsAsync(cancellationToken: default);
                if (result)
                {
                    listUri = new List<Uri>();
                    foreach (var file in files)
                    {

                        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
                        // Get a reference to a blob
                        BlobClient blobClient = container.GetBlobClient(fileName);

                        this.logger.LogInformation($"Uploading file {fileName}.");
                        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);
                        this.logger.LogInformation($"Setting metadata taskId for file : {fileName}.");

                        IDictionary<string, string> metadata = new Dictionary<string, string>();
                        // Add metadata to the dictionary by using key/value syntax
                        metadata["taskId"] = taskId;
                        // Set the blob's metadata.
                        await blobClient.SetMetadataAsync(metadata);
                        listUri.Add(blobClient.Uri);

                    }
                    return listUri;
                }
                else
                {
                    this.logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return listUri;
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, $"Error occurred while uploading file -> Task Id :{taskId}");
                return listUri; ;
            }
        }
    }
}
