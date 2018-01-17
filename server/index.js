const { CronJob } = require("cron");
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const routes = require("./routes");

const port = process.env.PORT || 4001;
const app = express();

app.use(bodyParser.json());
app.use(routes);

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", socket => {
  console.log("New client connected");

  new CronJob(
    "00 08 16 * * *",
    () => socket.emit("Alarm Fired", Date.now()),
    null,
    true,
    "America/Chicago"
  );

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
