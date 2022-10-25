import React, { useEffect } from "react";

import { connect } from "react-redux";
import * as actions from "../../actions";
import Datagrid from "./Datagrid";
import { isValidNumber, NumberCell } from './NumberCell';
import _ from 'lodash';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const columns = [
  {
    field: "PROPERTY",
    headerName: "מאפיין",
    width: 400,
    cellClassName: "disabled_cell",
  },
  {
    field: "CATEGORY",
    headerName: "קטגוריה",
    width: 400,
    cellClassName: "disabled_cell",
  },
  {
    field: "VALUE",
    headerName: "אחוז באוכלוסיה",
    width: 200,
    type: "number",
    editable: true,
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
];

function SolutionPropertiesValues({ rows, dispatch }) {

  useEffect(() => {
    dispatch(actions.getSolutionPropertiesValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processRowUpdate = React.useCallback(
    async (newRow) => {
      dispatch(actions.setSolutionPropertyValue(newRow));
      return newRow;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleProcessRowUpdateError = React.useCallback((error) => {
    dispatch(actions.showMessage, error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const solutions = _.uniqBy(rows, "SOLUTION");
  const jsx = [];
  for (const solution of solutions) {
    const data = rows.filter(row => {
      return (row["SOLUTION"] === solution.SOLUTION)
    })

    const item = <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon style={{ color: "#ffffff" }}/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ backgroundColor: "#242736" }}
      >
        <Typography sx={{color: "#ffffff"}}>{solution.SOLUTION}</Typography>
      </AccordionSummary> 
      <AccordionDetails>
        <Datagrid rows={data} columns={columns}
          height={400}
          processRowUpdate={processRowUpdate}
          handleProcessRowUpdateError={handleProcessRowUpdateError} />
      </AccordionDetails>
    </Accordion>;


    jsx.push(item)
  }
  return <Box sx={{height: 700, overflowY: "auto" }}>{jsx}</Box>;
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
