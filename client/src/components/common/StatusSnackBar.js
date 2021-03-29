import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import "./StatusSnackBar.css";


class StatusSnackBar extends Component {

	state = {
		open: false,
		text: ""
	};

	//const snackBarElement = useRef(null);
	showMessage = (message) => {
		this.snackBarElement.current.showSnackBar(true, message);
	}

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ open: false, text: "" });
	};

	showSnackBar(show, message) {
		if (message)
			this.setState({ open: show, text: message });
		else
			this.setState({ open: show, text: "שגיאה לא ידועה" });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// check if to handle uploadFile results
		if (this.props.errorMessage.timeStamp !== prevProps.errorMessage.timeStamp)
			this.showSnackBar(true, this.props.errorMessage.message);
		// check if to handle uploadFile results
		if (this.props.message.timeStamp !== prevProps.message.timeStamp)
			this.showSnackBar(true, this.props.message.text);
	}


	render() {
		return <Snackbar
			className="status"
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			open={this.state.open}
			autoHideDuration={5000}
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

function mapStateToProps(state) {
	return {
		errorMessage: {
			message: state.messages.errorMessage,
			timeStamp: state.messages.errorTimestamp
		},
		message: {
			text: state.messages.message,
			timeStamp: state.messages.timeStamp
		}
	}
}

export default connect(mapStateToProps, actions)(StatusSnackBar);