using Microsoft.EntityFrameworkCore;
using TasksApp.Server.Models;
namespace TasksApp.Server.Controllers.Data
{
    //Контекст даных из базы для приложения
    public class AppDataContext : DbContext
    {
        //Получаем объекты записей из таблицы в виде DbSet
        public DbSet<TaskModel> taskModels { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<TaskModel>().ToTable("tasks");
        }

        public AppDataContext(DbContextOptions<AppDataContext> options)
            : base(options)
        { }
    }
}
