import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

class OverideAlert extends Component {

    handleClose = () => {
        this.props.handleClose();
    }

    handleAprove = () => {
        this.props.handleApprove();
    }

    render() {
        return <div><Dialog
            open={this.props.showOverideAlert}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">האם למחוק נתונים קיימים</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    קיימים נתונים על החברה במערכת.
                    טעינת הקובץ תמחק נתונים אלו. האם להמשיך בטעינת הקובץ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleAprove} color="primary" autoFocus variant="contained">לאשר טעינה</Button>
                <Button onClick={this.handleClose} variant="contained">לבטל פעולה</Button>
            </DialogActions>
        </Dialog>
        </div>
    }
}

export default OverideAlert;