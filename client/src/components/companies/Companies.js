import React, { createRef, Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import requireAuth from '../requireAuth'; //used to check if login successfull
import CompanyTable from './CompanyTable';
import {UPLOAD_IN_PROGRESS} from '../../actions/const'

import './Companies.css';

import Grid from '@material-ui/core/Grid';

class Companies extends Component {

    componentDidUpdate(prevProps, prevState) {
        // check if to handle uploadFile results
        if (this.props.uploadFile && (this.props.uploadFile.timestamp !== prevProps.uploadFile.timestamp)) {
            this.props.showMessage("נתוני חברה בתהליך טעינה...");

            // start check if finished uploading 
            let employerID = this.props.uploadFile.newCompany.id;
            // delete old process interval if exists
            if (sessionStorage.getItem(employerID)) {
                clearInterval(sessionStorage.getItem(employerID));
                sessionStorage.removeItem(employerID)
            }
            //let processID = setInterval(this.props.checkProgress(employerID), 3000);
            let processID = setInterval(() => { this.props.checkProgress(employerID) }, 3000);
            // save process id
            sessionStorage.setItem(employerID, processID);
        }
        // check if to show check employees loading progress 
        if (this.props.loadData && (this.props.loadData.timestamp !== prevProps.loadData.timestamp)) {
            for (let company of this.props.loadData.companyList) {
                if (company.EMPLOYEES_READY !== UPLOAD_IN_PROGRESS) {
                    clearInterval(sessionStorage.getItem(company.id));
                    sessionStorage.removeItem(company.id);
                }
            }
        }
    }

    render() {

        return <div className="root">
            <Grid
                container
                spacing={1}
                direction="row"
                justify="space-around">
                <Grid container item justify="flex-end">
                </Grid>
                <Grid item xs={12}>
                    <CompanyTable
                        data={this.props.loadData.companyList}
                        sectors={this.props.loadData.sectorList}
                    />
                </Grid>
            </Grid>
        </div>
    }
}

function mapStateToProps(state) {
    let newProps = {loadData: {
        isSuccess: state.loadData.isSuccess,
        companyList: state.loadData.companyList,
        sectorList: state.loadData.sectorList,
        timestamp: state.loadData.timestamp
    },
    uploadFile: {
        newCompany: state.uploadFile.data,
        isSuccess: state.uploadFile.isSuccess,
        timestamp: state.uploadFile.timestamp
    }}
    return newProps;
}

export default requireAuth(
    connect(mapStateToProps, actions)(Companies));

