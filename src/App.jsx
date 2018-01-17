import moment from "moment";
import socketIOClient from "socket.io-client";
import React, { Component, Fragment } from "react";

import { endpoint } from "./constants.json";
import TimeDisplay from "./components/TimeDisplay";
import AlarmDisplay from "./components/AlarmDisplay";

class App extends Component {
  constructor() {
    super();
    this.state = {
      time: moment(),
      alarm: false
    };
  }

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on("Alarm Fired", alarm => this.setState({ alarm: moment(alarm) }));

    setInterval(() => this.setState({ time: moment() }), 1000);
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
