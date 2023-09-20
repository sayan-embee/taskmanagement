using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models.Enum
{
    public class CategoryModel
    {
        [JsonProperty("categoryId")]
        public long CategoryId { get; set; }

        [JsonProperty("categoryName")]
        public string CategoryName { get; set; }

        [JsonProperty("categoryDescription")]
        public string CategoryDescription { get; set; }

        [JsonProperty("isActive")]
        public string IsActive { get; set; }

        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; }

        [JsonProperty("createdByEmail")]
        public string CreatedByEmail { get; set; }

        [JsonProperty("createdByADID")]
        public string CreatedByADID { get; set; }

        [JsonProperty("createdOn")]
        public DateTime? CreatedOn { get; set; }

        [JsonProperty("updatedBy")]
        public string UpdatedBy { get; set; }       

        [JsonProperty("updatedByEmail")]
        public string UpdatedByEmail { get; set; }

        [JsonProperty("updatedByADID")]
        public string UpdatedByADID { get; set; }

        [JsonProperty("updatedOn")]
        public DateTime? UpdatedOn { get; set; }
        
    }
}
