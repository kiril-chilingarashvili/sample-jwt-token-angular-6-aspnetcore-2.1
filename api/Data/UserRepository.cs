using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Refactorx.Host
{
    public class UserRepository
    {
        private readonly IConfigurationRoot _config;
        // in memory refresh token structure
        // obviously not thread safe and not for production
        private static Dictionary<string, UserModel> _refreshTokens = new Dictionary<string, UserModel>();
        private static Dictionary<string, (string, string)> _logins = new Dictionary<string, (string, string)>();

        static UserRepository()
        {
            _logins.Add("Kirill", ("123", "Kirill Chilingarashvili"));
        }

        public class UserModel
        {
            public string Username { get; set; }
            public string FullName { get; set; }
            public string RefreshToken { get; set; }
            public List<string> _roles = new List<string>();
            public IEnumerable<string> Roles => _roles;

            internal bool IsInRole(string Role)
            {
                return _roles.Contains(Role);
            }
        }

        public UserRepository(IConfigurationRoot config)
        {
            _config = config;
        }

        public UserModel GetUser(string refreshToken)
        {
            if (!String.IsNullOrEmpty(refreshToken) && _refreshTokens.ContainsKey(refreshToken))
            {
                return _refreshTokens[refreshToken];
            }
            return null;
        }

        public UserModel Validate(string username, string password)
        {
            if(!String.IsNullOrEmpty(username) && _logins.ContainsKey(username) && _logins[username].Item1 == password)
            {
                var model = new UserModel
                {
                    Username = username,
                    FullName = _logins[username].Item2,
                    RefreshToken = Guid.NewGuid().ToString()
                };
                _refreshTokens.Add(model.RefreshToken, model);
                return model;
            }
            return null;
        }
    }
}
