using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TasksApp.Server.Models;
using TasksApp.Server.Services.Interfaces;

namespace TasksApp.Server.Controllers
{
    //Контроллер HTTP запросов к сервисам приложения
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        //Получаем доступ к сервису через зависимость
        ITasksService _tasksService;
        public TasksController(ITasksService tasksService) 
        {
            _tasksService = tasksService;
        }
        //Получить все задачи
        [HttpGet("getTasks")]
        public async Task<IActionResult> GetAll() 
        {
            var tasks = await _tasksService.GetAll();
            return Ok(tasks);
        }
        //Добавить задачу
        [HttpPost("addTask")]
        public async Task<IActionResult> Add(TaskModel taskModel) 
        {
            var model = await _tasksService.Add(taskModel);
            return Ok(model);
        }
        //Изменить состояние выполнения задачи
        [HttpPut("EditTaskCompletion")]
        public async Task<IActionResult> ChangeCompletionState(int id, bool isCompleted) 
        {
            var changedTask = await _tasksService.ChangeCompletionState(id, isCompleted);  
            return Ok(changedTask);
        }
        //Удалить задачу
        [HttpDelete("removeTask")]
        public async Task<IActionResult> RemoveTask(int id)
        {
            var removedTaskMessage = await _tasksService.RemoveTask(id); 
            if(removedTaskMessage == "Task was removed") 
            {
                return Ok(removedTaskMessage);
            }
            else 
            {
                return NotFound(removedTaskMessage);
            }
        }
        //Изменить задачу
        [HttpPut("editTask")]
        public async Task<IActionResult> EditTask(int id, string title, string description, DateTime dueDate, string priority, string category, bool isCompleted, DateTime dateTimeOfExecution)
        {
            var editedTask = await _tasksService.EditTask(id, title, description, dueDate, priority, category, isCompleted, dateTimeOfExecution);
            if(editedTask != null) 
            {
            return Ok(editedTask);
            }
            else
            {
                return NotFound();
            }
        }
        //Получить одну задачу по ID
        [HttpGet("getTask")]
        public async Task<IActionResult> GetTask(int id)
        {
            var taskToGet = await _tasksService.GetTask(id);
            if(taskToGet != null) 
            {
            return Ok(taskToGet);
            }
            else
            {
                return NotFound();
            }
        }

    }
}
