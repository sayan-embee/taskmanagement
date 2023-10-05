namespace TeamsApp.Bot
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
    using TeamsApp.Bot.Authentication;
    using TeamsApp.Bot.Bots;
    using TeamsApp.Common.Extensions;
    using TeamsApp.Bot.Models;
    using TeamsApp.Bot.Services.MicrosoftGraph;
    using TeamsApp.DataAccess.Data;
    using TeamsApp.DataAccess.DbAccess;
    using TeamsApp.Bot.Helper;
    using TeamsApp.Bot.Services.AzureBlob;
    using TeamsApp.Bot.Helpers.TokenHelper;
    using TeamsApp.Common.CommonBot;
    using System.Text;
    using TeamsApp.Bot.Services.MicrosoftGraph.Provider;
    using TeamsApp.Bot.Services.MicrosoftGraph.Users;
    using TeamsApp.Bot.Services.Notification;
    using TeamsApp.Bot.Helpers.NotificationHelper;
    using TeamsApp.Bot.Services.Email;
    using TeamsApp.Bot.Helpers.EmailHelper;
    using TeamsApp.Bot.Helpers.FileHelper;

    /// <summary>
    /// Class to extend ServiceCollection.
    /// </summary>
    public static class ServicesExtension
    {
        //public static void AddConfigurationSettings(this IServiceCollection services, IConfiguration configuration)
        //{
        //    services.Configure<OAuthSettings>(options => configuration.GetSection("OAuth").Bind(options));
        //    services.Configure<TokenSettings>(options => configuration.GetSection("Token").Bind(options));
        //}

        /// <summary>
        /// Adds application configuration settings to specified IServiceCollection.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        /// <param name="configuration">Application configuration properties.</param>
        public static void RegisterConfigurationSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<BotOptions>(options =>
            {
                options.AdminAppId = configuration.GetValue<string>("AdminApp:ClientId");
                options.AdminAppPassword = configuration.GetValue<string>("AdminApp:ClientSecret");
                //options.RiseAdminManifestId = configuration.GetValue<string>("AdminApp:ManifestId");

                options.UserAppId = configuration.GetValue<string>("UserApp:ClientId");
                options.UserAppPassword = configuration.GetValue<string>("UserApp:ClientSecret");
                //options.RiseUserManifestId = configuration.GetValue<string>("UserApp:ManifestId");

                //options.CardCacheDurationInHour = configuration.GetValue<int>("App:CardCacheDurationInHour");
            });
            services.Configure<BotSettings>(options =>
            {
                options.AppBaseUri = configuration.GetValue<string>("App:AppBaseUri");
                options.ManifestId = configuration.GetValue<string>("App:ManifestId");

                //options.MicrosoftAppId = configuration.GetValue<string>("MicrosoftAppId");
                //options.MicrosoftAppPassword = configuration.GetValue<string>("MicrosoftAppPassword");

                options.AdminAppId = configuration.GetValue<string>("AdminApp:ClientId");
                options.AdminAppPassword = configuration.GetValue<string>("AdminApp:ClientSecret");
                options.AdminManifestId = configuration.GetValue<string>("AdminApp:ManifestId");

                options.UserAppId = configuration.GetValue<string>("UserApp:ClientId");
                options.UserAppPassword = configuration.GetValue<string>("UserApp:ClientSecret");
                options.UserManifestId = configuration.GetValue<string>("UserApp:ManifestId");

                options.CardCacheDurationInHour = configuration.GetValue<int>("App:CardCacheDurationInHour");
            });

            services.Configure<BotSettingsAdmin>(options =>
            {
                options.AdminAppId = configuration.GetValue<string>("AdminApp:ClientId");
                options.AdminAppPassword = configuration.GetValue<string>("AdminApp:ClientSecret");
                options.AdminManifestId = configuration.GetValue<string>("AdminApp:ManifestId");
            });

            services.Configure<BotSettingsUser>(options =>
            {
                options.UserAppId = configuration.GetValue<string>("UserApp:ClientId");
                options.UserAppPassword = configuration.GetValue<string>("UserApp:ClientSecret");
                options.UserManifestId = configuration.GetValue<string>("UserApp:ManifestId");
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
            services.AddTransient<ITokenHelper, TokenHelper>();
            services.AddTransient<INotificationHelper, NotificationHelper>();
            services.AddTransient<IEmailHelper, EmailHelper>();
            services.AddTransient<IFileHelper, FileHelper>();
        }

        public static void AddCustomJWTAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
               .AddJwtBearer(options =>
               {
                   options.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateAudience = true,
                       ValidAudiences = new List<string> { configuration.GetSection("Bot")["AppBaseUri"] },
                       ValidIssuers = new List<string> { configuration.GetSection("Bot")["AppBaseUri"] },
                       ValidateIssuer = true,
                       ValidateIssuerSigningKey = true,
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration.GetSection("Token")["SecurityKey"])),
                       RequireExpirationTime = true,
                       ValidateLifetime = true,
                       ClockSkew = TimeSpan.FromSeconds(30),
                   };
               });
        }


        /// <summary>
        /// Registers services such as MS Graph, token acquisition etc.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        public static void RegisterGraphServices(this IServiceCollection services)
        {
            //// Add microsoft graph services.
            services.AddSingleton<IGraphServiceClientProvider, GraphServiceClientProvider>();
            //services.AddScoped<IGraphServiceClient, GraphServiceClient>();
            //services.AddScoped<IGraphServiceFactory, GraphServiceFactory>();
            services.AddSingleton<IUsersService, UsersService>();
            //services.AddScoped<IUsersService>(sp => sp.GetRequiredService<IGraphServiceFactory>().GetUsersService());
        }

        /// <summary>
        /// Adds services to specified IServiceCollection.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        public static void RegisterServices(this IServiceCollection services)
        {
            //Adding Services            
            services.AddSingleton<ISQLDataAccess, SQLDataAccess>();
            services.AddScoped<IConversationData, ConversationData>();
            services.AddSingleton<IAdaptiveCardService, AdaptiveCardService>();
            services.AddSingleton<IAzureBlobService, AzureBlobService>();            
        }

        public static void RegisterDataServices(this IServiceCollection services)
        {
            //Adding Services
            services.AddScoped<ICategoryData, CategoryData>();
            services.AddScoped<IMasterAPIData, MasterAPIData>();
            services.AddScoped<ITaskData, TaskData>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IEmailService, EmailService>();
        }

        /// <summary>
        /// Adds credential providers for authentication.
        /// </summary>
        /// <param name="services">Collection of services.</param>
        /// <param name="configuration">Application configuration properties.</param>
        public static void RegisterCredentialProviders(this IServiceCollection services, IConfiguration configuration)
        {
            //ICredentialProvider credentialProvider = new SimpleCredentialProvider(
            //    appId: configuration.GetValue<string>("MicrosoftAppId"),
            //    password: configuration.GetValue<string>("MicrosoftAppPassword"));

            //services
            //    .AddSingleton(credentialProvider);
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

            //IConfidentialClientApplication confidentialClientApp = ConfidentialClientApplicationBuilder.Create(configuration["MicrosoftAppId"])
            //    .WithClientSecret(configuration["MicrosoftAppPassword"])
            //    .Build();
            //services.AddSingleton<IConfidentialClientApplication>(confidentialClientApp);
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