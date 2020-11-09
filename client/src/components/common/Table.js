import React, { Component } from 'react';
import MaterialTable from 'material-table';

import './Table.css';

const localization = {
    header: {
        actions: ''
    },
    body: {
        emptyDataSourceMessage: 'אין נתונים להצגה',
        filterRow: {
            filterTooltip: 'סינון'
        }
    },
    toolbar: {
        searchTooltip: "חיפוש",
        searchPlaceholder: "חיפוש"
    },
    pagination: {
        labelDisplayedRows: '{from}-{to} מתוך {count}',
        labelRowsSelect: 'שורות',
        labelRowsPerPage: 'שורות בעמוד',
        firstAriaLabel: 'עמוד ראשון',
        firstTooltip: 'עמוד ראשון',
        previousAriaLabel: 'עמוד קודם',
        previousTooltip: 'עמוד קודם',
        nextAriaLabel: 'עמוד הבא',
        nextTooltip: 'עמוד הבא',
        lastAriaLabel: 'עמוד אחרון',
        lastTooltip: 'עמוד אחרון'
    }
}

const defaultStyle = {
    cellStyle: {
        width: 20,
        height: 10,
        maxWidth: 20,
        padding: 0,
        textAlign: 'right',
        lineHeight: '1vmax',
        fontSize: '1.2vmax',
        letterSpacing: "0px",
        color: "#242736",
        opacity: 1
    },
    headerStyle: {
        height: 20,
        maxHeight: 20,
        fontSize: '1vmax',
        fontWeight: "bold"
    }
}

class Table extends Component {
    render() {

        const newOption = this.props.options;
        let options = { ...defaultStyle, ...newOption };

        return <div>
            <MaterialTable
                style={{boxShadow: "none"}}
                {...this.props}
                options={ options } 
                localization={ localization }
            />
        </div>
    }
}

export default Table;
