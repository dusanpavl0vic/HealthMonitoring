using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using System.Text.Json;
using System.Text;

namespace DataManager.Messaging
{

  public class MqttPublisher
  {
    private readonly IMqttClient _client;

    public MqttPublisher(IMqttClient client)
    {
      var mqttFactory = new MqttFactory();
      _client = mqttFactory.CreateMqttClient();
    }

    public async Task ConnectAsync()
    {
      var options = new MqttClientOptionsBuilder()
          .WithTcpServer("mosquitto", 1883)
          .WithClientId("DataManagerService")
          .WithCleanSession()
          .Build();

      if (!_client.IsConnected)
      {
        await _client.ConnectAsync(options);
      }
    }

    public async Task PublishHealthRecord(object record)
    {
      if (!_client.IsConnected)
        await ConnectAsync();

      var payload = JsonSerializer.Serialize(record);

      var message = new MqttApplicationMessageBuilder()
          .WithTopic("health/records")
          .WithPayload(payload)
          .WithAtLeastOnceQoS()
          .Build();

      await _client.PublishAsync(message);
    }


  }
}