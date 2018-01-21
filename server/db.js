const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');

const db = low(adapter);

db
  .defaults({
    config: {
      alarms: [],
      timezone: 'America/Chicago',
      delta: 0
    }
  })
  .write();

exports.getConfig = function getConfig() {
  return db.get('config').value();
};

exports.getAlarms = function getAlarms() {
  return db.get('config.alarms').value();
};

exports.addAlarm = function addAlarm(alarm) {
  return db
    .get('config.alarms')
    .push({ ...alarm, id: Date.now().toString(32) })
    .write();
};

exports.updateAlarm = function updateAlarm(alarmId, alarm) {
  return db
    .get('config.alarms')
    .find({ id: alarmId })
    .assign({ ...alarm, id: alarmId })
    .write();
};

exports.removeAlarm = function removeAlarm(alarmId) {
  return db
    .get('config.alarms')
    .remove({ id: alarmId })
    .write();
};
