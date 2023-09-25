using Azure;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Threading.Tasks;
using TeamsApp.Bot.Helpers;
using TeamsApp.Bot.Models;
using TeamsApp.Bot.Services.MicrosoftGraph;
using TeamsApp.Bot.Services.MicrosoftGraph.Provider;
using TeamsApp.Bot.Services.Notification;
using TeamsApp.Common.Models;
using TeamsApp.DataAccess.Data;

namespace TeamsApp.Bot.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly ILogger _logger;
        private readonly IConversationData _conversationData;
        private readonly IOptions<BotSettings> _botOptions;

        private readonly IGraphServiceClientProvider _graphServiceClientProvider;

        public EmailService(
            ILogger<EmailService> logger
            , IConversationData conversationData
            , IOptions<BotSettings> botOptions
            , IGraphServiceClientProvider graphServiceClientProvider
            )
        {
            _logger = logger;
            _conversationData = conversationData;
            _botOptions = botOptions;
            _graphServiceClientProvider = graphServiceClientProvider;
        }

        public async Task<TaskEmailNotificationModel> SendEmail_WithoutMessageId(TaskEmailNotificationModel data)
        {
            var returnObject = new TaskEmailNotificationModel();

            try
            {
                GraphServiceClient graphClient = await this._graphServiceClientProvider.GetGraphClientApplication();               

                if (data != null)
                {
                    returnObject = data;

                    var subject = data.EmailSubject;
                    var body = data.EmailBody;

                    IList<Recipient> toRecipients = new List<Recipient>();
                    IList<Recipient> ccRecipients = new List<Recipient>();

                    var toList = (data.ToRecipient).Split(",");
                    foreach (var user in toList)
                    {
                        if (!string.IsNullOrEmpty(user) && user != " ")
                        {
                            toRecipients.Add(new Recipient
                            {
                                EmailAddress = new EmailAddress
                                {
                                    Address = user.Trim(),
                                    Name = user.Trim()
                                }
                            });
                        }
                    }

                    var saveToSentItems = true;

                    var message = new Message();
                    message.Subject = subject;
                    message.Body = new ItemBody
                    {
                        ContentType = BodyType.Html,
                        Content = body
                    };
                    message.ToRecipients = toRecipients;
                    //message.CcRecipients = recipientsCc;

                    await graphClient
                   .Users[data.FromRecipient]
                   .SendMail(message, saveToSentItems)
                   .Request()
                   .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                   .PostAsync();

                    returnObject.IsSent = true;

                    return returnObject;
                }

                returnObject.IsSent = false;

                return returnObject;
            }
            catch (Exception ex)
            {
                this._logger.LogError(ex, $"EmailService --> SendEmail_WithoutMessageId() execution failed for: {JsonConvert.SerializeObject(data, Formatting.Indented)}");
                ExceptionLogging.SendErrorToText(ex);
                returnObject.IsSent = false;
                return returnObject;
            }
        }
    }
}
