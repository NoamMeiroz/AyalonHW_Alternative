import React from "react";
import { connect, useSelector } from "react-redux";
import requireAuth from "../requireAuth"; //used to check if login successfull
import * as actions from "../../actions";

import "./ResultTable.css";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TablePagination, {
  tablePaginationClasses,
} from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";

import ReportSelection from "./ReportSelection";
import Graphs from "../reports/Graphs";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: "10px",
    paddingTop: "5px",
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  [`&.${tablePaginationClasses.root}`]: {
    direction: "ltr",
  },
}));

function SimpleTable({ columnGrouping, columns, rows }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const createColumnGrouping = (columnGrouping) => {
    if (!columnGrouping) return null;

    const tableCells = [];
    let i = 0;
    columnGrouping.forEach((columnGroup) => {
      i++;
      tableCells.push(
        <TableCell
          align="center"
          colSpan={columnGroup.span}
          key={`columnGroup_${i}`}
        >
          {columnGroup.label}
        </TableCell>
      );
    });
    return <TableRow>{tableCells}</TableRow>;
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {createColumnGrouping(columnGrouping)}
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: column.top, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.Cell ? column.Cell({row, value}) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <StyledTablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

function ResultTable() {
  const columns = useSelector((state) => state.reportTypeSelection.columns);  
  const columnGrouping = useSelector((state) => state.reportTypeSelection.columnGrouping);
  const data = useSelector((state) => state.reportTypeSelection.data);
  const reportType = useSelector((state) => state.reportTypeSelection.reportType);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ReportSelection />
      <div
        className="tableFixHead"
        style={{
          width: "100%",
          height: "70vh",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <CssBaseline />
        <Graphs reportType={reportType} data={data} />
        <SimpleTable columns={columns} rows={data} columnGrouping={columnGrouping} />
      </div>
    </div>
  );
}

export default requireAuth(connect(null, actions)(ResultTable));
