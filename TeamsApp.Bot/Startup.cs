// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Generated with Bot Builder V4 SDK Template for Visual Studio EchoBot v4.15.0

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using TeamsApp.Common.Models;
using TeamsApp.DataAccess.DbAccess;
using TeamsApp.DataAccess.Data;
using AspNetCoreRateLimit;
using Microsoft.ApplicationInsights;
using TeamsApp.Bot.Models;
using System;
using Azure.Security.KeyVault.Secrets;
using Azure.Identity;
using TeamsApp.Bot.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.IdentityModel.Tokens;
using TeamsApp.Bot.Helper;
using Microsoft.Bot.Builder.BotFramework;
using TeamsApp.Bot.Bots;
using TeamsApp.Common.Services.CommonBot;
using Microsoft.Bot.Connector;

namespace TeamsApp.Bot
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            this._configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            var useKeyVault = this._configuration.GetValue<bool>("UseKeyVault");

            if (useKeyVault)
            {
                this.GetKeyVaultByManagedServiceIdentity();
            }

            this.ValidateConfigurationSettings();
        }

        public IConfiguration _configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            // Add all options set from configuration values.
            services.AddOptions<AuthenticationOptions>()
                .Configure<IConfiguration>((authenticationOptions, configuration) =>
                {
                    Startup.FillAuthenticationOptionsProperties(authenticationOptions, configuration);
                });

            //services.AddSingleton(
            //    new MicrosoftAppCredentials(
            //         this._configuration.GetValue<string>("AzureAd:ClientId"),
            //         this._configuration.GetValue<string>("AzureAd:ClientSecret")));

            services.AddSingleton(new MicrosoftAppCredentials(this._configuration["MicrosoftAppId"], this._configuration["MicrosoftAppPassword"]));

            services.AddSingleton(provider => new OAuthClient((MicrosoftAppCredentials)provider.GetService(typeof(MicrosoftAppCredentials))));

            //Add Configuration 
            services.RegisterConfigurationSettings(this._configuration);

            //IP Rate Limiting
            services.AddMemoryCache();
            services.Configure<IpRateLimitOptions>(this._configuration.GetSection("IpRateLimiting"));
            services.AddInMemoryRateLimiting();

            services.AddControllers().AddNewtonsoftJson();


            services.AddMvc().AddMvcOptions(mvcopt => { mvcopt.EnableEndpointRouting = false; });

            services.RegisterCredentialProviders(this._configuration);
            services.RegisterConfidentialCredentialProvider(this._configuration);

            // Add authentication services.
            //AuthenticationOptions authenticationOptionsParameter = new AuthenticationOptions();
            //Startup.FillAuthenticationOptionsProperties(authenticationOptionsParameter, this._configuration);
            //services.AddAuthentication(this._configuration, authenticationOptionsParameter);
            //services.AddAuthentication(options =>
            //{
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            //})
            //    .AddJwtBearer(options =>
            //    {
            //        var azureAdOptions = new AzureADOptions();
            //        this._configuration.Bind("AzureAd", azureAdOptions);
            //        options.Authority = $"{azureAdOptions.Instance}{azureAdOptions.TenantId}/v2.0";
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            ValidAudiences = SSOAuthHelper.GetValidAudiences(this._configuration),
            //            ValidIssuers = SSOAuthHelper.GetValidIssuers(this._configuration),
            //            AudienceValidator = SSOAuthHelper.AudienceValidator
            //        };
            //    });

            services.RegisterAuthenticationServices(this._configuration);

            //Add Bot Services
            services.RegisterServices();

            //Add Helper Services
            services.RegisterHelpers();

            //Add Graph Servcies
            services.RegisterGraphServices();

            // Add Application Insights telemetry.
            services.AddApplicationInsightsTelemetry();
            //services.AddApplicationInsightsTelemetry(this._configuration.GetValue<string>("ApplicationInsights:InstrumentationKey"));

            services.AddSingleton<TelemetryClient>();

            // Create the Bot Framework Authentication to be used with the Bot Adapter.
            services.AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

            // Create the Bot Adapter with error handling enabled.
            services.AddTransient<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();

            services.AddTransient(serviceProvider => (BotFrameworkAdapter)serviceProvider.GetRequiredService<IBotFrameworkHttpAdapter>());

            // Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
            //services.AddSingleton<ICredentialProvider, ConfigurationCredentialProvider>();
            services.AddSingleton<AdminAppCredentials>();
            services.AddSingleton<UserAppCredentials>();
            services.AddSingleton<ICredentialProvider, Common.Services.CommonBot.ConfigurationCredentialProvider>();
            services.AddTransient<Bots.AdminActivityHandler>();
            services.AddTransient<Bots.UserActivityHandler>();
            services.AddSingleton<CommonBotAdapter>();
            services.AddSingleton<CommonBotFilterMiddleware>();

            services.AddMvc(options => options.EnableEndpointRouting = false);

            // Storage we'll be using for User and Conversation state. 
            services.AddSingleton<IStorage, MemoryStorage>();

            // Create the Conversation state.  
            services.AddSingleton<ConversationState>();


            //Register DataServcies
            services.RegisterDataServices();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

            services.RegisterLocalizationSettings(this._configuration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        //{
        //    /*app.UseExceptionHandler(applicationBuilder => this.HandleGlobalException(applicationBuilder));
        //    app.UseIpRateLimiting();
        //    if (env.IsDevelopment())
        //    {
        //        app.UseDeveloperExceptionPage();
        //    }
        //    else
        //    {
        //        app.UseHsts();
        //    }

        //    app.UseDefaultFiles()
        //        .UseStaticFiles()
        //        .UseWebSockets()
        //        .UseRouting()
        //        .UseAuthentication()
        //        .UseAuthorization()
        //        .UseMvc()
        //        .UseRequestLocalization()
        //        .UseEndpoints(endpoints =>
        //        {
        //            endpoints.MapControllers();
        //        });

        //   app.UseSpa(spa =>
        //    {
        //        spa.Options.SourcePath = "ClientApp";

        //        if (env.IsDevelopment())
        //        {
        //            spa.UseReactDevelopmentServer(npmScript: "start");
        //        }
        //    });
        //    */
        //    app.UseExceptionHandler(applicationBuilder => this.HandleGlobalException(applicationBuilder));
        //    app.UseIpRateLimiting();
        //    if (env.IsDevelopment())
        //    {
        //        app.UseDeveloperExceptionPage();
        //    }
        //    else
        //    {
        //        app.UseExceptionHandler("/Error");
        //        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        //        app.UseHsts();
        //    }
        //    app.UseDefaultFiles();
        //    app.UseStaticFiles();
        //    app.UseWebSockets();
        //    app.UseRouting();
        //    app.UseAuthentication();
        //    app.UseAuthorization();
        //    //app.UseHttpsRedirection();
        //    app.UseSpaStaticFiles();
        //    app.UseMvc();
        //    app.UseRequestLocalization();
        //    app.UseEndpoints(endpoints =>
        //    {
        //        endpoints.MapControllerRoute(
        //            name: "default",
        //            pattern: "{controller}/{action=Index}/{id?}");
        //    });

        //    app.UseSpa(spa =>
        //    {
        //        spa.Options.SourcePath = "ClientApp";

        //        if (env.IsDevelopment())
        //        {
        //            spa.UseReactDevelopmentServer(npmScript: "start");
        //        }
        //    });
        //}

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {



            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            app.UseExceptionHandler(applicationBuilder => this.HandleGlobalException(applicationBuilder));
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseWebSockets();
            app.UseAuthentication();
            app.UseSpaStaticFiles();
            app.UseRouting();
            app.UseCors("AllowOrigin");
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Custom API is running..."); // Replace with your custom message
                });



                endpoints.MapControllers();
            });



        }

        /// <summary>
        /// Validate whether the configuration settings are missing or not.
        /// </summary>
        private void ValidateConfigurationSettings()
        {
            var azureSettings = new AzureSettings();
            this._configuration.Bind("AzureAd", azureSettings);

            if (string.IsNullOrWhiteSpace(azureSettings.ClientId))
            {
                throw new ApplicationException("AzureAD ClientId is missing in the configuration file.");
            }

            if (string.IsNullOrWhiteSpace(azureSettings.TenantId))
            {
                throw new ApplicationException("AzureAD TenantId is missing in the configuration file.");
            }

            if (string.IsNullOrWhiteSpace(azureSettings.ApplicationIdURI))
            {
                throw new ApplicationException("AzureAD ApplicationIdURI is missing in the configuration file.");
            }

            if (string.IsNullOrWhiteSpace(azureSettings.ValidIssuers))
            {
                throw new ApplicationException("AzureAD ValidIssuers is missing in the configuration file.");
            }
        }

        /// <summary>
        /// Get KeyVault secrets and app settings values.
        /// </summary>
        private void GetKeyVaultByManagedServiceIdentity()
        {
            // Create a new secret client using the default credential from Azure.Identity using environment variables.
            var client = new SecretClient(
                vaultUri: new Uri($"{this._configuration["KeyVaultUrl:BaseURL"]}/"),
                credential: new DefaultAzureCredential());
            //this._configuration["MicrosoftAppId"] = client.GetSecret("MicrosoftAppId--SecretKey").Value.Value;
            //this._configuration["MicrosoftAppPassword"] = client.GetSecret("MicrosoftAppPassword--SecretKey").Value.Value;
            //this._configuration["AzureAd:ClientId"] = this._configuration["MicrosoftAppId"] = client.GetSecret("AzureAdClientId--SecretKey").Value.Value;
            //this._configuration["AzureAd:ClientSecret"] = this._configuration["MicrosoftAppPassword"] = client.GetSecret("AzureAdClientSecret--SecretKey").Value.Value;
            this._configuration["ConnectionStrings:Default"] = client.GetSecret("SQLConnectionStrings--SecretKey").Value.Value;

            this._configuration["AdminApp:ClientId"] = client.GetSecret("AdminAppId--SecretKey").Value.Value;
            this._configuration["AdminApp:ClientSecret"] = client.GetSecret("AdminAppPassword--SecretKey").Value.Value;

            this._configuration["UserApp:ClientId"] = client.GetSecret("UserAppId--SecretKey").Value.Value;
            this._configuration["UserApp:ClientSecret"] = client.GetSecret("UserAppPassword--SecretKey").Value.Value;
        }

        /// <summary>
        /// Handle exceptions happened in the HTTP process pipe-line.
        /// </summary>
        /// <param name="applicationBuilder">IApplicationBuilder instance, which is a class that provides the mechanisms to configure an application's request pipeline.</param>
        private void HandleGlobalException(IApplicationBuilder applicationBuilder)
        {
            applicationBuilder.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    var loggerFactory = applicationBuilder.ApplicationServices.GetService<ILoggerFactory>();
                    var logger = loggerFactory.CreateLogger(nameof(Startup));
                    logger.LogError($"{contextFeature.Error}");

                    await context.Response.WriteAsync(new
                    {
                        context.Response.StatusCode,
                        Message = "Internal Server Error.",
                    }.ToString());
                }
            });
        }

        /// <summary>
        /// Fills the AuthenticationOptions's properties with the correct values from the configuration.
        /// </summary>
        /// <param name="authenticationOptions">The AuthenticationOptions whose properties will be filled.</param>
        /// <param name="configuration">The configuration.</param>
        private static void FillAuthenticationOptionsProperties(AuthenticationOptions authenticationOptions, IConfiguration configuration)
        {
            // NOTE: This AzureAd:Instance configuration setting does not need to be
            // overridden by any deployment specific value. It can stay the default value
            // that is set in the project's configuration.
            authenticationOptions.AzureAdInstance = configuration.GetValue<string>("AzureAd:Instance");

            authenticationOptions.AzureAdTenantId = configuration.GetValue<string>("AzureAd:TenantId");
            authenticationOptions.AzureAdClientId = configuration.GetValue<string>("AzureAd:ClientId");
            authenticationOptions.AzureAdApplicationIdUri = configuration.GetValue<string>("AzureAd:ApplicationIdUri");

            // NOTE: This AzureAd:ValidIssuers configuration setting does not need to be
            // overridden by any deployment specific value. It can stay the default value
            // that is set in the project's configuration.
            authenticationOptions.AzureAdValidIssuers = configuration.GetValue<string>("AzureAd:ValidIssuers");
        }

    }
}
