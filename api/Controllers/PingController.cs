using Microsoft.AspNetCore.Mvc;

namespace Refactorx.Host
{
    public class PingController : Controller
    {
        [HttpPost("ping")]
        [HttpPost("api/ping")]
        [HttpGet("ping")]
        [HttpGet("api/ping")]
        public string Get()
        {
            return "ok";
        }
    }
}
