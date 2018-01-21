const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const alarmHandler = require('./alarm-handler');
const routes = require('./routes');

const port = process.env.PORT || 4001;
const app = express();

app.use(express.static(path.join(process.env.PICHRONOS_ROOT_DIR, 'build')));
app.use(bodyParser.json());
app.use(routes);

console.log('Express Setup');

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log(`New client connected [${socket.id}]`);

  alarmHandler.registerSocket(socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected [${socket.id}]`);

    alarmHandler.deregisterSocket(socket);
  });
});

alarmHandler.loadAlarms();

server.listen(port, () => console.log(`Listening on port ${port}`));
