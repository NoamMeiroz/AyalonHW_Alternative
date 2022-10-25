import React, { useEffect } from "react";

import { connect } from "react-redux";
import * as actions from "../../actions";
import Datagrid from "./Datagrid";
import { isValidNumber, NumberCell } from './NumberCell';

const MINIMUM_LIVING_IN_SAME_CITY = "MINIMUM_LIVING_IN_SAME_CITY";
const LIVING_WORKING_IN_SAME_CITY = "LIVING_WORKING_IN_SAME_CITY";
const MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK = "MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK";
const MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR = "MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR";

const columns = [
    {
        field: "NAME",
        headerName: "סוג פתרון",
        width: 200,
        cellClassName: "disabled_cell",
    },
    {
        field: MINIMUM_LIVING_IN_SAME_CITY,
        headerName: "מינימום גרים באותה עיר",
        width: 200,
        editable: true,
        type: "number",
        preProcessEditCellProps: (params) => {
            const MIN = 0;
            const MAX = 1000000;
            let errorMessage = isValidNumber(params, MAX, MIN);
            return { ...params.props, error: errorMessage };
        },
        renderEditCell: (params) => {
            return <NumberCell {...params} />;
        },
    },
    {
        field: LIVING_WORKING_IN_SAME_CITY,
        headerName: "עבודה ומגורים באותה עיר",
        width: 200,
        editable: true,
        type: "boolean",
        preProcessEditCellProps: (params) => {
            let errorMessage = false;
            if (params.props.value === null || ((params.props.value !== false) && (params.props.value !== true)))
                errorMessage = "ערך אינו חוקי";
            
            return { ...params.props, error: errorMessage };
        },
        // renderEditCell: (params) => {
        //     return <NumberCell {...params} />;
        // },
    },
    {
        field: MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK,
        headerName: "כמות מינימלית אשר מגיעים לעבודה באותה שעה",
        width: 400,
        editable: true,
        type: "number",
        preProcessEditCellProps: (params) => {
            const MIN = 0;
            const MAX = 1000000;
            let errorMessage = isValidNumber(params, MAX, MIN);
            return { ...params.props, error: errorMessage };
        },
        renderEditCell: (params) => {
            return <NumberCell {...params} />;
        },
    },
    {
        field: MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR,
        headerName: "כמות מינימלית אשר יוצאים מהעבודה באותה שעה",
        width: 400,
        editable: true,
        type: "number",
        preProcessEditCellProps: (params) => {
            const MIN = 0;
            const MAX = 1000000;
            let errorMessage = isValidNumber(params, MAX, MIN);
            return { ...params.props, error: errorMessage };
        },
        renderEditCell: (params) => {
            return <NumberCell {...params} />;
        },
    },
];

function SolutionLimits({ rows, dispatch }) {

    useEffect(() => {
        dispatch(actions.getSolutionLimits());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const processRowUpdate = React.useCallback(
        async (newRow, originalRow) => {
            const editRow = {};

            if (newRow[MINIMUM_LIVING_IN_SAME_CITY]!==originalRow[MINIMUM_LIVING_IN_SAME_CITY]) {
                editRow["id"] = newRow[`${MINIMUM_LIVING_IN_SAME_CITY}_id`];
                editRow["VALUE"] = newRow[MINIMUM_LIVING_IN_SAME_CITY];
                editRow["TYPE"] = newRow[`${MINIMUM_LIVING_IN_SAME_CITY}_type`];
            }
            else if (newRow[LIVING_WORKING_IN_SAME_CITY]!==originalRow[LIVING_WORKING_IN_SAME_CITY]) {
                editRow["id"] = newRow[`${LIVING_WORKING_IN_SAME_CITY}_id`];
                editRow["VALUE"] = newRow[LIVING_WORKING_IN_SAME_CITY];
                editRow["TYPE"] = newRow[`${LIVING_WORKING_IN_SAME_CITY}_type`];
            }
            else if (newRow[MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK]!==originalRow[MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK]) {
                editRow["id"] = newRow[`${MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK}_id`];
                editRow["VALUE"] = newRow[MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK];
                editRow["TYPE"] = newRow[`${MINIMUM_ARRIVING_IN_SAME_HOUR_TO_WORK}_type`];
            }
            else if (newRow[MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR]!==originalRow[MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR]) {
                editRow["id"] = newRow[`${MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR}_id`];
                editRow["VALUE"] = newRow[MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR];
                editRow["TYPE"] = newRow[`${MINIMUM_EXIT_FROM_WORK_IN_SAME_HOUR}_type`];
            } 
            dispatch(actions.setSolutionLimits(editRow));
            return newRow;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleProcessRowUpdateError = React.useCallback((error) => {
        dispatch(actions.showMessage, error);
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const pivotData = {};
    for (const row of rows) {
        if (!pivotData[row.NAME])
            pivotData[row.NAME] = {};
        pivotData[row.NAME][row.LIMIT_NAME] = row.VALUE;
        pivotData[row.NAME][`${row.LIMIT_NAME}_id`] = row.id;
        pivotData[row.NAME][`${row.LIMIT_NAME}_type`] = row.TYPE;

    }
    const data = [];
    let id = 0;
    for (const [key, value] of Object.entries(pivotData)) {
        id++;
        const row = { ...{ "id": id, "NAME": key }, ...value };
        data.push(row);
    }

    return <Datagrid rows={data} columns={columns}
        processRowUpdate={processRowUpdate}
        handleProcessRowUpdateError={handleProcessRowUpdateError}
        editMode="cell" />
}

function mapStateToProps(state) {
    let rows = [];
    if (state.algorithmSettings.solutionLimits) {
        rows = state.algorithmSettings.solutionLimits;
    }
    return { rows: rows };
}

export default connect(mapStateToProps, null)(SolutionLimits);
