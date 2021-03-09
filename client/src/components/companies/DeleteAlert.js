import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

class DeleteAlert extends Component {

    handleClose = () => {
        this.props.handleClose();
    }

    handleAprove = () => {
        this.props.handleApprove();
    }

    render() {
        return <div><Dialog
            open={this.props.showDeleteAlert}
            onClose={this.handleClose}
        >
            <DialogTitle id="delete-dialog-title">מחיקת חברה</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    כל נתוני "{this.props.companyName}" ימחקו לצמיתות.
                    האם להמשיך בתהליך המחיקה?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleAprove} color="primary" autoFocus variant="contained">לאשר מחיקה</Button>
                <Button onClick={this.handleClose} variant="contained">לבטל פעולה</Button>
            </DialogActions>
        </Dialog>
        </div>
    }
}

export default DeleteAlert;