using TasksApp.Server.Controllers.Data;
using Microsoft.EntityFrameworkCore;
using TasksApp.Server.Models;
using TasksApp.Server.Services.Interfaces;
namespace TasksApp.Server.Services
{
    //Сервис содержащий бизнес логику
    public class TasksService : ITasksService
    {
        //Получаем ссылку на контекст данных
        private AppDataContext _dataContext;
        public TasksService(AppDataContext dataContext)
        {
            _dataContext = dataContext;
        }
        //Логика получения всех записей из базы виде листа объектов
        public async Task<List<TaskModel>> GetAll()
        {
            var tasks = await _dataContext.taskModels.ToListAsync();
            return _dataContext.taskModels.ToList();
        }
        //Логика добаваления новой модели
        public async Task<TaskModel> Add(TaskModel taskModel)
        {
            await _dataContext.taskModels.AddAsync(taskModel);
            await _dataContext.SaveChangesAsync();
            return taskModel;
        }
        //Логика изменения состояния выполнения
        public async Task<TaskModel> ChangeCompletionState(int id, bool isCompleted)
        {
            var taskToChange = await _dataContext.taskModels.FirstOrDefaultAsync(i => i.Id == id);
            if (taskToChange != null)
            {
                taskToChange.IsCompleted = isCompleted;
                await _dataContext.SaveChangesAsync();
                return taskToChange;
            }
            else
            {
                return null;
            }
        }
        //Логика удаления задачи
        public async Task<string> RemoveTask(int id)
        {
            var taskToRemove = await _dataContext.taskModels.FirstOrDefaultAsync(t => t.Id == id);
            if (taskToRemove == null)
            {
                return "Task with the entered id was not found";
            }
            _dataContext.taskModels.Remove(taskToRemove);
            await _dataContext.SaveChangesAsync();
            return "Task was removed";
        }
        //Логика редактирования задачи
        public async Task<TaskModel> EditTask(int id, string title, string description, DateTime dueDate, string priority, string category, bool isCompleted, DateTime dateTimeOfExecution)
        {
            var taskToEdit = await _dataContext.taskModels.FirstOrDefaultAsync(t => t.Id == id);
            if(taskToEdit != null) 
            {
                taskToEdit.Title = title;
                taskToEdit.Description = description;
                taskToEdit.DueDate = dueDate;
                taskToEdit.Priority = priority;
                taskToEdit.Category = category;
                taskToEdit.IsCompleted = isCompleted;
                taskToEdit.DateTimeOfExecution = dateTimeOfExecution;
                await _dataContext.SaveChangesAsync();
                return taskToEdit;
            }
            else
            {
                return null;
            }
        }
        //Логика получения задачи
        public async Task<TaskModel> GetTask(int id)
        {
            var taskToGet = await _dataContext.taskModels.FirstOrDefaultAsync(t => t.Id == id);
            if (taskToGet != null) 
            {
                return taskToGet;
            }
            else
            {
                return null;
            }
        }
    }
}
