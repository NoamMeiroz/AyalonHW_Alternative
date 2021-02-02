import React, { createRef, Component } from 'react';
import { connect } from 'react-redux';

import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';
import {UPLOAD_IN_PROGRESS} from '../../actions/const'
import CompanyTable from './CompanyTable';
import OverideAlert from './OverideAlert';
import * as excelUtil from '../../utils/excelUtil';
import './Companies.css';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownload from '@material-ui/icons/CloudDownload';

const labelText = "טעינת נתוני חברה";
const templateLabelText = "קובץ קלט לדוגמה";
const acceptFiles = ".xlsx, .xls";

class Companies extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showOverideAlert: false,
            selectedFile: ""
        };
    }

    fileInput = createRef();

    /**
     * Extract company name from file
     * @param {*} file 
     */
    getCompanyName = async (file) => {

        const company_sheets = await excelUtil.load_data(file);
        let companyName = null;
        try {
            companyName = company_sheets["מעסיקים"][0]["שם חברה"];
        }
        catch (error) {
            console.log(error);
            // didn't find any name. so return null;
        }
        return companyName;

    }

    /**
     * return true if comapnyName is in list.
     * @param {list of comapnies} companyList 
     * @param {string} companyName 
     */
    isCompanyExist = (companyList, companyName) => {
        const filteredList = companyList.filter(company => {
            return company.NAME === companyName
        });
        return filteredList.length > 0;
    }


    readFileContent = (file) => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsArrayBuffer(file);
        })
    }

    /**
     * select a file to upload.
     * If company exists in db then ask if to overide else upload
     * @param {*} event 
     */
    handleFile = async (event) => {
        event.preventDefault();
        const selectedFile = await event.target.files[0];
        this.readFileContent(selectedFile)
            .then(async excelFile => {
                const companyName = await this.getCompanyName(excelFile);
                if (this.isCompanyExist(this.props.loadData.companyList, companyName)) {
                    this.setState({ showOverideAlert: true, selectedFile: selectedFile });
                    this.fileInput.current.value = ""; //this is needed to clear the selected file so we can reload the same file
                }
                else {
                    this.props.upload(selectedFile);
                    this.fileInput.current.value = ""; //this is needed to clear the selected file so we can reload the same file
                }
            })
            .catch(error => {
                this.props.showMessage("לא ניתן לטעון את הקובץ הנבחר");
                this.fileInput.current.value = ""; //this is needed to clear the selected file so we can reload the same file
            });
    }

    handleOverideAlert = () => {
        this.setState({ showOverideAlert: false });
        this.props.upload(this.state.selectedFile);
    }

    handleCloseAlert = () => {
        this.setState({ showOverideAlert: false, selectedFile: "" });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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
                    <div className="actionButton">
                        <input
                            accept={acceptFiles}
                            className="hidden"
                            id="contained-button-file"
                            type="file"
                            onChange={this.handleFile}
                            ref={this.fileInput}
                        />
                        <label htmlFor="contained-button-file">
                            <Button color="primary" variant="contained" component="span" size="small">
                                <Box display="flex" alignItems="center" flexDirection="column">
                                    <CloudUploadIcon style={{ fontSize: 20 }} />
                                    {labelText}
                                </Box>
                            </Button>
                        </label>
                    </div>
                    <Link className="actionButton" href="/template.xlsx" underline="none">
                        <Button variant="contained" component="span" size="small">
                            <Box display="flex" alignItems="center" flexDirection="column">
                                <CloudDownload style={{ fontSize: 20 }} />
                                {templateLabelText}
                            </Box>
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <CompanyTable
                        data={this.props.loadData.companyList}
                        sectors={this.props.loadData.sectorList}
                    />
                </Grid>
            </Grid>
            <OverideAlert showOverideAlert={this.state.showOverideAlert} handleClose={this.handleCloseAlert}
                handleApprove={this.handleOverideAlert}></OverideAlert>
        </div>
    }
}


function mapStateToProps(state) {
    return {
        loadData: {
            sectorList: state.loadData.sectorList,
            isSuccess: state.loadData.isSuccess,
            companyList: state.loadData.companyList,
            timestamp: state.loadData.timestamp
        },
        uploadFile: {
            newCompany: state.uploadFile.data,
            isSuccess: state.uploadFile.isSuccess,
            timestamp: state.uploadFile.timestamp
        },
    };
}

export default requireAuth(
    connect(mapStateToProps, actions)(Companies));

