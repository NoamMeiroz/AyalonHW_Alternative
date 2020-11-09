import React, { Component } from 'react';
import Sites from './Sites';
import DownloadButton from './DownloadButton';
import Table from '../common/Table';

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
                    { title: '# סניפים', field: 'SITE_COUNT' },
                    { title: '# עובדים', field: 'EMP_COUNT' },
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
                        tooltip: 'אתרי החברה',
                        render: rowData => {
                            return (
                                <Sites sites={rowData.Sites} style={{padding: 0}}/>)
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
                    Action: row => (
                        <DownloadButton fontSize = "small"
                            csvData={row.data} fileName={row.data.NAME}
                        />
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
