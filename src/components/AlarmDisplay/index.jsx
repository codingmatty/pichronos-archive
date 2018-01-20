import moment from 'moment';
import autobind from 'react-autobind';
import React, { Component } from 'react';
import Modal from 'react-modal';

import { DEFAULT_SNOOZE } from '../../config/defaults';
import Button from '../Button';
import './alarm-display.css';

export default class AlarmDisplay extends Component {
  state = {
    open: true,
    dismissed: false
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.alarm || this.props.alarm.time !== newProps.alarm.time) {
      this.setState({ open: true, dismissed: false });
    }
  }

  handleSnooze() {
    const { snooze = DEFAULT_SNOOZE } = this.props.alarm;

    this.setState({ open: false }, () => {
      setTimeout(() => this.setState({ open: true }), snooze);
    });
  }

  handleDismiss() {
    this.setState({ dismissed: true });
  }

  render() {
    const { alarm } = this.props;
    const { open, dismissed } = this.state;

    const { time, title } = alarm;

    if (dismissed) {
      return null;
    }

    return (
      <Modal
        isOpen={open}
        overlayClassName="alarm-display__overlay"
        className="alarm-display"
        contentLabel="Alarm Display"
      >
        <div className="alarm-display__title">{title || 'Alarm'}</div>
        <div className="alarm-display__content">
          {moment(time).format('hh:mm A')}
        </div>
        <div className="alarm-display__footer">
          <Button
            className="alarm-display__action"
            onClick={this.handleDismiss}
          >
            Dismiss
          </Button>
          <Button
            className="alarm-display__action"
            onClick={this.handleSnooze}
            color="primary"
          >
            Snooze
          </Button>
        </div>
      </Modal>
    );
  }
}
