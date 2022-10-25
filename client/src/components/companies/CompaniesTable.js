import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { visuallyHidden } from "@mui/utils";
import requireAuth from "../requireAuth"; //used to check if login successfull
import { connect } from "react-redux";
import * as actions from "../../actions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";
import RemoveIcon from "@mui/icons-material/Remove";
import Sites from "./Sites";
import DownloadButton from "./DownloadButton";
import DeleteButton from "./DeleteButton";
import RecalculateButton from "./RecalculateButton";
import { styled } from "@mui/material/styles";
import CompanyUploadButton from "./CompanyUploadButton";
import TemplateButton from "./TemplateButton";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: "10px",
    paddingTop: "5px",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "NAME",
    numeric: false,
    disablePadding: true,
    label: "שם חברה",
  },
  {
    id: "NUMBER_OF_SITES",
    numeric: true,
    disablePadding: true,
    label: 'סה"כ סניפים',
  },
  {
    id: "NUMBER_OF_EMPLOYEES",
    numeric: true,
    disablePadding: true,
    label: 'סה"כ עובדים',
  },
  {
    id: "SECTOR",
    numeric: false,
    disablePadding: false,
    label: "מגזר",
  },
  {
    id: "PRIVATE_CAR_SOLUTION",
    numeric: false,
    disablePadding: false,
    label: "רכב צמוד",
  },
  {
    id: "MASS_TRANSPORTATION_SOLUTION",
    numeric: false,
    disablePadding: false,
    label: "שירותי הסעות",
  },
  {
    id: "CAR_POOL_SOLUTION",
    numeric: false,
    disablePadding: false,
    label: "Carpool",
  },
  {
    id: "WORK_FROM_HOME_SOLUTION",
    numeric: false,
    disablePadding: false,
    label: "עבודה מהבית",
  },
  {
    id: "SITE_COUNT",
    numeric: false,
    disablePadding: false,
    label: "# אתרים שנקלטו",
  },
  {
    id: "EMP_COUNT_DESC",
    numeric: false,
    disablePadding: true,
    label: "# עובדים שנקלטו",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell></StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={"left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
        <StyledTableCell></StyledTableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const [filterValue, setFilterValue] = React.useState("");

  const handleChange = (event) => {
    setFilterValue(event.target.value);
    props.filterCompanies(event.target.value);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        direction: "ltr",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%", direction: "ltr" }}
        variant="h5"
        id="tableTitle"
        component="div"
      >
        רשימת חברות
      </Typography>
      <Grid container direction="row" justify="flex-end">
        <Grid item>
          <CompanyUploadButton />
        </Grid>
        <Grid item>
          <TemplateButton />
        </Grid>
        <Grid item>
          <TextField
            id="outlined-search"
            label="חיפוש"
            type="search"
            value={filterValue}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

function Row({ data }) {
  const [rowData, setRowData] = React.useState(data);
  const [openRow, setOpenRow] = React.useState(false);

  React.useEffect(() => {
    setRowData(data);
  }, [data]);

  return (
    <React.Fragment>
      <TableRow
        hover
        tabIndex={-1}
        key={rowData.NAME}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenRow(!openRow)}
          >
            {openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell
          component="th"
          id={rowData.id}
          scope="row"
          padding="none"
        >
          {rowData.NAME}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.NUMBER_OF_SITES}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.NUMBER_OF_EMPLOYEES}
        </StyledTableCell>
        <StyledTableCell align="left">{rowData.SECTOR}</StyledTableCell>
        <StyledTableCell align="left">
          {rowData.PRIVATE_CAR_SOLUTION ? <CheckIcon /> : <RemoveIcon />}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.MASS_TRANSPORTATION_SOLUTION ? (
            <CheckIcon />
          ) : (
            <RemoveIcon />
          )}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.CAR_POOL_SOLUTION ? <CheckIcon /> : <RemoveIcon />}
        </StyledTableCell>
        <StyledTableCell align="left">
          {rowData.WORK_FROM_HOME_SOLUTION ? <CheckIcon /> : <RemoveIcon />}
        </StyledTableCell>
        <StyledTableCell align="left">{rowData.SITE_COUNT}</StyledTableCell>
        <StyledTableCell align="left">{rowData.EMP_COUNT_DESC}</StyledTableCell>
        <StyledTableCell sx={{ paddingRight: "0px", paddingLeft: "0px" }}>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={4}>
              <DownloadButton
                key={`downloadButton_${rowData.id}`}
                id={`downloadButton_${rowData.id}`}
                fontSize="small"
                csvData={rowData}
                fileName={rowData.NAME}
                employeesReady={rowData.EMPLOYEES_READY}
                uploadPrecent={rowData.UPLOAD_PROGRESS}
              />
            </Grid>
            <Grid item xs={4}>
              <RecalculateButton
                id={`recalcButton_${rowData.id}`}
                fontSize="small"
                csvData={rowData}
                employeesReady={rowData.EMPLOYEES_READY}
              />
            </Grid>
            <Grid item xs={4}>
              <DeleteButton
                id={`deleteButton_${rowData.id}`}
                fontSize="small"
                csvData={rowData}
                employeesReady={rowData.EMPLOYEES_READY}
              />
            </Grid>
          </Grid>
        </StyledTableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openRow} timeout="auto" unmountOnExit>
            <Sites sites={data.Sites} style={{ padding: 0 }} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function EnhancedTable({ data }) {
  const [rows, setRows] = React.useState(data);
  const [unFilteredRows, setUnfilteredRows] = React.useState(data);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("NAME");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterCompanies = (filterValue) => {
    if (filterValue === "") setRows(unFilteredRows);
    setRows(unFilteredRows.filter((row) => row["NAME"].includes(filterValue)));
  };

  React.useEffect(() => {
    setRows(data);
    setUnfilteredRows(data);
  }, [data]);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar filterCompanies={filterCompanies} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((company) => (
                  <Row key={`row_${company.id}`} data={company} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "0px",
  },
}));

function ResultTable({ data, sectors }) {
  function prepareDate(data, sectors) {
    return data.map((company) => {
      company.SECTOR = sectors[company.SECTOR];
      return company;
    });
  }
  const classes = useStyles();
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    setTableData(prepareDate(data, sectors));
  }, [data, sectors]);

  return (
    <div className={classes.root}>
      <div
        className="tableFixHead"
        style={{
          width: "100%",
          height: "70vh",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <EnhancedTable data={tableData} />
      </div>
    </div>
  );
}

export default requireAuth(connect(null, actions)(ResultTable));
