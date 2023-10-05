using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TeamsApp.Bot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using TeamsApp.Bot.Helpers;
using Azure.Storage.Sas;
using TeamsApp.Common.Models;

namespace TeamsApp.Bot.Services.AzureBlob
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly IOptions<AzureBlobSettings> blobOptions;
        private readonly ILogger<AzureBlobService> _logger;
        public AzureBlobService(
            ILogger<AzureBlobService> logger, 
            IOptions<AzureBlobSettings> blobOptions
            )
        {
            this.blobOptions = blobOptions ?? throw new ArgumentNullException(nameof(blobOptions));
            this._logger = logger;
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

                        this._logger.LogInformation($"Uploading file {fileName}.");
                        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);
                        this._logger.LogInformation($"Setting metadata meetingId for file : {fileName}.");

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
                    this._logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return listUri;
                }
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Error occurred while uploading file -> Meeting Id :{meetingId}");
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

                        this._logger.LogInformation($"Uploading file {fileName}.");
                        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);
                        this._logger.LogInformation($"Setting metadata meetingId for file : {fileName}.");

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
                    this._logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return listUri;
                }
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"Error occurred while uploading file -> Meeting Id :{meetingId}");
                return listUri; ;
            }
        }

        public async Task<List<FileUploadResponseTrnModel>> UploadTaskFile_Multiple(IFormFileCollection files, long Id)
        {
            var returnList = new List<FileUploadResponseTrnModel>();
            try
            {
                BlobContainerClient container = new BlobContainerClient(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName);

                var result = await container.ExistsAsync(cancellationToken: default);
                if (result)
                {
                    var returnObj = new FileUploadResponseTrnModel();

                    foreach (var file in files)
                    {
                        string fileName = $"{Guid.NewGuid()}_{file.FileName}";
                        // Get a reference to a blob
                        BlobClient blobClient = container.GetBlobClient(fileName);

                        this._logger.LogInformation($"\"Uploading file --> {fileName}");
                        ExceptionLogging.WriteMessageToText($"\"Uploading file --> {fileName}");

                        await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);

                        this._logger.LogInformation($"Configuring metadata for file --> {fileName} || TaskId --> {Id}");
                        ExceptionLogging.WriteMessageToText($"Configuring metadata for file --> {fileName} || TaskId --> {Id}");

                        IDictionary<string, string> metadata = new Dictionary<string, string>();
                        // Add metadata to the dictionary by using key/value syntax
                        metadata["taskId"] = Id.ToString();
                        // Set the blob's metadata.
                        await blobClient.SetMetadataAsync(metadata);

                        returnObj.TaskId = Id;
                        returnObj.FileName = file.FileName;
                        returnObj.UnqFileName = fileName;
                        returnObj.ContentType = file.ContentType;

                        this._logger.LogInformation($"Generating SAS token successfully for file --> {fileName}");
                        ExceptionLogging.WriteMessageToText($"Generating SAS token successfully for file --> {fileName}");
                        try
                        {
                            var privateUrl = await this.GenerateSASToken(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName, fileName);

                            if (!string.IsNullOrEmpty(privateUrl))
                            {
                                this._logger.LogInformation($"Generated SAS token successfully for file --> {fileName} || SAS --> {privateUrl}");
                                ExceptionLogging.WriteMessageToText($"Generated SAS token successfully for file --> {fileName} || SAS --> {privateUrl}");

                                returnObj.FileUrl = privateUrl;
                            }
                            else
                            {
                                returnObj.FileUrl = (blobClient.Uri).ToString();
                            }
                        }
                        catch (Exception ex)
                        {
                            this._logger.LogError(ex, $"AzureBlobService --> UploadTaskFiles() execution failed to generate SAS token for file --> {fileName} || Error message: {ex.Message}");
                            ExceptionLogging.SendErrorToText(ex);
                            returnObj.FileUrl = (blobClient.Uri).ToString();
                        }

                        if (returnObj != null)
                        {
                            returnList.Add(returnObj);
                        }
                    }

                    return returnList;
                }
                else
                {
                    this._logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    ExceptionLogging.WriteMessageToText($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return returnList;
                }
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"AzureBlobService --> UploadTaskFiles() execution failed while uploading file --> Task Id :{Id}");
                ExceptionLogging.SendErrorToText(ex);
                return returnList;
            }
        }


        public async Task<FileUploadResponseTrnModel> UploadTaskFile_Single(IFormFile file, System.IO.Stream stream, long Id)
        {
            var returnObj = new FileUploadResponseTrnModel();
            try
            {
                BlobContainerClient container = new BlobContainerClient(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName);

                var result = await container.ExistsAsync(cancellationToken: default);
                if (result)
                {
                    string fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    // Get a reference to a blob
                    BlobClient blobClient = container.GetBlobClient(fileName);

                    this._logger.LogInformation($"\"Uploading file --> {fileName}");
                    ExceptionLogging.WriteMessageToText($"\"Uploading file --> {fileName}");

                    await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType }, cancellationToken: default);

                    this._logger.LogInformation($"Configuring metadata for file --> {fileName} || TaskId --> {Id}");
                    ExceptionLogging.WriteMessageToText($"Configuring metadata for file --> {fileName} || TaskId --> {Id}");

                    IDictionary<string, string> metadata = new Dictionary<string, string>();
                    // Add metadata to the dictionary by using key/value syntax
                    metadata["taskId"] = Id.ToString();
                    // Set the blob's metadata.
                    await blobClient.SetMetadataAsync(metadata);

                    returnObj.TaskId = Id;
                    returnObj.FileName = file.FileName;
                    returnObj.UnqFileName = fileName;
                    returnObj.ContentType = file.ContentType;
                    returnObj.FileSize = (file.Length).ToString();

                    this._logger.LogInformation($"Generating SAS token successfully for file --> {fileName}");
                    ExceptionLogging.WriteMessageToText($"Generating SAS token successfully for file --> {fileName}");
                    try
                    {
                        var privateUrl = await this.GenerateSASToken(this.blobOptions.Value.StorageConnectionString, this.blobOptions.Value.ContainerName, fileName);

                        if (!string.IsNullOrEmpty(privateUrl))
                        {
                            this._logger.LogInformation($"Generated SAS token successfully for file --> {fileName} || SAS --> {privateUrl}");
                            ExceptionLogging.WriteMessageToText($"Generated SAS token successfully for file --> {fileName} || SAS --> {privateUrl}");

                            returnObj.FileUrl = privateUrl;
                        }
                        else
                        {
                            returnObj.FileUrl = (blobClient.Uri).ToString();
                        }
                    }
                    catch (Exception ex)
                    {
                        this._logger.LogError(ex, $"AzureBlobService --> UploadTaskFiles() execution failed to generate SAS token for file --> {fileName} || Error message: {ex.Message}");
                        ExceptionLogging.SendErrorToText(ex);
                        returnObj.FileUrl = (blobClient.Uri).ToString();
                    }

                    return returnObj;
                }
                else
                {
                    this._logger.LogInformation($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    ExceptionLogging.WriteMessageToText($"Blob container {this.blobOptions.Value.ContainerName} not found.");
                    return returnObj;
                }
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"AzureBlobService --> UploadTaskFiles() execution failed while uploading file --> Task Id :{Id}");
                ExceptionLogging.SendErrorToText(ex);
                return returnObj;
            }
        }



        private async Task<string> GenerateSASToken(string connectionString, string containerName, string blobName)
        {
            string privateUrl = string.Empty;

            // Create a BlobServiceClient object using the connection string
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Get a reference to the container
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            // Get a reference to the blob
            BlobClient blobClient = containerClient.GetBlobClient(blobName);

            // Create a SAS token that's valid for specified hour.
            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = containerName,
                BlobName = blobName,
                Resource = "b"
            };

            // 100 years from 2023
            sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddHours(876000);
            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            privateUrl = blobClient.GenerateSasUri(sasBuilder).AbsoluteUri;

            await Task.Delay(0);

            return privateUrl;
        }
    }
}
