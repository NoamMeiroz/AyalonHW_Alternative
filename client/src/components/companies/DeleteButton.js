import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import DeleteAlert from './DeleteAlert';
import Tooltip from '@material-ui/core/Tooltip';

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
        if (this.props.csvData.EMPLOYEES_READY === 1) {
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
