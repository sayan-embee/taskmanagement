
namespace Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph
{
    using System;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.Graph;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Tasks;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MSGroups;

    /// <summary>
    /// Graph Service Factory.
    /// </summary>
    public class GraphServiceFactory : IGraphServiceFactory
    {
        private readonly IGraphServiceClient serviceClient;
        private readonly IConfiguration configuration;
        private readonly ILogger<Object> logger;
        /// <summary>
        /// Initializes a new instance of the <see cref="GraphServiceFactory"/> class.
        /// </summary>
        /// <param name="serviceClient">V1 Graph service client.</param>
        public GraphServiceFactory(
            IGraphServiceClient serviceClient, IConfiguration configuration, ILogger<Object> logger)
        {
            this.serviceClient = serviceClient ?? throw new ArgumentNullException(nameof(serviceClient));
            this.configuration = configuration ?? throw new ArgumentException(nameof(configuration));
            this.logger = logger;
        }

        /// <inheritdoc/>
        public IUsersService GetUsersService()
        {
            return new UsersService(this.serviceClient, this.configuration);
        }

        public IRoomService GetRoomService()
        {
            return new RoomService(this.serviceClient);
        }

        public ITeamsServices GetTeamsService()
        {
            return new TeamsServices(this.serviceClient);
        }

        public ITaskServices GetTaskService()
        {
            return new TaskServices(this.serviceClient);
        }
        /// <inheritdoc/>
        public IGroupsService GetGroupsService()
        {
            return new GroupsService(this.serviceClient);
        }

        public IMSGroupService GetMSGroupsService()
        {
            return new MSGroupService(this.serviceClient);
        }


        /// <inheritdoc/>
        //public IGroupsService GetGroupsService()
        //{
        //    return new GroupsService(this.serviceClient);
        //}

        /// <inheritdoc/>
        public IGroupMembersService GetGroupMembersService()
        {
            return new GroupMembersService(this.serviceClient);
        }

        /// <inheritdoc/>
        public IChatsService GetChatsService()
        {
            return new ChatsService(this.serviceClient, this.GetAppManagerService());
        }

        /// <inheritdoc/>
        public IAppManagerService GetAppManagerService()
        {
            return new AppManagerService(this.serviceClient);
        }

        /// <inheritdoc/>
        public IAppCatalogService GetAppCatalogService()
        {
            return new AppCatalogService(this.serviceClient);
        }
    }
}
