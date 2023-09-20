// <copyright file="TokenHelper.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.ApplicationInsights;
using Microsoft.Bot.Connector;
using TeamsApp.Bot.Models;
using TeamsApp.Common.Models;
using Microsoft.Extensions.Configuration;

namespace TeamsApp.Bot.Helpers.TokenHelper
{
    /// <summary>
    /// Helper class for JWT token generation and validation.
    /// </summary>
    public class TokenHelper : ITokenHelper
    {
        private readonly string securityKey;
        private readonly string appBaseUri;


        /// <summary>
        /// Telemetry client to log event and errors.
        /// </summary>
        private readonly TelemetryClient telemetryClient;

        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="TokenHelper"/> class.
        /// </summary>
        /// <param name="remoteSupportActivityHandlerOptions">A set of key/value application configuration properties for Remote Support bot.</param>
        /// <param name="tokenOptions">A set of key/value application configuration properties for token.</param>
        public TokenHelper(
            IOptionsMonitor<TokenOptions> tokenOptions,TelemetryClient telemetryClient, IConfiguration configuration)
        {
            tokenOptions = tokenOptions ?? throw new ArgumentNullException(nameof(tokenOptions));
            this.telemetryClient = telemetryClient;
            this.configuration = configuration;
            this.securityKey = configuration.GetValue<string>("AzureAd:ClientSecret");
            this.appBaseUri = configuration.GetValue<string>("App:AppBaseUri");
        }

        /// <summary>
        /// Generate JWT token used by client application to authenticate HTTP calls with API.
        /// </summary>
        /// <param name="applicationBasePath">Service URL from bot.</param>
        /// <param name="fromId">Unique Id from activity.</param>
        /// <param name="jwtExpiryMinutes">Expiry of token.</param>
        /// <returns>JWT token.</returns>
        public string GenerateAPIAuthToken(string applicationBasePath, string fromId, int jwtExpiryMinutes)
        {
            SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(this.securityKey));
            SigningCredentials signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            SecurityTokenDescriptor securityTokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(
                    new List<Claim>()
                    {
                        new Claim("applicationBasePath", applicationBasePath),
                        new Claim("fromId", fromId),
                    }, "Custom"),
                NotBefore = DateTime.UtcNow,
                SigningCredentials = signingCredentials,
                Issuer = this.appBaseUri,
                Audience = this.appBaseUri,
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(jwtExpiryMinutes),
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(securityTokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
