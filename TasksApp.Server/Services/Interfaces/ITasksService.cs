using TasksApp.Server.Models;

namespace TasksApp.Server.Services.Interfaces
{
    public interface ITasksService
    {
        Task<List<TaskModel>> GetAll();
        Task<TaskModel> Add(TaskModel taskModel);
        Task<TaskModel> ChangeCompletionState(int id, bool isCompleted);
    }
}
