const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

const filePath = "wearable_sports_health_dataset.csv";
const url = "http://localhost:3000/health/record/create";
const interval = 5 * 60 * 1000; // 5min
const testInterval = 5000; // 2s

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCsvRows() {
  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      console.log("CSV fajl učitan, šaljem redove...");

      for (const row of rows) {
        try {
          const [firstKey, ...restKeys] = Object.keys(row);
          const rowWithoutFirst = {};
          for (const key of restKeys) {
            rowWithoutFirst[key] = row[key];
          }
          const mapped = {
            athleteId: rowWithoutFirst.Athlete_ID,
            timestamp: new Date(rowWithoutFirst.Timestamp),
            heartRate: Number(rowWithoutFirst.Heart_Rate),
            bodyTemperature: Number(rowWithoutFirst.Body_Temperature),
            bloodPressure: rowWithoutFirst.Blood_Pressure,
            bloodOxygen: Number(rowWithoutFirst.Blood_Oxygen),
            stepCount: Number(rowWithoutFirst.Step_Count),
            activityStatus: getActivityStatus(rowWithoutFirst.Activity_Status),
            latitude: Number(rowWithoutFirst.Latitude),
            longitude: Number(rowWithoutFirst.Longitude),
            secureTransmissionStatus: Number(
              rowWithoutFirst.Secure_Transmission_Status
            ),
          };

          const response = await axios.post(url, mapped);
          console.log("📩 Response status:", response.status);
        } catch (error) {
          console.error(
            `Greška pri slanju reda ${row.Record_ID}:`,
            error.message
          );
        }

        //TODO: Ispravi interval na 5min
        await sleep(testInterval);
      }

      console.log("Svi redovi poslati!");
    });
}

sendCsvRows();

function getActivityStatus(status) {
  switch (status) {
    case "Walking":
      return 0;
    case "Cycling":
      return 1;
    case "Running":
      return 2;
    case "Resting":
      return 3;
    default:
      throw new Error(`Nepoznat status aktivnosti: ${status}`);
  }
}
