import React, { Component } from 'react';
import { connect } from 'react-redux';

import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';
import CompanyTable from './CompanyTable';
import './Companies.css';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LoadStatusSnackBar from './LoadStatusSnackBar';

const labelText = "טעינת נתוני חברה";
const acceptFiles = ".xlsx, .xls";

class Companies extends Component {

    state = {
        showSnackBar: false,
        snackBarMessage: "",
        companyList: [],
    };

    constructor(props) {
        super(props);
        this.snackBarElement = React.createRef();
        this.fileInput = React.createRef();
    }

    handleFile = event => {
        event.preventDefault();
        let selectedFile = event.target.files[0];
        this.props.upload(selectedFile);
        this.fileInput.current.value = ""; //this is needed to clear the selected file so we can
        // reload the same file once again
    }

    componentDidMount() {
        this.props.getData();
    }

    showMessage = (message) => {
        this.snackBarElement.current.showSnackBar(true, message);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // check if to handle uploadFile results
        if (this.props.uploadFile.timestamp !== prevProps.uploadFile.timestamp) {
            if (this.props.uploadFile.isSuccess) {
                this.showMessage("נתוני חברה בתהליך טעינה...");
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
            else
                this.showMessage(this.props.uploadFile.errorMessage);
        }
        // check if to show load initial employers data error message
        if (this.props.loadData.timestamp !== prevProps.loadData.timestamp) {
            if (!this.props.loadData.isSuccess)
                this.showMessage(this.props.loadData.errorMessage);
        }
        // check if to show check employees loading progress error message
        if (this.props.employeesData.timestamp !== prevProps.employeesData.timestamp) {
            if (this.props.employeesData.errorMessage !== "" || this.props.employeesData.uploadProgess === 100) {
                clearInterval(sessionStorage.getItem(this.props.employeesData.employerID));
                sessionStorage.removeItem(this.props.employeesData.employerID);
                if (this.props.employeesData.errorMessage !== "")
                    this.showMessage(this.props.employeesData.errorMessage);
            }
        }


    }

    render() {
        return <div className="root">
            <Grid
                spacing={3}
                container
                direction="row"
                justify="space-around">
                <Grid container item sm={10} justify="flex-end">
                    <div>
                        <input
                            accept={acceptFiles}
                            className="hidden"
                            id="contained-button-file"
                            type="file"
                            onChange={this.handleFile}
                            ref={this.fileInput}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                                <Box display="flex" alignItems="center" flexDirection="column">
                                    <CloudUploadIcon style={{ fontSize: 20 }} />
                                    {labelText}
                                </Box>
                            </Button>
                        </label>
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <CompanyTable
                        data={this.props.loadData.companyList}
                        sectors={this.props.loadData.sectorList}
                        callFail={this.showMessage} />
                </Grid>
            </Grid>
            <LoadStatusSnackBar ref={this.snackBarElement} />
        </div>
    }
}

function mapStateToProps(state) {
    let tempList = []
    if (state.loadData.companyList)
        tempList = state.loadData.companyList;
    // add new company to tempList which will be the new updated companyList
    if (state.uploadFile.data) {
        // remove old company if exists
        tempList = tempList.filter(company => {
            return (company.NAME !== state.uploadFile.data.NAME);
        });
        tempList = [...tempList, state.uploadFile.data];
    }

    return {
        uploadFile: {
            newCompany: state.uploadFile.data,
            isSuccess: state.uploadFile.isSuccess,
            errorMessage: state.uploadFile.errorMessage,
            timestamp: state.uploadFile.timestamp
        },
        loadData: {
            sectorList: state.loadData.sectorList,
            isSuccess: state.loadData.isSuccess,
            errorMessage: state.loadData.errorMessage,
            companyList: tempList,
            timestamp: state.loadData.timestamp
        },
        employeesData: {
            employerID: state.employeesData.employerID,
            uploadProgess: state.employeesData.uploadProgess,
            errorMessage: state.employeesData.errorMessage,
            timestamp: state.employeesData.timestamp
        }
    };
}

export default requireAuth(
    connect(mapStateToProps, actions)(Companies));

