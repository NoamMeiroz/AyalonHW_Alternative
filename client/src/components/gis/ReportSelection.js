import React from 'react';
import { connect, useDispatch, useSelector} from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import requireAuth from '../requireAuth'; //used to check if login successfull
import * as reportTypes from '../reports/types';
import * as actions from '../../actions';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'right',
    },
}));

const ReportSelection = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [report, setReoprt] = React.useState(reportTypes.GENERAL_REPORT);
    const isCouplungDisabled = useSelector(state => { 
        if (state.reports.clusterReport.length>0)
            return false;
        else    
            return true;
    });


    const handleReport = (event, newReport) => {
        if (newReport !== null) {
            setReoprt(newReport);
            dispatch(actions.setReportType(newReport));
        }
    };

    return (
        <div className={classes.root}>
            <ToggleButtonGroup size="small"
                value={report}
                exclusive
                onChange={handleReport}
                aria-label="report selection"
            >
                <ToggleButton value={reportTypes.GENERAL_REPORT} aria-label="general report">
                    כללי
                </ToggleButton>
                <ToggleButton value={reportTypes.TIME_POTENTIAL} aria-label="potential to short time travel">
                    פוטנציאל צמצום זמני נסיעה
                </ToggleButton>
                <ToggleButton value={reportTypes.TOP_FIVE_SOLUTIONS} aria-label="top 5 solution">
                    דרוג פתרונות
                </ToggleButton>
                <ToggleButton value={reportTypes.COUPLING_REPORT} aria-label="coupling report" disabled={isCouplungDisabled}>
                    דוח צימודים
                </ToggleButton>
            </ToggleButtonGroup>    </div>
    );
}

export default requireAuth(
    connect(null, actions)(ReportSelection));