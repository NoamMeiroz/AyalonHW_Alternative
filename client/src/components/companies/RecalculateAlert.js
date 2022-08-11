import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

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