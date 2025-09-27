const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mosquitto:1883");

client.on("connect", () => {
  client.subscribe("health/records", (err: any) => {
    if (err) {
      console.log("ERROR: Subscribe na health/records \n");
    }
    else {
      console.log("SUCCESS: Subscribe na health/records \n");
    }
  });
});

client.on("message", (topic: any, message: any) => {
  console.log("Stigla sa " + topic + " poruka : " + message.toString() + "\n");


  client.publish("health/data", message, (err: any) => {
    if (err) {
      console.log("ERROR: Slanje na health/data\n");
    }
    else {
      console.log("SUCCESS: Slanje na health/data\n");
    }
  })
})