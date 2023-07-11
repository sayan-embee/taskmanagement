namespace Pidilite.TeamsApp.MeetingApp.Bot
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Localization;
    using Microsoft.Bot.Connector.Authentication;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Graph;
    using Microsoft.Identity.Client;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.TokenCacheProviders.InMemory;
    using Microsoft.IdentityModel.Tokens;
    using Pidilite.TeamsApp.MeetingApp.Bot.Authentication;
    using Pidilite.TeamsApp.MeetingApp.Bot.Bots;
    using Pidilite.TeamsApp.MeetingApp.Common.Extensions;
    using Pidilite.TeamsApp.MeetingApp.Bot.Models;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph;
    using Pidilite.TeamsApp.MeetingApp.DataAccess.Data;
    using Pidilite.TeamsApp.MeetingApp.DataAccess.DbAccess;
    using Pidilite.TeamsApp.MeetingApp.Bot.Helper;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.AzureBlob;
    using Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Teams;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Teams;
    using Pidilite.TeamsApp.MeetingApp.Bot.Helpers.Tasks;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MicrosoftGraph.Tasks;
    using Pidilite.TeamsApp.MeetingApp.Bot.Helpers.TokenHelper;
    using Pidilite.TeamsApp.MeetingApp.Bot.Services.MSGroups;

    /// <summary>
    /// Class to extend ServiceCollection.
    /// </summary>
    public static class ServicesExtension
    {
        /// <summary>
        /// Adds application configuration settings to specified IServiceCollection.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        /// <param name="configuration">Application configuration properties.</param>
        public static void RegisterConfigurationSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<BotSettings>(options =>
            {
                options.AppBaseUri = configuration.GetValue<string>("App:AppBaseUri");
                options.ManifestId = configuration.GetValue<string>("App:ManifestId");
                options.MicrosoftAppId = configuration.GetValue<string>("MicrosoftAppId");
                options.MicrosoftAppPassword = configuration.GetValue<string>("MicrosoftAppPassword");
                options.CardCacheDurationInHour = configuration.GetValue<int>("App:CardCacheDurationInHour");
            });

            services.Configure<AzureSettings>(options =>
            {
                options.TenantId = configuration.GetValue<string>("AzureAd:TenantId");
                options.ClientId = configuration.GetValue<string>("AzureAd:ClientId");
                options.ApplicationIdURI = configuration.GetValue<string>("AzureAd:ApplicationIdURI");
                options.ValidIssuers = configuration.GetValue<string>("AzureAd:ValidIssuers");
                options.Instance = configuration.GetValue<string>("AzureAd:Instance");
                options.GraphScope = configuration.GetValue<string>("AzureAd:GraphScope");
            });

            services.Configure<AzureBlobSettings>(options =>
            {
                options.StorageConnectionString = configuration.GetValue<string>("AzureBlobSettings:StorageConnectionString");
                options.ContainerName = configuration.GetValue<string>("AzureBlobSettings:ContainerName");
            });
        }
       
        /// <summary>
        /// Registers helpers for DB operations.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        public static void RegisterHelpers(this IServiceCollection services)
        {
            services.AddTransient<IAppLifecycleHandler, AppLifecycleHandler>();
            services.AddTransient<IUserHelper, UserHelper>();
            services.AddTransient< IRoomHelper, RoomHelper > ();
            services.AddTransient<ITeamsHelper, TeamsHelper>();
            services.AddTransient<ITaskHelper, TaskHelper>();
            services.AddTransient<INotificationHelper, NotificationHelper>();
            services.AddTransient<ITokenHelper, TokenHelper>();
        }
         
        /// <summary>
        /// Registers services such as MS Graph, token acquisition etc.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        public static void RegisterGraphServices(this IServiceCollection services)
        {
            //// Add microsoft graph services.
            services.AddScoped<IAuthenticationProvider, GraphTokenProvider>();
            services.AddScoped<IGraphServiceClient, GraphServiceClient>();           
            services.AddScoped<IGraphServiceFactory, GraphServiceFactory>();
            services.AddScoped<IUsersService>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetUsersService());
            services.AddScoped<IRoomService>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetRoomService());
            services.AddScoped<ITeamsServices>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetTeamsService());
            services.AddScoped<ITaskServices>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetTaskService());
            services.AddScoped<IGroupsService>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetGroupsService());
            services.AddScoped<IMSGroupService>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetMSGroupsService());
        }

        /// <summary>
        /// Adds services to specified IServiceCollection.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        public static void RegisterServices(this IServiceCollection services)
        {
            //Adding Services 
            services.AddSingleton<ISQLDataAccess, SQLDataAccess>();
            services.AddScoped<IFileExtensionData, FileExtensionData>();
            services.AddScoped<IConversationData, ConversationData>();
            services.AddScoped<ITimeZoneData, TimeZoneData>();
            services.AddScoped<ITaskDetailsData, TaskDetailsData>();
            services.AddSingleton<IAdaptiveCardService, AdaptiveCardService>();
            services.AddSingleton<IAzureBlobService, AzureBlobService>();
        }

        /// <summary>
        /// Adds credential providers for authentication.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        /// <param name="configuration">Application configuration properties.</param>
        public static void RegisterCredentialProviders(this IServiceCollection services, IConfiguration configuration)
        {
            ICredentialProvider credentialProvider = new SimpleCredentialProvider(
                appId: configuration.GetValue<string>("MicrosoftAppId"),
                password: configuration.GetValue<string>("MicrosoftAppPassword"));

            services
                .AddSingleton(credentialProvider);
        }

        public static void RegisterAuthenticationServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            services.AddProtectedWebApi(configuration)
                .AddProtectedWebApiCallsProtectedWebApi(configuration)
                .AddInMemoryTokenCaches();

            // This works specifically for single tenant application.
            var azureSettings = new AzureSettings();
            configuration.Bind("AzureAd", azureSettings);
            services.Configure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.Authority = $"{azureSettings.Instance}/{azureSettings.TenantId}/v2.0";
                options.SaveToken = true;
                options.TokenValidationParameters.ValidAudiences = new List<string> { azureSettings.ClientId, azureSettings.ApplicationIdURI.ToUpperInvariant() };
                options.TokenValidationParameters.AudienceValidator = AudienceValidator;
                options.TokenValidationParameters.ValidIssuers = (azureSettings.ValidIssuers?
                    .Split(new char[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)?
                    .Select(p => p.Trim())).Select(validIssuer => validIssuer.Replace("TENANT_ID", azureSettings.TenantId, StringComparison.OrdinalIgnoreCase));
            });

            //RegisterAuthorizationPolicy(services);
        }

        /// <summary>
        /// Add confidential credential provider to access API.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        /// <param name="configuration">Application configuration properties.</param>
        public static void RegisterConfidentialCredentialProvider(this IServiceCollection services, IConfiguration configuration)
        {
            configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            IConfidentialClientApplication confidentialClientApp = ConfidentialClientApplicationBuilder.Create(configuration["MicrosoftAppId"])
                .WithClientSecret(configuration["MicrosoftAppPassword"])
                .Build();
            services.AddSingleton<IConfidentialClientApplication>(confidentialClientApp);
        }

        /// <summary>
        /// Adds localization settings to specified IServiceCollection.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        /// <param name="configuration">Application configuration properties.</param>
        public static void RegisterLocalizationSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddLocalization();
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var defaultCulture = CultureInfo.GetCultureInfo(configuration.GetValue<string>("i18n:DefaultCulture"));
                var supportedCultures = configuration.GetValue<string>("i18n:SupportedCultures").Split(',')
                    .Select(culture => CultureInfo.GetCultureInfo(culture))
                    .ToList();

                options.DefaultRequestCulture = new RequestCulture(defaultCulture);
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;

                options.RequestCultureProviders = new List<IRequestCultureProvider>
                {
                    new MeetingAppLocalizationCultureProvider(),
                };
            });
        }

        private static bool AudienceValidator(
            IEnumerable<string> tokenAudiences,
            SecurityToken securityToken,
            TokenValidationParameters validationParameters)
        {
            if (tokenAudiences.IsNullOrEmpty())
            {
                throw new ApplicationException("No audience defined in token!");
            }

            var validAudiences = validationParameters.ValidAudiences;
            if (validAudiences.IsNullOrEmpty())
            {
                throw new ApplicationException("No valid audiences defined in validationParameters!");
            }

            return tokenAudiences.Intersect(tokenAudiences).Any();
        }
    }
}