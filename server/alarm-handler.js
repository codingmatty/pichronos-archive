const { job } = require('cron');
const { DEFAULT_SNOOZE } = require('../src/config/defaults');
const {
  ALARM_ACTIVATED,
  ALARM_DISMISSED,
  ALARM_SNOOZED
} = require('../src/config/socket-events');

class AlarmHandler {
  constructor(db, socketHandler) {
    this.db = db;
    this.socketHandler = socketHandler;
    this.loadedAlarms = [];
    this.activatedAlarm = null;
    this.snoozedAlarmTimeout = null;

    socketHandler.registerEventCallback(ALARM_SNOOZED, () => this.snoozeAlarm);
    socketHandler.registerEventCallback(
      ALARM_DISMISSED,
      () => this.dismissAlarm
    );
  }

  activateAlarm(alarm) {
    console.log(`Activating Alarm "${alarm.title}" (${alarm.time})`);

    clearTimeout(this.snoozedAlarmTimeout);

    this.activatedAlarm = alarm;

    this.socketHandler
      .getConnectedSockets()
      .forEach((socket) => socket.emit(ALARM_ACTIVATED, alarm));
  }

  snoozeAlarm(alarm) {
    if (alarm.id === this.activatedAlarm.id) {
      console.log(`Snoozing Alarm "${alarm.title}" (${alarm.time})`);

      clearTimeout(this.snoozedAlarmTimeout);

      this.snoozedAlarmTimeout = setTimeout(() => {
        this.activateAlarm(alarm);
      }, alarm.snooze || DEFAULT_SNOOZE);
    }
  }

  loadAlarms() {
    const { alarms, timezone } = this.db.getConfig();

    clearTimeout(this.snoozedAlarmTimeout);

    // Stop any existing alarms
    this.loadedAlarms.forEach((alarm) => alarm.stop());

    // Set the loaded alarms to a new aray of alarm cron jobs
    this.loadedAlarms = alarms.map((alarm) => {
      console.log(
        `Loading Alarm "${alarm.title}" with Expression [${alarm.expression}]`
      );
      return job(
        alarm.expression,
        () => this.activateAlarm({ ...alarm, time: Date.now() }),
        null,
        true,
        timezone
      );
    });
  }
}

module.exports = AlarmHandler;
