using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TasksApp.Server.Models
{
    public class EditTaskRequest
    {

        public string Title { get; set; }
        [Required(AllowEmptyStrings = true)]
        public string Description { get; set; }

        public DateTime DueDate { get; set; }

        [Required(AllowEmptyStrings = true)]
        public string Priority { get; set; }
        [Required(AllowEmptyStrings = true)]
        public string Category { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime DateTimeOfExecution { get; set; }
    }
}
