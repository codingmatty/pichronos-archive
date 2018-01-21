const express = require('express');
const path = require('path');

class Router {
  constructor(db, indexPath) {
    this.db = db;
    this.indexPath = indexPath;
    this.router = express.Router();

    this.setupRoutes();
  }

  registerHandlers(alarmHandler) {
    this.alarmHandler = alarmHandler;
  }

  setupRoutes() {
    this.router.get('/', (req, res) => {
      res.sendFile(this.indexPath);
    });

    this.router.get('/ping', function(req, res) {
      res.send('pong');
    });

    this.router.get('/config', (req, res) => {
      const config = this.db.getConfig();

      res.status(200).send({ config });
    });

    this.router.get('/config/alarms', (req, res) => {
      const alarms = this.db.getAlarms();

      res.status(200).send({ alarms });
    });

    this.router.post('/config/alarms', (req, res) => {
      const alarm = req.body;
      const alarms = this.db.addAlarm(alarm);

      this.alarmHandler.loadAlarms();

      res.status(200).send({ alarms });
    });

    this.router.put('/config/alarms/:id', (req, res) => {
      const alarm = req.body;
      const alarmId = req.params.id;
      const updatedAlarm = this.db.updateAlarm(alarmId, alarm);

      this.alarmHandler.loadAlarms();

      res.status(200).send({ alarm: updatedAlarm });
    });

    this.router.delete('/config/alarms/:id', (req, res) => {
      const alarmId = req.params.id;
      const removedAlarm = this.db.removeAlarm(alarmId);

      this.alarmHandler.loadAlarms();

      res.status(200).send({ alarm: removedAlarm });
    });
  }
}

module.exports = Router;
