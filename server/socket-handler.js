const socketIo = require('socket.io');

class SocketHandler {
  constructor(server) {
    this.connectedSockets = {};
    this.eventCallbacks = {};

    const io = socketIo(server);

    io.on('connection', (socket) => {
      console.log(`New client connected [${socket.id}]`);

      this.registerSocket(socket);

      socket.on('disconnect', () => {
        console.log(`Client disconnected [${socket.id}]`);

        this.deregisterSocket(socket);
      });
    });
  }

  registerSocket(socket) {
    Object.keys(this.eventCallbacks).forEach((event) => {
      socket.on(event, this.eventCallbacks[event]);
    });
    this.connectedSockets[socket.id] = socket;
  }

  deregisterSocket(socket) {
    Object.keys(this.eventCallbacks).forEach((event) => {
      this.connectedSockets[socket.id].removeListener(
        event,
        this.eventCallbacks[event]
      );
    });
    delete this.connectedSockets[socket.id];
  }

  getConnectedSockets() {
    return Object.values(this.connectedSockets);
  }

  registerEventCallback(event, callback) {
    this.getConnectedSockets().forEach((socket) => socket.on(event, callback));
    this.eventCallbacks[event] = callback;
  }
}

module.exports = SocketHandler;
