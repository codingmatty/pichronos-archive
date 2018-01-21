import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import autobind from 'react-autobind';
import Modal from 'react-modal';
import socketIOClient from 'socket.io-client';

import { ENDPOINT } from './config/defaults';
import {
  ALARM_ACTIVATED,
  ALARM_SNOOZED,
  ALARM_DISMISSED
} from './config/socket-events';
import TimeDisplay from './components/TimeDisplay';
import AlarmDisplay from './components/AlarmDisplay';

class App extends Component {
  constructor() {
    super();
    autobind(this);
    this.state = {
      time: Date.now(),
      alarm: false
    };
    this.socket = socketIOClient(ENDPOINT);
  }

  componentDidMount() {
    Modal.setAppElement('#root');

    this.socket.on(ALARM_ACTIVATED, (alarm) => this.setState({ alarm }));

    setInterval(() => this.setState({ time: Date.now() }), 1000);
  }

  snoozeAlarm(alarm) {
    this.socket.emit(ALARM_SNOOZED, alarm);
    this.setState({ alarm: false });
  }

  dismissAlarm(alarm) {
    this.socket.emit(ALARM_DISMISSED, alarm);
    this.setState({ alarm: false });
  }

  render() {
    const { time, alarm } = this.state;
    return (
      <Fragment>
        <TimeDisplay time={time} />
        {alarm && (
          <AlarmDisplay
            alarm={alarm}
            snoozeAlarm={this.snoozeAlarm}
            dismissAlarm={this.dismissAlarm}
          />
        )}
      </Fragment>
    );
  }
}

export default App;
