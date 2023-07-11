using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class FileExtensionModel
    {
        
        /// <summary>
        /// Extension Id.
        /// </summary>       
        public int ExtId { get; set; }

        /// <summary>
        /// Name of the Extension.
        /// </summary>
        public string ExtName { get; set; }

        /// <summary>
        /// Active status true or false.
        /// </summary>
        public bool Active { get; set; }

        public string CreatedBy { get; set; }

        public string CreatedByEmail { get; set; }

        public DateTime? CreatedOn { get; set; }

        public string UpdatedBy { get; set; }

        public string UpdatedByEmail { get; set; }

        public DateTime? UpdatedOn { get; set; }



    }
}
