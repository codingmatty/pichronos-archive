const bodyParser = require('body-parser');
const { CronJob } = require('cron');
const express = require('express');
const http = require('http');
const moment = require('moment');
const path = require('path');
const socketIo = require('socket.io');
const omit = require('lodash/omit');

const routes = require('./routes');

const port = process.env.PORT || 4001;
const app = express();

app.use(
  express.static(
    path.resolve(path.join(require.main.filename, '..', '..', 'build'))
  )
);
app.use(bodyParser.json());
app.use(routes);

console.log('Express Setup');

const server = http.createServer(app);

const connectedSockets = {};

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log(`New client connected [${socket.id}]`);

  connectedSockets[socket.id] = socket;

  socket.on('disconnect', () => {
    console.log(`Client disconnected [${socket.id}]`);

    delete connectedSockets[socket.id];
  });
});

new CronJob(
  '0,15,30,45 * * * * *',
  (...args) => {
    console.log(...args);
    Object.values(connectedSockets).forEach((socket) =>
      socket.emit('Alarm Fired', Date.now())
    );
  },
  null,
  true,
  'America/Chicago'
);

server.listen(port, () => console.log(`Listening on port ${port}`));
