using DataManager.Data;
using DataManager.MQTT;
using DataManager.Services;
using Microsoft.EntityFrameworkCore;
//using DataManager.MQTT;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();

builder.Services.AddDbContext<HealthRecordDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddSingleton<MqttPublisher>();

var app = builder.Build();

app.MapGrpcService<HealthDataService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
