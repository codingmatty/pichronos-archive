import moment from 'moment';
import socketIOClient from 'socket.io-client';
import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      time: Date.now(),
      alarm: false,
      endpoint: 'http://127.0.0.1:4001'
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('Alarm Fired', alarm => this.setState({ alarm }));

    setInterval(() => this.setState({ time: Date.now() }), 1000);
  }

  render() {
    const { time, alarm } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        <p>The Current Time is: {moment(time).format('h:mm A')}</p>
        {alarm && (
          <p>Alarm has been activated: {moment(alarm).format('h:mm A')}</p>
        )}
      </div>
    );
  }
}
export default App;
