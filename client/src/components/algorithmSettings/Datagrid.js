
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { heIL as originHeL } from "@mui/material/locale";
import Box from "@mui/material/Box";
import {
  DataGrid,
  heIL,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  gridPageSelector,
  gridPageSizeSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import TablePagination from "@mui/material/TablePagination";
import { Table, TableBody, TableRow } from "@mui/material";


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);

  const handleChangeRowsPerPage = (event) => {
    apiRef.current.setPageSize(+event.target.value);
    apiRef.current.setPage(0);
  };

  return (
    <ThemeProvider theme={originalTheme}>
      <Table>
        <TableBody>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              count={apiRef.current.getRowsCount()}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={(event, value) => apiRef.current.setPage(value)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableBody>
      </Table>
    </ThemeProvider>
  );
}

const theme = createTheme(heIL);
const originalTheme = createTheme(
  {
    components: {
      MuiTablePagination: {
        styleOverrides: {
          actions: { direction: "rtl" },
        },
      },
    },
  },
  originHeL
);

function Datagrid({ rows, columns, processRowUpdate, handleProcessRowUpdateError, height }) {
  return (
    <Box
      className="border"
      sx={{
        width: "100%",
        height: height ?? 750,
        overflowY: "auto",
        "& .disabled_cell": {
          backgroundColor: "rgba(210, 210, 210, 0.55)",
        },
        "& .Mui-error": {
          backgroundColor: `rgb(126,10,15, ${
            theme.palette.mode === "dark" ? 0 : 0.1
          })`,
          color: theme.palette.mode === "dark" ? "#ff4343" : "#750f0f",
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
            Pagination: CustomPagination,
          }}
          experimentalFeatures={{ newEditingApi: true }}
          pagination
          editMode="row"
          processRowUpdate={processRowUpdate}
          handleProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </ThemeProvider>
    </Box>
  );
}

export default Datagrid;
