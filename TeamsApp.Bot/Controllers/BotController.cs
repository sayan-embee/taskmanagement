// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Generated with Bot Builder V4 SDK Template for Visual Studio EchoBot v4.15.0

using Microsoft.AspNetCore.Mvc;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using System;
using System.Threading.Tasks;
using TeamsApp.Bot.Bots;

namespace TeamsApp.Bot.Controllers
{
    // This ASP Controller is created to handle a request. Dependency Injection will provide the Adapter and IBot
    // implementation at runtime. Multiple different IBot implementations running at different endpoints can be
    // achieved by specifying a more specific type for the bot constructor argument.
    [Route("api/messages")]
    [ApiController]
    public class BotController : ControllerBase
    {
        private readonly IBotFrameworkHttpAdapter Adapter;

        private readonly IBot Users;
        private readonly IBot Admin;

        public BotController(CommonBotAdapter adapter
            , AdminActivityHandler Admin
            , UserActivityHandler Users)
        {
            this.Adapter = adapter ?? throw new ArgumentNullException(nameof(adapter));
            this.Admin = Admin ?? throw new ArgumentNullException(nameof(Admin));
            this.Users = Users ?? throw new ArgumentNullException(nameof(Users));
        }

        [HttpPost]
        [Route("admin")]
        public async Task PostAdminAppAsync()
        {
            await this.Adapter.ProcessAsync(this.Request, this.Response, this.Admin);
        }

        [HttpPost]
        [Route("users")]
        public async Task PostUserAppAsync()
        {
            await this.Adapter.ProcessAsync(this.Request, this.Response, this.Users);
        }
    }
}
