using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Reflection;
using Newtonsoft.Json.Serialization;
using System.Security.Principal;
using System.Collections.Generic;
using System.Threading;

namespace Refactorx.Host
{
    public class Startup
    {
        public static IConfigurationRoot _config { get; private set; }
        private IHostingEnvironment _env;

        public Startup(IHostingEnvironment env)
        {
            _env = env;
            Console.WriteLine(env.ContentRootPath);
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            _config = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(_config);
            services.AddSingleton(new UserRepository(_config));

            // auth
            services.AddAuthentication((options =>
            {
                options.DefaultScheme = IdentityConstants.ApplicationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            }))
            .AddJwtBearer(options =>
            {
                var host = _config["Information:Host"];
                options.Authority = host;
                options.Audience = host;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidAudience = host,
                    ValidateAudience = false,
                    ValidIssuer = host,
                    IssuerSigningKey = new SigningKey().Key,
                    RequireSignedTokens = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    NameClaimType = System.Security.Claims.ClaimTypes.Name,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
                };
                options.Configuration = new Microsoft.IdentityModel.Protocols.OpenIdConnect.OpenIdConnectConfiguration()
                {
                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = (context) =>
                    {
                        var accessToken = context.SecurityToken as JwtSecurityToken;
                        if (accessToken != null)
                        {
                            Console.WriteLine(accessToken.ToString());
                        }
                        return Task.FromResult(0);
                    },
                };
            });

            services.AddMvc()
            .AddJsonOptions(options =>
            {
                var settings = options.SerializerSettings;
                settings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                settings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                settings.DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate;
                settings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter { CamelCaseText = true });
            });
        }

        public void Configure(
            IApplicationBuilder app,
            IHostingEnvironment env,
            ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();

            app.UseMvc();
        }
    }
}
