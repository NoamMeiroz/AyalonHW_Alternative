import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';

//import worker from 'workerize-loader!../../worker'; // eslint-disable-line import/no-webpack-loader-syntax
import worker from "../../worker.js";
import WebWorker from "../../workerSetup";
import * as actions from '../../actions';

import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';

import { SERVER } from '../../utils/config';


class DownloadButton extends Component {

    constructor() {
        super();
        this.fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        this.fileExtension = '.xlsx';
        this.state = { uploadProgess: 0, isWorkerStarted: false };

    }

    // function to handle status from worker;
    receive = event => {
        let uploadProgess = event.data;
        if (uploadProgess) {
            this.setState({ uploadProgess: uploadProgess });
        }
    };


    saveEmployeesList = (employerId, fileName) => {
        axios.get(`${SERVER}/api/employer/${employerId}/employee`)
            .then(payload => {
                let employeeList = payload.data;
                if (employeeList && !(typeof employeeList === "string")) {
                    this.exportToCSV(employeeList, fileName);
                }
            }).catch(err => {
                let message = "";
                if (err.response.status === 500) {
                    message = "בעיה במערכת";
                }
                else
                    message = err.response.data;
                this.props.callFail(message);
            });
    }

    exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: this.fileType });
        FileSaver.saveAs(data, fileName + this.fileExtension);
    }

    render() {
        let jsx = {};
        if (this.props.csvData.EMPLOYEES_READY)
            jsx = <IconButton color="primary" aria-label="upload picture" component="span"
                onClick={(e) => { this.saveEmployeesList(this.props.csvData.id, this.props.fileName) }}>
                <SaveRoundedIcon />
                {this.state.count}
            </IconButton>;
        else {
            if (!this.state.isWorkerStarted) {
                this.workerInstance = new WebWorker(worker);
                this.workerInstance.addEventListener('message', this.receive);
                this.setState({ isWorkerStarted: true });
                this.workerInstance.postMessage("start");
            }
            jsx = <div>
            <Typography variant="caption" color="textSecondary">טעינת עובדים</Typography>
            <Box position="relative" display="inline-flex">
                <CircularProgress variant="static" value={this.state.uploadProgess} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" component="div" color="textSecondary">{`${this.state.uploadProgess}%`}</Typography>
                </Box>
            </Box>
            </div>
        }
        return jsx;
    }
}

export default connect(null, actions)(DownloadButton);