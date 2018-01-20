import React from 'react';

import './time-display.css';

export default function TimeDisplay({ time }) {
  return <div className="time-display">{time.format('hh:mm A')}</div>;
}
