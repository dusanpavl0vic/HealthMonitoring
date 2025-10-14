import { HealthRecord } from "./interfaces/healthData";
import { normalizeRecord, validateHealthRecord } from "./services/referenceRanges";

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

client.on("message", (topic: string, message: HealthRecord) => {
  console.log("Stigla sa " + topic + " poruka : " + message.toString() + "\n");

  const raw = JSON.parse(message.toString());
  const record = normalizeRecord(raw);
  const result = validateHealthRecord(raw);

  console.log(result);
  const resultString = JSON.stringify(result);
  // let newTopic: string = "health/" + record.athleteId;
  let newTopic: string = "health/data"
  client.publish(newTopic, resultString, (err: any) => {
    if (err) {
      console.log("ERROR: Slanje na health/data\n");
    }
    else {
      console.log("SUCCESS: Slanje na health/data\n");
    }
  })
})

