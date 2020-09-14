import  React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import "./LoadStatusSnackBar.css";

class LoadStatusSnackBar extends Component {  

  state = {
      open: false,
      text: ""
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({open: false, text: ""});
  };

  showSnackBar(show, message) {
      if (message)
			this.setState( {open: show, text: message});
		else
		this.setState( {open: show, text: "שגיאה לא ידועה"});
  }

  render() {
    return <Snackbar
            className="loadStatus"
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={2000}
            onClose={this.handleClose}
            message={this.state.text}
            action={
                <React.Fragment>                
                    <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    }
}

export default LoadStatusSnackBar;