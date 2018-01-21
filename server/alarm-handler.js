const { job } = require('cron');
const { ALARM_ACTIVATED } = require('../src/config/socket-events');
const db = require('./db');

const connectedSockets = {};
let loadedAlarms = [];

const { timezone } = db.getConfig();

exports.registerSocket = function registerSocket(socket) {
  connectedSockets[socket.id] = socket;
};

exports.deregisterSocket = function registerSocket(socket) {
  delete connectedSockets[socket.id];
};

function activateAlarm(alarm) {
  console.log(`Activating Alarm "${alarm.title}" (${alarm.time})`);

  Object.values(connectedSockets).forEach((socket) =>
    socket.emit(ALARM_ACTIVATED, alarm)
  );
}

exports.loadAlarms = function loadAlarms() {
  const alarms = db.getAlarms();

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
