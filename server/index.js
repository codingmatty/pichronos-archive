const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');

const Database = require('./db');
const AlarmHandler = require('./alarm-handler');
const SocketHandler = require('./socket-handler');
const Router = require('./router');

// Constants
const port = process.env.PORT || 4001;
const rootDir = process.env.PICHRONOS_ROOT_DIR || path.resolve();

// Files
const dbFile = path.join(rootDir, 'db.json');
const indexFile = path.join(rootDir, 'build', 'index.html');
const staticDir = path.join(rootDir, 'build');

// Instances
const database = new Database(dbFile);
const router = new Router(database, indexFile);

const app = express();

app.use(express.static(staticDir));
app.use(bodyParser.json());
app.use(router.router);

const server = http.createServer(app);

const socketHandler = new SocketHandler(server);
const alarmHandler = new AlarmHandler(database, socketHandler);
alarmHandler.loadAlarms();

router.registerHandlers(alarmHandler);

server.listen(port, () => console.log(`Listening on port ${port}`));
