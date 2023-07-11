using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Models
{
    public class AzureBlobSettings
    {
       public string StorageConnectionString { get; set; }
       public string ContainerName { get; set; }
    }
}
