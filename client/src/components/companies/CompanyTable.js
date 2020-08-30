import React, { Component } from 'react';
import MaterialTable from 'material-table';
import Sites from './Sites';
import DownloadButton from './DownloadButton';

class CompanyTable extends Component {

    render() {
        let companyList = [];
        let sectorsList = {};
        if (this.props.data) {
            companyList = this.props.data;
            for (const company of companyList) {
                let sum = company.Sites.reduce((sum, site) => {
                    return (sum + site.NUM_OF_EMPLOYEES);
                }, 0);
                company.EMP_COUNT = sum;
                company.SITE_COUNT = company.Sites.length
            }
        }
        if (this.props.sectors)
            sectorsList = this.props.sectors;
        let jsx = <div style={{ maxWidth: '100%' }}>
            <MaterialTable
                columns={[
                    { title: 'שם חברה', field: 'NAME' },
                    { title: '# סניפים', field: 'SITE_COUNT' },
                    { title: '# עובדים', field: 'EMP_COUNT'},
                    { title: 'מגזר', field: 'SECTOR', lookup: sectorsList },
                    { title: 'רכב צמוד', field: 'PRIVATE_CAR_SOLUTION', type: 'boolean' },
                    { title: 'שאטלים', field: 'SHUTTLE_SOLUTION', type: 'boolean' },
                    { title: 'הסעות', field: 'MASS_TRANSPORTATION_SOLUTION', type: 'boolean' },
                    { title: 'Carpool', field: 'CAR_POOL_SOLUTION', type: 'boolean' },
                    { title: 'עבודה מהבית', field: 'WORK_FROM_HOME_SOLUTION', type: 'boolean' }
                ]}
                data={companyList}
                title="רשימת חברות"
                detailPanel={[
                    {
                        tooltip: 'Show Name',
                        render: rowData => {
                            return (
                                <Sites sites={rowData.Sites}/>)
                        },
                    }
                ]}
                actions={[
                    {
                        icon: "save",
                        tooltip: 'שמירה',
                        onClick: (event, rowData) => alert("You saved " + rowData.name)
                    }
                ]}
                components={{
                    Action: props => (
                      <DownloadButton
                        csvData={props.data} fileName={props.data.NAME} callFail={props.callFail}
                      />
                    )
                }}
                options={{
                    actionsColumnIndex: -1
                }}
                localization={{
                    header: {
                        actions: ''
                    },
                    body: {
                        emptyDataSourceMessage: 'אין נתונים להצגה',
                        filterRow: {
                            filterTooltip: 'סינון'
                        }
                    }
                }}
             />
            </div>;
        return jsx;
    }
}

export default CompanyTable;
