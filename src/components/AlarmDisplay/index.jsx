import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

import Button from '../Button';
import './alarm-display.css';

export default function AlarmDisplay({ alarm, dismissAlarm, snoozeAlarm }) {
  const { time, title } = alarm;

  return (
    <Modal
      isOpen
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
          onClick={() => dismissAlarm(alarm)}
        >
          Dismiss
        </Button>
        <Button
          className="alarm-display__action"
          onClick={() => snoozeAlarm(alarm)}
        >
          Snooze
        </Button>
      </div>
    </Modal>
  );
}
