const { job } = require('cron');
const { DEFAULT_SNOOZE } = require('../src/config/defaults');
const {
  ALARM_ACTIVATED,
  ALARM_DISMISSED,
  ALARM_SNOOZED
} = require('../src/config/socket-events');
const db = require('./db');

const { timezone } = db.getConfig();

const connectedSockets = {};
let loadedAlarms = [];

let activatedAlarm;
let snoozedAlarmTimeout;

function activateAlarm(alarm) {
  console.log(`Activating Alarm "${alarm.title}" (${alarm.time})`);

  clearTimeout(snoozedAlarmTimeout);

  activatedAlarm = alarm;

  Object.values(connectedSockets).forEach((socket) =>
    socket.emit(ALARM_ACTIVATED, alarm)
  );
}

function snoozeAlarm(alarm) {
  if (alarm.id === activatedAlarm.id) {
    clearTimeout(snoozedAlarmTimeout);
    console.log(`Snoozing Alarm "${alarm.title}" (${alarm.time})`);
    snoozedAlarmTimeout = setTimeout(() => {
      activateAlarm(alarm);
    }, alarm.snooze || DEFAULT_SNOOZE);
  }
}

function dismissAlarm(alarm) {
  if (alarm.id === activatedAlarm.id) {
    clearTimeout(snoozedAlarmTimeout);
  }
}

exports.registerSocket = function registerSocket(socket) {
  connectedSockets[socket.id] = socket;
  connectedSockets[socket.id].on(ALARM_SNOOZED, snoozeAlarm);
  connectedSockets[socket.id].on(ALARM_DISMISSED, dismissAlarm);
};

exports.deregisterSocket = function registerSocket(socket) {
  connectedSockets[socket.id].removeListener(ALARM_SNOOZED, snoozeAlarm);
  connectedSockets[socket.id].removeListener(ALARM_DISMISSED, dismissAlarm);
  delete connectedSockets[socket.id];
};

exports.loadAlarms = function loadAlarms() {
  const alarms = db.getAlarms();

  clearTimeout(snoozedAlarmTimeout);

  // Stop any existing alarms
  loadedAlarms.forEach((alarm) => alarm.stop());

  // Set the loaded alarms to a new aray of alarm cron jobs
  loadedAlarms = alarms.map((alarm) => {
    console.log(
      `Loading Alarm "${alarm.title}" with Expression [${alarm.expression}]`
    );
    return job(
      alarm.expression,
      () => activateAlarm({ ...alarm, time: Date.now() }),
      null,
      true,
      timezone
    );
  });
};

exports.addAlarm = function addAlarm(alarm) {};
