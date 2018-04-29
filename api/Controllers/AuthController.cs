using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Refactorx.Host
{
    [Authorize]
    public class AuthController : Controller
    {
        private readonly string _host;
        private readonly UserRepository _userRepository;

        public AuthController(
            IConfigurationRoot config,
            UserRepository userRepository)
        {
            _userRepository = userRepository;
            _host = config["Information:Host"]; 
        }

        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string RefreshToken { get; set; }
        }

        private UserRepository.UserModel ValidateUser(LoginModel model)
        {
            if (model != null)
            {
                if (!String.IsNullOrEmpty(model.RefreshToken))
                {
                    var user = _userRepository.GetUser(model.RefreshToken);
                    if (user != null)
                    {
                        return user;
                    }
                }
                else if (!String.IsNullOrEmpty(model.Username) &&
                    !String.IsNullOrEmpty(model.Password))
                {
                    var user = _userRepository.Validate(model.Username, model.Password);
                    if (user != null)
                    {
                        return user;
                    }
                }
            }
            return null;
        }

        [AllowAnonymous]
        [HttpPost("auth/login")]
        [HttpPost("api/auth/login")]
        public Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = ValidateUser(model);
            if (user != null)
            {
                var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                // TODO: for testing purposes - token will expire every 20 seconds
                // use reasonable value in production
                var expiration = DateTime.Now.AddSeconds(20);
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                    new Claim(System.Security.Claims.ClaimTypes.Name, user.Username),

                    new Claim("FullName", user.FullName),
                    //new Claim("Roles", String.Join(",", user.Roles)),
                    //new Claim("Claims", String.Join(",", user.Claims)),
                };

                var signingKey = new SigningKey().Key;

                var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.RsaSha256);

                var tokenHandler = new JwtSecurityTokenHandler();
                var now = DateTime.UtcNow;

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Issuer = _host,
                    Audience = _host,

                    Expires = expiration,
                    SigningCredentials = signingCredentials,
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);

                var encodedJwt = tokenHandler.WriteToken(token);

                var refreshTokenKey = user.RefreshToken;
                return Task.FromResult<IActionResult>(Ok(new
                {
                    access_token = encodedJwt,
                    refresh_token = refreshTokenKey
                }));
            }

            return Task.FromResult<IActionResult>(Unauthorized());
        }
    }
}
