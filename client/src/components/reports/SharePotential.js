import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import PrintRoundedIcon from '@material-ui/icons/PrintRounded';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import ReactToPrint from 'react-to-print';

import Table from '../common/Table';
import Report from '../common/Report';
import Company from './Company';
import * as actions from '../../actions';
import requireAuth from '../requireAuth'; //used to check if login successfull

import './SharePotential.css';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

class SharePotential extends Component {

    state = {
        company: null
    }

  /*  componentDidMount() {
        this.props.getData();
        this.props.getSettlementList();
    }*/

    handleCreateReport = () => {
        if (this.state.company)
            this.props.getSharePotential(this.state.company);
    }

    handleDownload = () => {
        if (this.props.rowData)
            this.exportToCSV(this.props.rowData, "פוטנציאל שיתוף לפי ערים");
    }

    handlePrint = () => {
        if (this.props.rowData)
            window.print();
    }

    exportToCSV = async (csvData, fileName) => {
        let wb = new ExcelJS.Workbook();
        let ws = wb.addWorksheet('פוטנציאל שיתוף');

        // set columns 
        ws.columns = [
            { header: 'שם חברה', key: 'COMPANY', width: 25 },
            { header: 'מוצא', key: 'LIVING_CITY', width: 25 },
            { header: 'יעד', key: 'WORK_CITY', width: 25 },
            { header: 'כמות עובדים', key: 'COUNTER', width: 12 }
        ];

        // make header bold
        ws.getRow(1).font = { bold: true }

        // add data
        ws.addRows(csvData);

        ws.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            row.height = 20;
        });
        const buffer = await wb.xlsx.writeBuffer();
        const data = new Blob([buffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    render() {
        return <div>
            <Grid
                container
                spacing={2}
                alignItems="flex-start"
            >
                <Grid container item spacing={2}>
                    <Grid item xs={3}>
                        <Autocomplete
                            size="small"
                            style={{ paddingRight: 24 }}
                            id="tags-standard"
                            options={this.props.companies}
                            getOptionLabel={(option) => option.NAME}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="שם חברה"
                                />
                            )}
                            onChange={(event, value) => {
                                if (value)
                                    this.setState({ company: value.id })
                                else
                                    this.setState({ company: null })
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button className="Button" variant="contained" color="primary"
                            disabled={!this.state.company}
                            onClick={this.handleCreateReport}>הפקה</Button>
                    </Grid>

                    <Grid item xs={7} container justify="flex-end">
                        <ReactToPrint
                            trigger={() => {
                                return <Tooltip title="הדפסה"><span><IconButton color="primary" aria-label="הדפסה" disabled={!this.props.rowData}>
                                    <PrintRoundedIcon />
                                  </IconButton></span></Tooltip>
                            }}
                            content={() => {if (this.props.rowData) {
                                return this.componentRef
                            }}}
                        />
                        <Tooltip title="שמירת דוח כ EXCEL">
                            <span>
                                <IconButton color="primary" aria-label="שמירת דוח כ EXCEL" disabled={!this.props.rowData}
                                    onClick={this.handleDownload}>
                                    <SaveRoundedIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Table columns={[
                            { title: 'מוצא', field: 'LIVING_CITY' },
                            { title: 'יעד', field: 'WORK_CITY' },
                            { title: 'כמות עובדים', field: 'SUM', defaultSort: "desc" },
                        ]}
                            data={this.props.data}
                            detailPanel={[
                                {
                                    tooltip: 'פרטי חברות',
                                    render: rowData => {
                                        return (
                                            <Company companies={rowData.DETAILS} style={{ padding: 0 }} />)
                                    },
                                }
                            ]}
                            title="איתור עובדים קרובים מבחינת גיאוגרפיה"
                            options={{
                                pageSize: 10,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                emptyRowsWhenPaging: false
                            }}
                        />
                    </Grid>

                </Grid>
            </Grid>
            <div style={{ display: "none" }}>
                <Report 
                columns={[
                    { title: 'שם חברה', field: 'COMPANY' },
                    { title: 'מוצא', field: 'LIVING_CITY', defaultSort: "asc" },
                    { title: 'יעד', field: 'WORK_CITY'},
                    { title: 'כמות עובדים', field: 'COUNTER'},
                ]}
                    data={this.props.rowData}
                    title="איתור עובדים קרובים מבחינת גיאוגרפיה"
                    ref={el => (this.componentRef = el)}
                />
            </div>
        </div>;
    }
}

function mapStateToProps(state) {
    let companies = [];
    let settlementList = [];
    let computeData = {};
    let data = [];
    if (state.loadData.companyList) {
        companies = state.loadData.companyList;
    }
    if (state.reports.settlementList) {
        settlementList = state.reports.settlementList;
    }
    if (state.reports.sharePotential) {
        // group living cities and sum the amout of employees 
        for (let row of state.reports.sharePotential) {
            let workCity = {}
            // if work city does not exists then add new work city information
            if (!computeData[row.WORK_CITY]) {
                computeData[row.WORK_CITY] = {};
            }
            workCity = computeData[row.WORK_CITY];

            // if living city in the work city exists then add the emplyees counter to the sum
            if (workCity[row.LIVING_CITY]) {
                workCity[row.LIVING_CITY].sum = workCity[row.LIVING_CITY].sum + row.COUNTER;
                workCity[row.LIVING_CITY].details.push(row);
            }
            else {
                workCity[row.LIVING_CITY] = {};
                workCity[row.LIVING_CITY].sum = row.COUNTER;
                workCity[row.LIVING_CITY].details = [row];
            }
            computeData[row.WORK_CITY] = workCity;
        }
        // convert information to array of objects
        for (const workCity in computeData) {
            for (const livingCity in computeData[workCity]) {
                data.push({
                    WORK_CITY: workCity,
                    LIVING_CITY: livingCity,
                    SUM: computeData[workCity][livingCity].sum,
                    DETAILS: computeData[workCity][livingCity].details
                });
            }
        }
    }
    return { companies: companies, settlementList: settlementList, rowData: state.reports.sharePotential, data: data };
};

export default requireAuth(
    connect(mapStateToProps, actions)(SharePotential));