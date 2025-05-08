using TasksApp.Server.Controllers.Data;
using Microsoft.EntityFrameworkCore;
using TasksApp.Server.Models;
using TasksApp.Server.Services.Interfaces;
namespace TasksApp.Server.Services
{
    public class TasksService : ITasksService
    {
        private AppDataContext _dataContext;
        public TasksService(AppDataContext dataContext) 
        {
            _dataContext = dataContext; 
        }

        public async Task<List<TaskModel>> GetAll() 
        {
            var tasks = await _dataContext.taskModels.ToListAsync();
            return _dataContext.taskModels.ToList();
        }

        public async Task<TaskModel> Add(TaskModel taskModel) 
        {
            await _dataContext.taskModels.AddAsync(taskModel);
            await _dataContext.SaveChangesAsync();
            return taskModel;
        }
    }
}
