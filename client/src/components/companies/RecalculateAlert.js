import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

class RecalculateAlert extends Component {

    handleClose = () => {
        this.props.handleClose();
    }

    handleAprove = () => {
        this.props.handleApprove();
    }

    render() {
        return <div><Dialog
            open={this.props.showRecacluclateAlert}
            onClose={this.handleClose}
        >
            <DialogTitle id="recalculateAlert-dialog-title">חישוב מסלולים וציונים</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    האם לחשב מסלולים מסלולים מומלצים וציונים מחדש?
                    ציונים ומסלולים קיימים יימחקו.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleAprove} color="primary" autoFocus variant="contained">הפעלת חישוב</Button>
                <Button onClick={this.handleClose} variant="contained">לבטל פעולה</Button>
            </DialogActions>
        </Dialog>
        </div>
    }
}

export default RecalculateAlert;