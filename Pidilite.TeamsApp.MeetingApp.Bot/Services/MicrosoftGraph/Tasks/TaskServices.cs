using Microsoft.Graph;
using Pidilite.TeamsApp.MeetingApp.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Tasks
{
    internal class TaskServices : ITaskServices
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TaskServices"/> class.
        /// </summary>
        /// <param name="graphServiceClient">graph service client.</param>
        private readonly IGraphServiceClient graphServiceClient;

        internal TaskServices(IGraphServiceClient graphServiceClient)
        {
            this.graphServiceClient = graphServiceClient ?? throw new ArgumentNullException(nameof(graphServiceClient));
        }

        public async Task<bool> SendNewTaskNotificationViaEmail(IEnumerable<TaskDetailsModel> taskDetailsModelList)
        {
            if (taskDetailsModelList != null && taskDetailsModelList.Count() > 0)
            {
                var subject = "The following task has been assigned to you";
                var body = "";
                IList<Recipient> recipients = new List<Recipient>();
                //IList<Recipient> recipientsCc = new List<Recipient>();

                // add recipients
                foreach (var task in taskDetailsModelList)
                {
                    recipients.Add(new Recipient
                    {
                        EmailAddress = new EmailAddress
                        {
                            Address = task.AssignedToEmail,
                            Name = task.AssignedTo
                        }
                    });
                }
                // add body
                StringBuilder sbBody = new StringBuilder();
                sbBody.Append($"<b>Meeting Title</b> - {taskDetailsModelList.First().MeetingTitle}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Assigned By</b> - {taskDetailsModelList.First().ActionTakenBy}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Issue Discussed</b> - {taskDetailsModelList.First().TaskContext}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Action Planned</b> - {taskDetailsModelList.First().TaskActionPlan}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Completion Date</b> - {((DateTime)(taskDetailsModelList.First().TaskClosureDate)).ToString("dd/MM/yyyy")}");
                sbBody.Append($"<br>");
                body = sbBody.ToString();

                var saveToSentItems = false;
                var message = new Message();
                message.Subject = subject;
                message.Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = body
                };
                message.ToRecipients = recipients;
                //message.CcRecipients = recipientsCc;

                await this.graphServiceClient
                    .Users[taskDetailsModelList.First().ActionTakenByADID]
                    .SendMail(message, saveToSentItems)
                    .Request()
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                    .PostAsync();
                return true;

            }
            return false;
        }

        public async Task<bool> SendUpdatedTaskNotificationViaEmail(TaskDetailsModel taskDetails)
        {
            if (taskDetails != null)
            {
                var subject = "The following task has been assigned to you";
                var body = "";
                IList<Recipient> recipients = new List<Recipient>();
                //IList<Recipient> recipientsCc = new List<Recipient>();

                // add recipients
                recipients.Add(new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = taskDetails.AssignedToEmail,
                        Name = taskDetails.AssignedTo
                    }
                });

                // add body
                StringBuilder sbBody = new StringBuilder();
                sbBody.Append($"<b>Meeting Title</b> - {taskDetails.MeetingTitle}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Assigned By</b> - {taskDetails.ActionTakenBy}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Issue Discussed</b> - {taskDetails.TaskContext}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Action Planned</b> - {taskDetails.TaskActionPlan}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Completion Date</b> - {((DateTime)(taskDetails.TaskClosureDate)).ToString("dd/MM/yyyy")}");
                sbBody.Append($"<br>");
                body = sbBody.ToString();

                var saveToSentItems = false;
                var message = new Message();
                message.Subject = subject;
                message.Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = body
                };
                message.ToRecipients = recipients;
                //message.CcRecipients = recipientsCc;

                await this.graphServiceClient
                    .Users[taskDetails.ActionTakenByADID]
                    .SendMail(message, saveToSentItems)
                    .Request()
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                    .PostAsync();
                return true;

            }
            return false;
        }

        public async Task<bool> SendReassignTaskNotificationViaEmail(TaskDetailsModel taskDetailsModel)
        {
            if (taskDetailsModel != null)
            {
                var subject = "The following task has been re-assigned to you";
                var body = "";
                IList<Recipient> recipients = new List<Recipient>();
                //IList<Recipient> recipientsCc = new List<Recipient>();

                // add recipients
                recipients.Add(new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = taskDetailsModel.AssignedToEmail,
                        Name = taskDetailsModel.AssignedTo
                    }
                });

                // add body
                StringBuilder sbBody = new StringBuilder();
                sbBody.Append($"<b>Meeting Title</b> - {taskDetailsModel.MeetingTitle}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Re-assigned By</b> - {taskDetailsModel.ActionTakenBy}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Issue Discussed</b> - {taskDetailsModel.TaskContext}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Action Planned</b> - {taskDetailsModel.TaskActionPlan}");
                sbBody.Append($"<br>");
                sbBody.Append($"<b>Completion Date</b> -  {((DateTime)(taskDetailsModel.TaskClosureDate)).ToString("dd/MM/yyyy")}");
                sbBody.Append($"<br>");
                body = sbBody.ToString();

                var saveToSentItems = false;
                var message = new Message();
                message.Subject = subject;
                message.Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = body
                };
                message.ToRecipients = recipients;
                //message.CcRecipients = recipientsCc;

                await this.graphServiceClient
                    .Users[taskDetailsModel.ActionTakenByADID]
                    .SendMail(message, saveToSentItems)
                    .Request()
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                    .PostAsync();
                return true;

            }
            return false;
        }

        public async Task<bool> SendReassignAllTaskNotificationViaEmail(IEnumerable<TaskDetailsModel> taskDetailsList)
        {
            if (taskDetailsList != null && taskDetailsList.Any())
            {
                var subject = "The following task has been re-assigned to you";
                var body = "";
                IList<Recipient> recipients = new List<Recipient>();
                //IList<Recipient> recipientsCc = new List<Recipient>();

                // add recipients
                recipients.Add(new Recipient
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = taskDetailsList.First().AssignedToEmail,
                        Name = taskDetailsList.First().AssignedTo
                    }
                });

                StringBuilder sbBody = new StringBuilder();
                var count = 1;
                foreach (var eachTask in taskDetailsList)
                {
                    sbBody.Append($"<b>Task</b>: {count}<br>");
                    sbBody.Append($"<span>&nbsp;&nbsp;</span><b>Meeting Title</b> - {eachTask.MeetingTitle}");
                    sbBody.Append($"<br>");
                    sbBody.Append($"<span>&nbsp;&nbsp;</span><b>Re-assigned By</b> - {eachTask.ActionTakenBy}");
                    sbBody.Append($"<br>");
                    sbBody.Append($"<span>&nbsp;&nbsp;</span><b>Issue Discussed</b> - {eachTask.TaskContext}");
                    sbBody.Append($"<br>");
                    sbBody.Append($"<span>&nbsp;&nbsp;</span><b>Action Planned</b> - {eachTask.TaskActionPlan}");
                    sbBody.Append($"<br>");
                    sbBody.Append($"<span>&nbsp;&nbsp;</span><b>Completion Date</b> - {((DateTime)(eachTask.TaskClosureDate)).ToString("dd/MM/yyyy")}");
                    sbBody.Append($"<br>");
                    body = sbBody.ToString();
                    count = count + 1;
                }

                var saveToSentItems = false;
                var message = new Message();
                message.Subject = subject;
                message.Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = body
                };
                message.ToRecipients = recipients;
                //message.CcRecipients = recipientsCc;

                await this.graphServiceClient
                    .Users[taskDetailsList.First().ActionTakenByADID]
                    .SendMail(message, saveToSentItems)
                    .Request()
                    .Header(MeetingApp.Constants.PermissionTypeKey, GraphPermissionType.Application.ToString())
                    .PostAsync();
                return true;
            }
            return false;
        }
    }
}
