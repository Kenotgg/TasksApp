using TasksApp.Server.Models;

namespace TasksApp.Server.Services.Interfaces
{
    public interface ITasksService
    {
        Task<List<TaskModel>> GetAll();
    }
}
