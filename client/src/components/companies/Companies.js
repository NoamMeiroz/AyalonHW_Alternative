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

const labelText = "טעינת נתוני חברה";
const acceptFiles = ".xlsx, .xls";

class Companies extends Component {

    state = {
        companyList: [],
    };

    constructor(props) {
        super(props);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        let tempList = [];

        if (this.props.loadData.timestamp !== prevProps.loadData.timestamp) {
            this.setState({companyList: this.props.loadData.companyList});
        }

        // check if to handle uploadFile results
        if (this.props.uploadFile.timestamp !== prevProps.uploadFile.timestamp) {
            this.props.showMessage("נתוני חברה בתהליך טעינה...");

            // remove old company if exists
            tempList = this.state.companyList;
            tempList = tempList.filter(company => {
                return (company.NAME !== this.props.uploadFile.newCompany.NAME);
            });
            tempList = [...tempList, this.props.uploadFile.newCompany];
            this.setState({companyList: tempList});

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
        // check if to show check employees loading progress error message
        if (this.props.employeesData.timestamp !== prevProps.employeesData.timestamp) {
            if (this.props.employeesData.uploadProgess === 100) {
                clearInterval(sessionStorage.getItem(this.props.employeesData.employerID));
                sessionStorage.removeItem(this.props.employeesData.employerID);
            }
        }


    }

    render() {
        return <div className="root">
            <Grid
                container
                spacing={3}
                direction="row"
                justify="space-around">
                <Grid container item justify="flex-end">
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
                <Grid item xs={12}>
                    <CompanyTable
                        data={this.state.companyList}
                        sectors={this.props.loadData.sectorList}
                    />
                </Grid>
            </Grid>
        </div>
    }
}

function mapStateToProps(state) {
    let tempList = []
    if (state.loadData.companyList)
        tempList = state.loadData.companyList;

    return {
        uploadFile: {
            newCompany: state.uploadFile.data,
            isSuccess: state.uploadFile.isSuccess,
            timestamp: state.uploadFile.timestamp
        },
        loadData: {
            sectorList: state.loadData.sectorList,
            isSuccess: state.loadData.isSuccess,
            companyList: tempList,
            timestamp: state.loadData.timestamp
        },
        employeesData: {
            employerID: state.employeesData.employerID,
            uploadProgess: state.employeesData.uploadProgess,
            timestamp: state.employeesData.timestamp
        }
    };
}

export default requireAuth(
    connect(mapStateToProps, actions)(Companies));

