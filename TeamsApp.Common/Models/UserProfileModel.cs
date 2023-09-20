using System;
using System.Collections.Generic;
using System.Text;

namespace TeamsApp.Common.Models
{
    public class UserProfileModel
    {       
        /// <summary>
        /// Gets or sets the user object Id.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets DisplayName name of user.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets email of user.
        /// </summary>
        public string Mail { get; set; }

        /// <summary>
        /// Gets or sets GivenName of user.
        /// </summary>
        public string GivenName { get; set; }

        /// <summary>
        /// Gets or sets UserPrincipalName of user.
        /// </summary>
        public string UserPrincipalName { get; set; }

        /// <summary>
        /// Gets or sets Photo of user.
        /// </summary>
        public string Photo { get; set; }

        /// <summary>
        /// Gets or sets Vertical of user.
        /// </summary>
        public string Vertical { get; set; }

        /// <summary>
        /// Gets or sets Deparment of user.
        /// </summary>
        public string Division { get; set; }

        /// <summary>
        /// Gets or sets Job Title of user.
        /// </summary>
        public string JobTitle { get; set; }
    }
}
