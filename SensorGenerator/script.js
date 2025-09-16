const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
//TODO: Umesto axios koristi "npm install node-fetch"

const filePath = "wearable_sports_health_dataset.csv";
const url = "http://localhost:3000/endpoint";
const interval = 5 * 60 * 1000; // 5min
const testInterval = 2000; // 2s

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
          //TODO: Otkomentarisi slanje prema gateway-u
          //const response = await axios.post(url, row);
          //console.log(`Poslato: ${row.Record_ID}, status: ${response.status}`);
          console.log(`Poslato: ${JSON.stringify(row, null, 2)}`);
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
