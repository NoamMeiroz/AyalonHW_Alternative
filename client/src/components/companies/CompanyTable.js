import React, { Component } from 'react';
import { MTableToolbar } from "@material-table/core";
import Sites from './Sites';
import DownloadButton from './DownloadButton';
import DeleteButton from './DeleteButton';
import RecalculateButton from './RecalculateButton';
import CompanyUploadButton from './CompanyUploadButton';
import TemplateButton from './TemplateButton';
import Table from '../common/Table';
import Grid from '@mui/material/Grid';


import './CompanyTable.css';

class CompanyTable extends Component {

    render() {
        let companyList = [];
        let sectorsList = {};
        if (this.props.data) {
            companyList = this.props.data;
        }
        if (this.props.sectors)
            sectorsList = this.props.sectors;
        let jsx = <Table
            columns={[
                { title: 'שם חברה', field: 'NAME' },
                { title: 'סה"כ סניפים', field: 'NUMBER_OF_SITES' },
                { title: 'סה"כ עובדים', field: 'NUMBER_OF_EMPLOYEES' },
                { title: 'מגזר', field: 'SECTOR', lookup: sectorsList },
                { title: 'רכב צמוד', field: 'PRIVATE_CAR_SOLUTION', type: 'boolean' },
                { title: 'שירותי הסעות', field: 'MASS_TRANSPORTATION_SOLUTION', type: 'boolean' },
                { title: 'Carpool', field: 'CAR_POOL_SOLUTION', type: 'boolean' },
                { title: 'עבודה מהבית', field: 'WORK_FROM_HOME_SOLUTION', type: 'boolean' },
                { title: '# אתרים שנקלטו', field: 'SITE_COUNT' },
                { title: '# עובדים שנקלטו', field: 'EMP_COUNT_DESC' }
            ]}
            data={companyList}
            title="רשימת חברות"
            detailPanel={[
                {
                    tooltip: 'אתרי החברה',
                    render: rowData => {
                        return (
                            <Sites sites={rowData.rowData.Sites} style={{ padding: 0 }} />)
                    },
                }
            ]}
            actions={[
                rowData => ({
                    icon: () => <DownloadButton fontSize="small" csvData={rowData} fileName={rowData.NAME} />,
                    tooltip: 'דוח טעינה'
                })
            ]}
            components={{
                Action: props => (
                    <Grid container direction="row" spacing={1} style={{width:'80px'}}>
                        <Grid item xs={4}>
                            <DownloadButton key= {`downloadButton_${props.data.id}`}
                                id={`downloadButton_${props.data.id}`} fontSize="small" csvData={props.data} fileName={props.data.NAME} />
                        </Grid>
                        <Grid item xs={4}>
                            <RecalculateButton id={`recalcButton_${props.data.id}`}
                                fontSize="small" csvData={props.data} />
                        </Grid>
                        <Grid item xs={4}>
                            <DeleteButton id={`deleteButton_${props.data.id}`}
                                fontSize="small" csvData={props.data} />
                        </Grid>
                    </Grid>
                ),
                Toolbar: props => (
                    <Grid container direction="row">
                        <Grid item xs={8}>
                            <MTableToolbar {...props} />
                        </Grid>
                        <Grid container item xs={4} direction="row" justify="flex-end">
                            <Grid item>
                                <CompanyUploadButton />
                            </Grid>
                            <Grid item>
                                <TemplateButton />
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }}
            options={{
                actionsColumnIndex: -1
            }}
        />;
        return jsx;
    }
}

export default CompanyTable;
