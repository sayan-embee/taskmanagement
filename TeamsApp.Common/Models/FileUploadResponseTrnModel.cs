using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class FileUploadResponseTrnModel
    {
        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("fileName")]
        public string FileName { get; set; }

        [JsonProperty("unqFileName")]
        public string UnqFileName { get; set; }

        [JsonProperty("fileUrl")]
        public string FileUrl { get; set; }

        [JsonProperty("fileSize")]
        public string FileSize { get; set; }

        [JsonProperty("contentType")]
        public string ContentType { get; set; }
    }

    public class TaskFileDetailsTrnModel
    {
        [JsonProperty("FileId")]
        public long FileId { get; set; }

        [JsonProperty("taskId")]
        public long TaskId { get; set; }

        [JsonProperty("fileName")]
        public string FileName { get; set; }

        [JsonProperty("unqFileName")]
        public string UnqFileName { get; set; }

        [JsonProperty("fileDesc")]
        public string FileDesc { get; set; }

        [JsonProperty("fileUrl")]
        public string FileUrl { get; set; }

        [JsonProperty("fileSize")]
        public string FileSize { get; set; }

        [JsonProperty("contentType")]
        public string ContentType { get; set; }

        [JsonProperty("isActive")]
        public bool IsActive { get; set; }

        [JsonProperty("transactionId")]
        public Guid TransactionId { get; set; }

        [JsonProperty("roleId")]
        public int? RoleId { get; set; }

        [JsonProperty("createdOnIST")]
        public DateTime? CreatedOnIST { get; set; }

        [JsonProperty("createdOnUTC")]
        public DateTime? CreatedOnUTC { get; set; }

        [JsonProperty("createdByName")]
        public string CreatedByName { get; set; }

        [JsonProperty("createdByEmail")]
        public string CreatedByEmail { get; set; }

        [JsonProperty("createdByUPN")]
        public string CreatedByUPN { get; set; }

        [JsonProperty("createdByADID")]
        public string CreatedByADID { get; set; }

        [JsonProperty("updatedOnIST")]
        public DateTime? UpdatedOnIST { get; set; }

        [JsonProperty("updatedOnUTC")]
        public DateTime? UpdatedOnUTC { get; set; }

        [JsonProperty("updatedByName")]
        public string UpdatedByName { get; set; }

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByUPN")]
        public string UpdatedByUPN { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }
    }
}
