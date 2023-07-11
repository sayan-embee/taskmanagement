﻿using System.Threading.Tasks;

namespace Pidilite.TeamsApp.MeetingApp.Bot.Helpers.TokenHelper
{
    /// <summary>
    /// Helper for custom JWT token generation and retrieval of user access token.
    /// </summary>
    public interface ITokenHelper
    {
        /// <summary>
        /// Generate JWT token used by client application to authenticate HTTP calls with API.
        /// </summary>
        /// <param name="applicationBasePath">Service URL from bot.</param>
        /// <param name="fromId">Unique Id from activity.</param>
        /// <param name="jwtExpiryMinutes">Expiry of token.</param>
        /// <returns>JWT token.</returns>
        string GenerateAPIAuthToken(string applicationBasePath, string fromId, int jwtExpiryMinutes);
    }
}