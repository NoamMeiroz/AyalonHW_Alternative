import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import IconButton from '@material-ui/core/IconButton';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import Tooltip from '@material-ui/core/Tooltip';
import RecalculateAlert from './RecalculateAlert';


class RecalculateButton extends Component {

    state = {
        showRecalculateAlert: false
    }


    handleApprove = () => {
        this.setState({ showRecalculateAlert: false });
        this.props.recalculate(this.props.csvData.id);
    }

    handleCloseAlert = () => {
        this.setState({ showRecalculateAlert: false });
    }

    showAlert = () => {
        this.setState({ showRecalculateAlert: true });
    }

    render() {
        let jsx = {};
        if (this.props.csvData.EMPLOYEES_READY === 1) {
            jsx = <div>
                <Tooltip title="חישוב ציונים ומסלולים">
                    <IconButton color="primary" aria-label="recalculate routes" component="span" style={{ padding: '2px' }}
                        onClick={(e) => this.showAlert()}>
                        <DonutLargeIcon />
                    </IconButton>
                </Tooltip>
                <RecalculateAlert id={`recalcAlert_${this.props.csvData.id}`}
                    showRecacluclateAlert={this.state.showRecalculateAlert}
                    handleClose={this.handleCloseAlert}
                    handleApprove={this.handleApprove}
                    companyName={this.props.csvData.NAME}>
                </RecalculateAlert>
            </div>
        }
        else
            jsx = null;
        return jsx;
    }
}

export default connect(null, actions)(RecalculateButton);
