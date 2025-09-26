import express from 'express';
import { AggregateAthleteRecords, CreateHealthRecord, DeleteHealthRecord, GetAllHealthRecords, GetAthleteHealthRecords, GetHealthRecords, UpdateHealthRecord } from '../services/healthDataService';
const router = express.Router();

router.post('/record/create', (_req, res) => {
  CreateHealthRecord(_req.body)
    .then((message) => res.status(200).json(message))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.get('/record/all', (_req, res) => {
  GetAllHealthRecords()
    .then((records) => res.status(200).json(records))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.put('/record/update', (_req, res) => {
  UpdateHealthRecord(_req.body)
    .then((message) => res.status(200).json(message))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.get('/record/:recordId', (_req, res) => {
  GetHealthRecords(parseInt(_req.params.recordId))
    .then((records) => res.status(200).json(records))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.delete('/record/delete/:recordId', (_req, res) => {
  DeleteHealthRecord(parseInt(_req.params.recordId))
    .then((message) => res.status(200).json(message))
    .catch((error) => res.status(500).json({ error: error.message }));
});

router.get('/record/athlete/:athleteId/:activityStatus/:startTime/:endTime', (_req, res) => {
  GetAthleteHealthRecords({
    athleteId: _req.params.athleteId,
    activityStatus: parseInt(_req.params.activityStatus),
    startTime: new Date(_req.params.startTime),
    endTime: new Date(_req.params.endTime),
  })
    .then((records) => res.status(200).json(records))
    .catch((error) => {
      if (error.message.includes("athleteId is required")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    });
});

router.get('/record/athlete/stats/:athleteId/:activityStatus/:startTime/:endTime', (_req, res) => {
  AggregateAthleteRecords({
    athleteId: _req.params.athleteId,
    activityStatus: parseInt(_req.params.activityStatus),
    startTime: new Date(_req.params.startTime),
    endTime: new Date(_req.params.endTime),
  })
    .then((records) => res.status(200).json(records))
    .catch((error) => {
      if (error.message.includes("athleteId is required")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    });
});

export default router;