using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace TeamsApp.ConsoleApp.PriorityNotification
{
    internal class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Console App Started...!");

            await SendPriorityNotification();

            Console.WriteLine("Console App Ended...!");
        }

        public static async Task<bool> SendPriorityNotification()
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                Console.WriteLine($"ConsoleApp --> SendPriorityNotification() execution started: {DateTime.UtcNow}");
                ExceptionLogging.WriteMessageToText($"ConsoleApp --> SendPriorityNotification() execution started: {DateTime.UtcNow}");

                var config = new ConfigurationBuilder()
                                  .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                                  .AddJsonFile($"appsettings.json")
                                  .Build();

                var endPoint = (config["AppHostUrl"] + "/api/v1.0/task/notification/priority");

                using (var httpClient = new HttpClient())
                {
                    var endPointUrl = endPoint;

                    using (var response = await httpClient.GetAsync(endPointUrl))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        var returnObject = JsonConvert.DeserializeObject<SchedularLogModel>(apiResponse);
                        if (returnObject != null)
                        {
                            Console.WriteLine(JsonConvert.SerializeObject(returnObject, Formatting.Indented));

                            DateTime endTime = DateTime.UtcNow;
                            Console.WriteLine($"ConsoleApp --> SendPriorityNotification() execution ended: {DateTime.UtcNow}");
                            ExceptionLogging.WriteMessageToText($"ConsoleApp --> SendPriorityNotification() execution ended: {DateTime.UtcNow}");

                            TimeSpan timeDifference = endTime - startTime;
                            string formattedTimeDifference = timeDifference.ToString(@"hh\:mm\:ss");

                            Console.WriteLine($"ConsoleApp --> SendPriorityNotification() execution time: {formattedTimeDifference}");
                            ExceptionLogging.WriteMessageToText($"ConsoleApp --> SendPriorityNotification() execution time: {formattedTimeDifference}");

                            return true;
                        }
                    }
                }                
            }
            catch (Exception ex)
            {
                ExceptionLogging.SendErrorToText(ex);
            }

            return false;
        }
    }
}