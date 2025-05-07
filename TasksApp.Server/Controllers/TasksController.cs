using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TasksApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        [HttpGet("getTask")]
        public IActionResult Get() 
        {
            return Ok();
        }
    }
}
