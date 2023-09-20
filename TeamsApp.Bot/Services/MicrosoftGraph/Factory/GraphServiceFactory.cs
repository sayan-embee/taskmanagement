
namespace TeamsApp.Bot.Services.MicrosoftGraph
{
    using System;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.Graph;

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
        //public IUsersService GetUsersService()
        //{
        //    return new UsersService(this.serviceClient, this.configuration);
        //}
    }
}
