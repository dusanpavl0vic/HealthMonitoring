# HealthMonitoring System

## 📋 Opis projekta

HealthMonitoring je distribuirani sistem za praćenje i analizu zdravstvenih parametara atletičara tokom fizičkih aktivnosti. Sistem prikuplja podatke sa IoT senzora, obrađuje ih u realnom vremenu i pruža detaljne analize performansi kroz vremenski period.

## 🏗️ Arhitektura sistema

Sistem se sastoji od tri mikroservisa:

- **Gateway** - REST API gateway implementiran u Node.js/Express/TypeScript
- **DataManager** - gRPC servis za upravljanje podacima implementiran u ASP.NET Core  
- **SensorGenerator** - Simulator IoT senzora koji čita podatke iz CSV fajla

## ⚙️ Funkcionalnosti

### Gateway mikroservis

Gateway pruža REST API sa sledećim funkcionalnostima:

- CRUD operacije nad zdravstvenim zapisima
- Agregacija podataka (min, max, avg, sum) za određeni vremenski period
- Filtriranje po tipu aktivnosti i vremenskom opsegu
- Prosleđivanje podataka ka DataManager servisu preko gRPC protokola

Dokumentacija API-ja dostupna je preko OpenAPI specifikacije na `/api-docs` endpoint-u.

### DataManager mikroservis

DataManager implementira gRPC servise za:

- Čuvanje podataka u PostgreSQL bazi
- CRUD operacije nad zdravstvenim zapisima
- Pretraživanje po atletičaru, aktivnosti i vremenskom periodu

### SensorGenerator

Aplikacija koja simulira rad IoT senzora:

- Čita podatke iz CSV fajla (`data.csv`)
- Šalje podatke na Gateway endpoint na svakih 5 sekundi
- Simulira real-time akviziciju podataka sa senzora

## 🛠️ Tehnologije

- **Gateway**: Node.js, Express, TypeScript, OpenAPI
- **DataManager**: ASP.NET Core, C#, Entity Framework
- **Komunikacija**: REST, gRPC
- **Baza podataka**: PostgreSQL
- **Kontejnerizacija**: Docker, Docker Compose

## 📦 Data Model

### HealthRecord

```proto
HealthRecord {
  string athleteId
  Timestamp timestamp
  int32 heartRate
  float bodyTemperature
  string bloodPressure
  int32 bloodOxygen
  int32 stepCount
  ActivityStatus activityStatus
  double latitude
  double longitude
  int32 secureTransmissionStatus
}
```

### Data Aggregation Capabilities

```typescript
interface HealthRecordAggregation {
  athleteId: string
  activityStatus?: number
  startTime?: Date
  endTime?: Date
  
  // Statistical aggregations
  heartRate: { min, max, avg }
  bodyTemperature: { min, max, avg }
  bloodOxygen: { min, max, avg }
  stepCount: { sum }
  bloodPressure: { min, max }
  
  // Detailed records with location data
  records: Array<{
    timestamp, bloodPressure,
    latitude, longitude,
    secureTransmissionStatus
  }>
}
```

## 🚀 API Endpoints

### Gateway REST API (Port 3000)

#### Create Health Record
```http
POST localhost:3000/health/record/create
```

Request body:
```json
{
  "athleteId": "string",
  "timestamp": "DateTime",
  "heartRate": "int32",
  "bodyTemperature": "float",
  "bloodPressure": "string",
  "bloodOxygen": "int32",
  "stepCount": "int32",
  "activityStatus": "ActivityStatus",
  "latitude": "double",
  "longitude": "double",
  "secureTransmissionStatus": "int32"
}
```

#### Get Health Record by ID
```http
GET localhost:3000/health/record/:recordId
```

#### Get All Health Records
```http
GET localhost:3000/health/record/all
```

#### Update Health Record
```http
PUT localhost:3000/health/record/update
```

#### Delete Health Record
```http
DELETE localhost:3000/health/record/delete/:recordId
```

#### Get Records by Athlete with Filters
```http
GET localhost:3000/health/record/athlete/:athleteId/:activityStatus/:startTime/:endTime
```

#### Get Athlete Statistics
```http
GET localhost:3000/health/record/athlete/stats/:athleteId/:activityStatus/:startTime/:endTime
```
