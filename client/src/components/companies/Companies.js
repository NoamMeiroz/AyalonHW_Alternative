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
        companyList: []
    };

    constructor(props) {
        super(props);
        this.snackBarElement = React.createRef();
        this.fileInput = React.createRef();
    }

    handleFile = event => {
        event.preventDefault();
        let selectedFile = event.target.files[0];
        this.props.upload(selectedFile, (isLoaded, data) => {
            if (isLoaded) {
                this.snackBarElement.current.showSnackBar(true, "נתוני חברה נטענו בהצלחה");
                let tempList = this.state.companyList.filter(company=>{
                    return (company.NAME !== data.NAME );  
                });
                console.log(data);
                this.setState({
                    companyList: [...tempList, data]
                });
            }
            else
                this.snackBarElement.current.showSnackBar(true, data);
        });
        this.fileInput.current.value = ""; //this is needed to clear the selected file so we can
        // reload the same file once again
    }

    componentDidMount() {
       this.props.getData();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.props.companyList !== prevProps.companyList) {
            this.setState({companyList: this.props.companyList});
        }
    }

    callFail(message) {
        this.snackBarElement.current.showSnackBar(true, message);
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
                    <CompanyTable data={this.state.companyList} sectors={this.props.sectorList} />
                </Grid>
            </Grid>
            <LoadStatusSnackBar ref={this.snackBarElement} />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: state.files.isLoaded,
        errorMessage: state.files.errorMessage,
        sectorList : state.loadData.sectorList,
        companyList: state.loadData.companyList
    };
}

export default requireAuth(
    connect(mapStateToProps, actions)(Companies));

