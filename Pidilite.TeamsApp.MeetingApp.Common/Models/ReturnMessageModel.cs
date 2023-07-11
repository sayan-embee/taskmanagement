﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Pidilite.TeamsApp.MeetingApp.Common.Models
{
    public class ReturnMessageModel
    {
        public string Message { get; set; }
        public string ErrorMessage { get; set; }
        public int Status { get; set; }
        public string Id { get; set; }
        public string ReferenceNo { get; set; }
        public Guid? GuidReferenceNo { get; set; }
    }
}
