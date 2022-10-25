import React, { useEffect } from "react";

import { connect } from "react-redux";
import * as actions from "../../actions";
import Datagrid from "./Datagrid";
import { isValidNumber, NumberCell} from './NumberCell';


function getMinAdd(params) {
  const avgAgreement = +params.row.AVG_AGREEMENT;
  const precentToAdd = +((avgAgreement * params.row.MULTI) / 100).toFixed(2);
  return (avgAgreement + precentToAdd).toFixed(2);
}

function getMaxSub(params) {
  const avgAgreement = +params.row.AVG_AGREEMENT;
  const precentToAdd = +((avgAgreement * params.row.MULTI) / 100).toFixed(2);
  return (avgAgreement - precentToAdd).toFixed(2);
}

const columns = [
  {
    field: "NAME",
    headerName: "סוג פתרון",
    width: 200,
    cellClassName: "disabled_cell",
  },
  {
    field: "AVG_AGREEMENT",
    headerName: "ממוצע הסכמה",
    width: 150,
    editable: true,
    type: "number",
    preProcessEditCellProps: (params) => {
      const MIN = 0;
      const MAX = 100;
      let errorMessage = isValidNumber(params, MAX, MIN);
      return { ...params.props, error: errorMessage };
    },
    renderEditCell: (params) => {
      return <NumberCell {...params} />;
    },
  },
  {
    field: "MULTI",
    headerName: "מכפיל לחיזוק/החלשה",
    width: 150,
    editable: true,
    type: "number",
    preProcessEditCellProps: (params) => {
      const MIN = 0;
      const MAX = 100;
      let errorMessage = isValidNumber(params, MAX, MIN);
      return { ...params.props, error: errorMessage };
    },
    renderEditCell: (params) => {
      return <NumberCell {...params} />;
    },
  },
  {
    field: "MIN_ADD",
    headerName: "% מינימלי לחיזוק",
    width: 150,
    cellClassName: "disabled_cell",
    type: "number",
    valueGetter: getMinAdd,
  },
  {
    field: "MAX_SUB",
    headerName: "% מינימלי להחלשה",
    width: 150,
    cellClassName: "disabled_cell",
    type: "number",
    valueGetter: getMaxSub,
  },
  {
    field: "POSITIVE_MARK",
    headerName: "תוספת ציון חיובי",
    width: 150,
    editable: true,
    type: "number",
    preProcessEditCellProps: (params) => {
      const MIN = 0;
      const MAX = 100;
      let errorMessage = isValidNumber(params, MAX, MIN);
      return { ...params.props, error: errorMessage };
    },
    renderEditCell: (params) => {
      return <NumberCell {...params} />;
    },
  },
  {
    field: "NEGATIVE_MARK",
    headerName: "תוספת ציון שלילי",
    width: 150,
    editable: true,
    type: "number",
    preProcessEditCellProps: (params) => {
      const MIN = -100;
      const MAX = 0;
      let errorMessage = isValidNumber(params, MAX, MIN);
      return { ...params.props, error: errorMessage };
    },
    renderEditCell: (params) => {
      return <NumberCell {...params} />;
    },
  },
  {
    field: "NUETRAL_MARK",
    headerName: "תוספת לציון נטרלי",
    width: 150,
    editable: true,
    type: "number",
    preProcessEditCellProps: (params) => {
      const MIN = -100;
      const MAX = 100;
      let errorMessage = isValidNumber(params, MAX, MIN);
      return { ...params.props, error: errorMessage };
    },
    renderEditCell: (params) => {
      return <NumberCell {...params} />;
    },
  },
  {
    field: "DISQUALIFIED_MARK",
    headerName: "ציון לפתרון פסול",
    width: 150,
    editable: true,
    type: "number",
    preProcessEditCellProps: (params) => {
      const MIN = -1000000;
      const MAX = 0;
      let errorMessage = isValidNumber(params, MAX, MIN);
      return { ...params.props, error: errorMessage };
    },
    renderEditCell: (params) => {
      return <NumberCell {...params} />;
    },
  },
];

function SolutionMark({ rows, dispatch }) {

  useEffect(() => {
    dispatch(actions.getSolutionMarks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      dispatch(actions.setSolutionMark(newRow));
      return newRow;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    dispatch(actions.showMessage, error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return <Datagrid rows={rows} columns={columns} 
    processRowUpdate={processRowUpdate}
    handleProcessRowUpdateError={handleProcessRowUpdateError}/>
}

function mapStateToProps(state) {
  let rows = [];
  if (state.algorithmSettings.solutionMarks) {
    rows = state.algorithmSettings.solutionMarks;
  }
  return { rows: rows };
}

export default connect(mapStateToProps, null)(SolutionMark);
