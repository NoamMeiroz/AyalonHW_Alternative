import React, { createRef, Component } from 'react';
import { connect } from 'react-redux';

import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import OverideAlert from './OverideAlert';
import * as excelUtil from '../../utils/excelUtil';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const labelText = "טעינת נתוני חברה";
const acceptFiles = ".xlsx, .xls";


class CompanyUploadButton extends Component {

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

    render() {
        return <div className="actionButton">
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
            <OverideAlert showOverideAlert={this.state.showOverideAlert} handleClose={this.handleCloseAlert}
                handleApprove={this.handleOverideAlert}></OverideAlert>
        </div>
    }
}


function mapStateToProps(state) {
    let newProps = {loadData: {
        isSuccess: state.loadData.isSuccess,
        companyList: state.loadData.companyList,
        timestamp: state.loadData.timestamp
    }}
    return newProps;
}

export default requireAuth(
    connect(mapStateToProps, actions)(CompanyUploadButton));