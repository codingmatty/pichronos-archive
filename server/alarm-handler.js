const { job } = require('cron');
const { ALARM_ACTIVATED } = require('../src/config/socket-events');
const db = require('./db');

const connectedSockets = {};
const loadedAlarms = [];

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

exports.loadAlarms = async function loadAlarms() {
  const { alarms } = await db.getConfig();
  alarms.forEach((alarm) => {
    console.log(
      `Loading Alarm "${alarm.title}" with Expression [${alarm.expression}]`
    );
    loadedAlarms.push(
      job(
        alarm.expression,
        () => activateAlarm({ ...alarm, time: Date.now() }),
        null,
        true,
        'America/Chicago'
      )
    );
  });
};

exports.addAlarm = function addAlarm(alarm) {};
