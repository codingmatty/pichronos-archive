import autobind from "react-autobind";
import React, { Component } from "react";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Typography from 'material-ui/Typography';

export default class AlarmDisplay extends Component {
  state = {
    open: true,
    dismissed: false
  };

  constructor(props) {
    super(props);
    autobind(this);
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
      <Dialog open={open}>
        <DialogTitle>Alarm</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Typography type="display4">{alarm.format("hh:mm A")}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDismiss}>
            Dismiss
          </Button>
          <Button onClick={this.handleSnooze} color="primary">
            Snooze
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
