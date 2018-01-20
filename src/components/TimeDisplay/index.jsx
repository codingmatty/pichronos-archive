import moment from 'moment';
import React from 'react';

import './time-display.css';

export default function TimeDisplay({ time }) {
  return <div className="time-display">{moment(time).format('hh:mm A')}</div>;
}
