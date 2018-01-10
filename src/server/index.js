const { CronJob } = require('cron');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const index = require('./routes/index');

const port = process.env.PORT || 4001;
const app = express();

app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', socket => {
  console.log('New client connected');

  new CronJob(
    '00 08 16 * * *',
    () => socket.emit('Alarm Fired', Date.now()),
    null,
    true,
    'America/Chicago'
  );

  socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
