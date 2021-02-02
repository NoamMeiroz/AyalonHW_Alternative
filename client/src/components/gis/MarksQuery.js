import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider';
import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';
import './MarksQuery.css';

const MAX_VALUE = 16;
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
const MarksSlider = withStyles({
    markLabel: {
        fontSize: '0.5rem'
    }
})(Slider);

/**
 * return marks label (tiks)
 */
function getMarks() {
    let marks = [
        {
            value: -1,
            label: <div>פתרון<br />פסול</div>,
        },
    ];
    for (let i = 0; i <= MAX_VALUE; i = i + 2) {
        let mark = { value: i, label: `${i}` };
        marks.push(mark)
    }
    return marks;
}

/**
 * list of all marks and their labels
 */
const MARK_LIST = [{ Header: "קיצור שעות העבודה", accessor: 'FINAL_SHORT_HOURS_GRADE' },
{ Header: "הזזת זמן הגעה לעבודה", accessor: 'FINAL_SHIFTING_HOURS_GRADE' },
{ Header: "דו גלגלי-אופניים", accessor: 'FINAL_BICYCLE_GRADE' },
{ Header: "דו גלגלי-קורקינט", accessor: 'FINAL_SCOOTER_GRADE' },
{ Header: "Shuttle On Demand", accessor: 'FINAL_PERSONALIZED_SHUTTLE_GRADE' },
{ Header: "שאטלים מטעם העבודה", accessor: 'FINAL_WORK_SHUTTLE_GRADE' },
{ Header: "Carshare/Vanshare", accessor: 'FINAL_CARSHARE_GRADE' },
{ Header: "Carpool/Vanpool", accessor: 'FINAL_CARPOOL_GRADE' },
{ Header: "מוניות שיתופיות", accessor: 'FINAL_CABSHARE_GRADE' },
{ Header: "תחבורה ציבורית", accessor: 'FINAL_PUBLIC_TRANSPORT_GRADE' },
{ Header: "הגעה רגלית", accessor: 'FINAL_WALKING_GRADE' },
{ Header: "עבודה מהבית", accessor: 'FINAL_WORKING_FROM_HOME_GRADE' },
{ Header: "עבודה במרכזים שיתופיים", accessor: 'FINAL_SHARED_WORKSPACE_GRADE' },
{ Header: "שינוי ימי הגעה לעבודה", accessor: 'FINAL_SHIFTING_WORKING_DAYS_GRADE' }
];

function valuetext(value) {
    let text = `${value} h`;
    if (value === 0) {
        text = `פתרון פסול`;
    }
    return text;
}

function MarkSlider({markValues, item}) {
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
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        marks={getMarks()}
        step={1}
        min={-1}
        max={16}
    />
}

/**
* Return jsx with all slider marks
*/
const MarkComponents = ({selectedMarks}) => {
    const marks = useSelector(state => {
        return state.reportParams.qSelectedMarks})

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
        selectedMarks[mark.accessor] = [MIN_VALUE, MAX_VALUE];
    }
    if (state.reportParams.qSelectedMarks) {
        selectedMarks = state.reportParams.qSelectedMarks;
    }
    return { selectedMarks: selectedMarks };
};

export default requireAuth(
    connect(mapStateToProps, actions)(MarksQuery));