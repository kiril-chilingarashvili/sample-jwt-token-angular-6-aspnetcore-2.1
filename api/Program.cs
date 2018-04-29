using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Refactorx.Host
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost().Run();
        }

        public static string AssemblyDirectory
        {
            get
            {
                string codeBase = System.Reflection.Assembly.GetExecutingAssembly().CodeBase;
                UriBuilder uri = new UriBuilder(codeBase);
                string path = Uri.UnescapeDataString(uri.Path);
                return Path.GetDirectoryName(path);
            }
        }

        public static IWebHost BuildWebHost()
        {
            Console.WriteLine($"Starting at directory: {AssemblyDirectory}");
            var config = new ConfigurationBuilder()
                .SetBasePath(AssemblyDirectory)
                .AddJsonFile("appsettings.json", true)
                .Build();

            return new WebHostBuilder()
                .UseKestrel()
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseConfiguration(config)
                .Build();
        }
    }
}
