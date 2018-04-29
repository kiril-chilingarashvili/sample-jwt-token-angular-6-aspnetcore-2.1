using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Refactorx.Host
{
    [Authorize]
    public class SecuredController : Controller
    {
        public class SecuredVm
        {
            public string Text { get; set; }
        }
        [HttpGet("api/secured")]
        public SecuredVm Get()
        {
            return new SecuredVm
            {
                Text = $"Sensitive data for {User.Identity.Name}, Time: {DateTime.Now}"
            };
        }
    }
}
