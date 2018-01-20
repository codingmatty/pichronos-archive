const bodyParser = require('body-parser');
const { CronJob } = require('cron');
const express = require('express');
const http = require('http');
const moment = require('moment');
const path = require('path');
const socketIo = require('socket.io');

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

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  new CronJob(
    moment()
      .add(1, 'm')
      .startOf('m')
      .toDate(),
    () => socket.emit('Alarm Fired', Date.now()),
    null,
    true,
    'America/Chicago'
  );

  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
