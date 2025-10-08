package mqtt
func RunMqttServer(){

	client := NewMqttClient("mqtt://mosquitto:1883")
	SubHealthRecord(client)
	
}