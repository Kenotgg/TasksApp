using TasksApp.Server.Services.Interfaces;
using TasksApp.Server.Services;
using Microsoft.EntityFrameworkCore;
using TasksApp.Server.Controllers.Data;
//Точка входу в программу
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Добавляем DbContext
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSqlConnection")));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Регистрирует сервис ITasksService в контейнере зависимостей как transient.
builder.Services.AddTransient<ITasksService, TasksService>();
// Добавляем политику для CORS для получения и обработки данных с бекенд на фронтенде.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Конфигурируем HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
