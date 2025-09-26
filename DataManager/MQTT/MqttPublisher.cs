using MQTTnet;
using MQTTnet.Protocol;
using System.Text.Json;

namespace DataManager.MQTT;

public class MqttPublisher
{
    private readonly IMqttClient _mqttClient;
    private readonly MqttClientOptions _options;
    private readonly ILogger<MqttPublisher> _logger;

    public MqttPublisher(ILogger<MqttPublisher> logger)
    {
        _logger = logger;

        var factory = new MqttClientFactory();
        _mqttClient = factory.CreateMqttClient();

        _options = new MqttClientOptionsBuilder()
            .WithTcpServer("mosquitto", 1883)
            .WithCleanSession()
            .Build();
    }
    public async Task ConnectAsync()
    {
        if (!_mqttClient.IsConnected)
        {
            await _mqttClient.ConnectAsync(_options, CancellationToken.None);
            _logger.LogInformation("Connected to MQTT broker.");
        }
    }

    public async Task PublishAsync<T>(string topic, T message, MqttQualityOfServiceLevel qos = MqttQualityOfServiceLevel.AtLeastOnce, bool retain = false) //retain sluzi ako je na true cuvaju se poruke i svi koji se sub na taj topic ce primiti poruku
    {
        if (!_mqttClient.IsConnected)
        {
            await ConnectAsync();
        }

        var payload = JsonSerializer.Serialize(message);
        var mqttMessage = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithQualityOfServiceLevel(qos)
            .WithRetainFlag(retain)
            .Build();

        await _mqttClient.PublishAsync(mqttMessage, CancellationToken.None);
        _logger.LogInformation("Published message to topic {Topic}: {Payload}", topic, payload);
    }

    
}