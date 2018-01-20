import moment from 'moment';
import autobind from 'react-autobind';
import React, { Component } from 'react';
import Modal from 'react-modal';

import './alarm-display.css';
import Button from '../Button';

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
    if (!this.props.alarm || this.props.alarm !== newProps.alarm) {
      this.setState({ open: true, dismissed: false });
    }
  }

  handleSnooze() {
    this.setState({ open: false }, () => {
      setTimeout(() => this.setState({ open: true }), 1000);
    });
  }

  handleDismiss() {
    this.setState({ dismissed: true });
  }

  render() {
    const { alarm } = this.props;
    const { open, dismissed } = this.state;

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
        <div className="alarm-display__title">Alarm</div>
        <div className="alarm-display__content">
          {moment(alarm).format('hh:mm A')}
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
