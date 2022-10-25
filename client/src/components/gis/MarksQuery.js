import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider';
import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';
import './MarksQuery.css';
import { styled } from '@mui/material/styles';

const MAX_VALUE = 2;
const MARKS_VALUES = {
    "LOW_VALUE": { "label": "נמוך", "value": 0 },
    "MEDIUM_VALUE": { "label": "בינוני", "value": 1 },
    "HIGH_VALUE": { "label": "גבוה", "value": 2 }
};

const MIN_VALUE = -1;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    noElevation: {
        elevation: 0,
        boxShadow: 'none',
        padding: 0
    },
    details: {
        paddingLeft: '5px',
        paddingRight: '4px',
        paddingTop: '0px'
    }

}));

/**
 * make Slider with small font labels
 */
const MarksSlider = styled(Slider)(({ theme }) => ({
    "& .MuiSlider-markLabel": {
        fontSize: "0.6rem",
    },
}));

/**
 * return marks label (tiks)
 */
function getMarks() {
    let marks = [
        {
            value: MIN_VALUE,
            label: <div>פתרון<br />פסול</div>,
        },
        {
            value: MARKS_VALUES.LOW_VALUE.value,
            label: MARKS_VALUES.LOW_VALUE.label
        },
        {
            value: MARKS_VALUES.MEDIUM_VALUE.value,
            label: MARKS_VALUES.MEDIUM_VALUE.label
        },
        {
            value: MARKS_VALUES.HIGH_VALUE.value,
            label: MARKS_VALUES.HIGH_VALUE.label
        }
    ];

    return marks;
}

/**
 * list of all marks and their labels
 */
const MARK_LIST = [
    { Header: "מיקרומוביליטי", accessor: 'FINAL_BICYCLE_GRADE' },
    { Header: "שאטלים מטעם העבודה", accessor: 'FINAL_WORK_SHUTTLE_GRADE' },
    { Header: "שאטל פנים מתחמי", accessor: 'FINAL_COMPOUND_SHUTTLE_GRADE' },
    { Header: "Carpool/Vanpool", accessor: 'FINAL_CARPOOL_GRADE' },
    { Header: "תחבורה ציבורית", accessor: 'FINAL_PUBLIC_TRANSPORT_GRADE' },
    { Header: "הגעה רגלית", accessor: 'FINAL_WALKING_GRADE' },
    { Header: "עבודה מרחוק", accessor: 'FINAL_WORKING_FROM_HOME_GRADE' },
 ];

function valuetext(value) {
    let text = `${value} h`;
    if (value === 0) {
        text = `פתרון פסול`;
    }
    return text;
}

function MarkSlider({ markValues, item }) {
    const dispatch = useDispatch();
    const [name, setColumn] = React.useState(item.accessor);

    const value = useSelector(state => state.reportParams.qSelectedMarks[name]);

    const handleChange = (mark, newValue) => {
        dispatch(actions.setMarkQuery(mark, newValue));
    };
    return <MarksSlider
        id={item.accessor}
        value={value}
        onChange={(event, newValue) => handleChange(item.accessor, newValue)}
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        marks={getMarks()}
        step={1}
        min={MIN_VALUE}
        max={MAX_VALUE}
        valueLabelDisplay="off"
    />
}

/**
* Return jsx with all slider marks
*/
const MarkComponents = ({ selectedMarks }) => {
    const marks = useSelector(state => {
        return state.reportParams.qSelectedMarks
    })

    let jsx = [];
    for (let item of MARK_LIST) {
        jsx.push(<Grid key={item.accessor} item xs={12}>
            <Typography variant="caption" id={`${item.accessor}_l`} gutterBottom>
                {item.Header}
            </Typography>
            <MarkSlider markValues={marks[item.accessor]} item={item} />
        </Grid>)
    }
    return <Grid container item spacing={2}>{jsx}</Grid>;
}

function MarksQuery({ selectedMarks }) {
    //const [marks, setMarks] = React.useState(selectedMarks);
    const marks = useSelector(state => state.reportParams.qSelectedMarks)

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Accordion className={classes.noElevation}>
                <AccordionSummary className={classes.noElevation}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>ציונים לפתרונות ניידות</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                    <MarkComponents selectedMarks={marks} />
                </AccordionDetails>
            </Accordion>
        </div >
    );
}

function mapStateToProps(state) {
    let selectedMarks = {};
    for (const mark of MARK_LIST) {
        selectedMarks[mark.accessor] = [MIN_VALUE,MAX_VALUE];
    }
    if (state.reportParams.qSelectedMarks) {
        selectedMarks = state.reportParams.qSelectedMarks;
    }
    return { selectedMarks: selectedMarks };
};

export default requireAuth(
    connect(mapStateToProps, actions)(MarksQuery));