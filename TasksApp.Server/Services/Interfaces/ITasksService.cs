using TasksApp.Server.Models;

namespace TasksApp.Server.Services.Interfaces
{
    //Интерфейс, используется для доступа к сервису из контроллера HTTP запросов
    public interface ITasksService
    {
        Task<List<TaskModel>> GetAll();
        Task<TaskModel> Add(TaskModel taskModel);
        Task<TaskModel> ChangeCompletionState(int id, bool isCompleted, DateTime dateTimeOfExecution);
        Task<string> RemoveTask(int id);
        Task<TaskModel> EditTask(int id, string title, string description, DateTime dueDate, string priority, string category, bool isCompleted, DateTime dateTimeOfExecution);
        Task<TaskModel> GetTask(int id);
    }
}
