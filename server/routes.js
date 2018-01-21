const express = require('express');
const path = require('path');

const db = require('./db');
const alarmHandler = require('./alarm-handler');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(
    path.resolve(
      path.join(require.main.filename, '..', '..', 'build', 'index.html')
    )
  );
});

router.get('/ping', function(req, res) {
  res.send('pong');
});

router.get('/config', (req, res) => {
  const config = db.getConfig();

  res.status(200).send({ config });
});

router.get('/config/alarms', (req, res) => {
  const alarms = db.getAlarms();

  res.status(200).send({ alarms });
});

router.post('/config/alarms', (req, res) => {
  const alarm = req.body;
  const alarms = db.addAlarm(alarm);

  alarmHandler.loadAlarms();

  res.status(200).send({ alarms });
});

router.put('/config/alarms/:id', (req, res) => {
  const alarm = req.body;
  const alarmId = req.params.id;
  const updatedAlarm = db.updateAlarm(alarmId, alarm);

  alarmHandler.loadAlarms();

  res.status(200).send({ alarm: updatedAlarm });
});

router.delete('/config/alarms/:id', (req, res) => {
  const alarmId = req.params.id;
  const removedAlarm = db.removeAlarm(alarmId);

  alarmHandler.loadAlarms();

  res.status(200).send({ alarm: removedAlarm });
});

module.exports = router;
