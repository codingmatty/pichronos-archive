import React from 'react';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import './time-display.css';

export default function TimeDisplay({ time }) {
  return (
    <Card className="time-display">
      <CardContent>
        <Typography type="display4">
          {time.format('hh:mm A')}
        </Typography>
      </CardContent>
    </Card>
  );
} 
