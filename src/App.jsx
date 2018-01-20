import socketIOClient from 'socket.io-client';
import React, { Component, Fragment } from 'react';

import { ALARM_ACTIVATED } from './config/socket-events';
import { endpoint } from './constants.json';
import TimeDisplay from './components/TimeDisplay';
import AlarmDisplay from './components/AlarmDisplay';

class App extends Component {
  constructor() {
    super();
    this.state = {
      time: Date.now(),
      alarm: false
    };
  }

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on(ALARM_ACTIVATED, (alarm) => this.setState({ alarm }));

    setInterval(() => this.setState({ time: Date.now() }), 1000);
  }

  render() {
    const { time, alarm } = this.state;
    return (
      <Fragment>
        <TimeDisplay time={time} />
        {alarm && <AlarmDisplay alarm={alarm} />}
      </Fragment>
    );
  }
}

export default App;
