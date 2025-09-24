using DataManager.Data;
using DataManager.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();

var app = builder.Build();

builder.Services.AddDbContext<HealthRecordDbContext>(option =>
{
  option.UseNpgsql(builder.Configuration.GetConnectionString("DEfaultConnection"));
});

app.MapGrpcService<HealthDataService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
