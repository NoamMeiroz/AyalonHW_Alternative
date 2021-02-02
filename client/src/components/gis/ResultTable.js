import React from 'react';
import { connect, useSelector } from 'react-redux';
import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';


import './ResultTable.css';
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles';
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { useTable, usePagination, useSortBy } from 'react-table'
import ReportSelection from './ReportSelection';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingRight: '10px',
        paddingTop: '5px'
    }
}));

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    )

    // Render the UI for your table
    return (
        <>
            <MaUTable {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell className={column.className} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </MaUTable>
            {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    עמוד{' '}
                    <strong>
                        {pageIndex + 1} מתוך {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | עבור לעמוד:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            הצג {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    )
}

function ResultTable() {

    const columns = useSelector(state => state.reportTypeSelection.columns);
    const data = useSelector(state => state.reportTypeSelection.data);

    const classes = useStyles();

    return (<div className={classes.root}>
        <ReportSelection />
        <div className='tableFixHead'
            style={{ width: '100%', height: '70vh', overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
            <CssBaseline />
            <Table columns={columns} data={data}
            />
        </div>
    </div>

    )
}

export default requireAuth(
    connect(null, actions)(ResultTable));
