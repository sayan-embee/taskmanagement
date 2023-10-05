using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class ReturnMessageModel
    {
        public string Message { get; set; }
        public string ErrorMessage { get; set; }
        public int Status { get; set; }
        public string Id { get; set; }
        public string ReferenceNo { get; set; }
        public Guid GuidId { get; set; }
        public Guid TransactionId { get; set; }
        public string ExecutionTime { get; set; }
    }
}
