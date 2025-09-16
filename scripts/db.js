const { Client } = require("pg");

async function init() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "hmDB",
  });

  try {
    await client.connect();

    await client.query(activity_status);
    await client.query(createTableQuery);

    console.log("Tables were successfully created ✅");
  } catch (err) {
    console.error("Error creating tables ❌", err);
  } finally {
    await client.end();
  }
}

init();

const activity_status = `
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status') THEN
      CREATE TYPE activity_status AS ENUM ('Walking', 'Cycling', 'Running', 'Resting');
   END IF;
END$$;
`;

const createTableQuery = `
CREATE TABLE IF NOT EXISTS health_data(
  Record_ID SERIAL PRIMARY KEY,
  Athlete_ID VARCHAR(10) NOT NULL,
  Timestamp TIMESTAMP NOT NULL,
  Heart_Rate INT NOT NULL,
  Body_Temperature FLOAT NOT NULL,
  Blood_Pressure VARCHAR(10) NOT NULL,
  Blood_Oxygen INT NOT NULL,
  Step_Count INT NOT NULL,
  Activity_Status activity_status NOT NULL,
  Latitude FLOAT NOT NULL,
  Longitude FLOAT NOT NULL,
  Secure_Transmission_Status SMALLINT CHECK (Secure_Transmission_Status IN (0, 1)) NOT NULL
);`;
