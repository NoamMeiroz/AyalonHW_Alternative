import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

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