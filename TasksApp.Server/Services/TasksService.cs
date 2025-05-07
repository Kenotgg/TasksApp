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
    }
}
