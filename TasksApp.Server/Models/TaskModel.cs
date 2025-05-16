using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TasksApp.Server.Models
{
    //Модель для работы с данными из таблицы в БД.
    public class TaskModel
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Название задачи обязательно")]
        [MaxLength(255)] // Ограничиваем длину строки
        [Column("title")]
        public string Title { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Дата и время выполнения обязательны")]
        [Column("duedate")]
        public DateTime DueDate { get; set; }

        [Column("dateTimeOfExecution")]
        public DateTime DateTimeOfExecution { get; set; }

        [MaxLength(50)] // Ограничиваем длину строки
        [Column("priority")]
        public string Priority { get; set; }

        [MaxLength(255)] // Ограничиваем длину строки
        [Column("category")]
        public string Category { get; set; }
        
        [Column("iscompleted")]
        public bool IsCompleted { get; set; }
    }
}
