import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import IconButton from '@mui/material/IconButton';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DeleteAlert from './DeleteAlert';
import Tooltip from '@mui/material/Tooltip';

class DeleteButton extends Component {

    state = {
        showDeleteAlert: false
    }


    handleApprove = () => {
        this.setState({ showDeleteAlert: false });
        this.props.deleteCompany(this.props.csvData.id);
    }

    handleCloseAlert = () => {
        this.setState({ showDeleteAlert: false });
    }

    showAlert = () => {
        this.setState({ showDeleteAlert: true });
    }

    render() {
        let jsx = {};
        if (this.props.employeesReady === 1) {
            jsx = <div>
                <Tooltip title="מחיקת חברה">
                    <IconButton color="primary" aria-label="delete company" component="span" style={{ padding: '2px' }}
                        onClick={(e) => this.showAlert()}>
                        <DeleteForeverRoundedIcon />
                    </IconButton>
                    </Tooltip>

                <DeleteAlert id={`deleteAlert_${this.props.csvData.id}`}
                    showDeleteAlert={this.state.showDeleteAlert}
                    handleClose={this.handleCloseAlert}
                    handleApprove={this.handleApprove}
                    companyName={this.props.csvData.NAME}>
                </DeleteAlert>
            </div>
        }
        else
            jsx = null;
        return jsx;
    }
}

export default connect(null, actions)(DeleteButton);
