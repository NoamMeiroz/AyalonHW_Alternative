import React, { useEffect } from "react";

import { connect } from "react-redux";
import * as actions from "../../actions";
import Datagrid from "./Datagrid";
import { isValidNumber, NumberCell} from './NumberCell';


const columns = [
  {
    field: "SOLUTION",
    headerName: "סוג פתרון",
    width: 200,
    cellClassName: "disabled_cell",
  },
  {
    field: "PROPERTY",
    headerName: "מאפיין",
    width: 200,
    cellClassName: "disabled_cell",
  },
  {
    field: "CATEGORY",
    headerName: "קטגוריה    ",
    width: 200,
    cellClassName: "disabled_cell",
  },
];

function SolutionPropertiesValues({ rows, dispatch }) {

  useEffect(() => {
    dispatch(actions.getSolutionPropertiesValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      dispatch(actions.setSolutionMark(newRow));
      return newRow;
    },
    [],
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    dispatch(actions.showMessage, error);
  }, []);
  

  return <Datagrid rows={rows} columns={columns} 
    processRowUpdate={processRowUpdate}
    handleProcessRowUpdateError={handleProcessRowUpdateError}/>
}

function mapStateToProps(state) {
  let rows = [];
  if (state.algorithmSettings.solutionPropertiesValues) {
    rows = state.algorithmSettings.solutionPropertiesValues;
    console.log(rows);  
  }
  return { rows: rows };
}

export default connect(mapStateToProps, null)(SolutionPropertiesValues);
