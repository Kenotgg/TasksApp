using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TasksApp.Server.Models;
using TasksApp.Server.Services.Interfaces;

namespace TasksApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        ITasksService _tasksService;
        public TasksController(ITasksService tasksService) 
        {
            _tasksService = tasksService;
        }


        [HttpGet("getTasks")]
        public async Task<IActionResult> GetAll() 
        {
            var tasks = await _tasksService.GetAll();
            return Ok(tasks);
        }

        [HttpPost("addTask")]
        public async Task<IActionResult> Add(TaskModel taskModel) 
        {
            var model = await _tasksService.Add(taskModel);
            return Ok(model);
        }
    }
}
