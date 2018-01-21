const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');

class Database {
  constructor(file) {
    const adapter = new FileSync(file);

    this.db = low(adapter);
    this.db
      .defaults({
        config: {
          alarms: [],
          timezone: 'America/Chicago',
          delta: 0
        }
      })
      .write();
  }

  getConfig() {
    return this.db.get('config').value();
  }

  getAlarms() {
    return this.db.get('config.alarms').value();
  }

  addAlarm(alarm) {
    return this.db
      .get('config.alarms')
      .push({ ...alarm, id: Date.now().toString(32) })
      .write();
  }

  updateAlarm(alarmId, alarm) {
    return this.db
      .get('config.alarms')
      .find({ id: alarmId })
      .assign({ ...alarm, id: alarmId })
      .write();
  }

  removeAlarm(alarmId) {
    return this.db
      .get('config.alarms')
      .remove({ id: alarmId })
      .write();
  }
}

module.exports = Database;
