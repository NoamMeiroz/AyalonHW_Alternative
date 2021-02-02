import React from 'react';
import { connect, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';

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
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingTop: '0px'
    }

}));

function TimeSlotQuery({ timeSlotToWork, timeSlotToHome, selectedTimeSlotToWork, selectedTimeSlotToHome }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            <Accordion className={classes.noElevation}>
                <AccordionSummary className={classes.noElevation}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>זמני נסיעה</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                    <Grid container item spacing={2}>
                        <Grid item xs={12}>

                            <Autocomplete
                                size="small"
                                multiple
                                id="to_work"
                                value={selectedTimeSlotToWork}
                                options={timeSlotToWork}
                                getOptionLabel={(option) => option.TIME_SLOT}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="שעת יציאה לעבודה"
                                    />
                                )}
                                onChange={(event, value) => {
                                    let timeSlots = value.map(timeSlot => {
                                        return timeSlot.id;
                                    })
                                   dispatch(actions.setQueryTimeSlotToWork(timeSlots));
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                size="small"
                                multiple
                                id="to_home"
                                options={timeSlotToHome}
                                value={selectedTimeSlotToHome}
                                getOptionLabel={(option) => option.TIME_SLOT}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="שעת חזרה הביתה"
                                    />
                                )}
                                onChange={(event, value) => {
                                    let timeSlots = value.map(timeSlot => {
                                        return timeSlot.id;
                                    })
                                   dispatch(actions.setQueryTimeSlotToHome(timeSlots));
                                }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div >
    );
}

function mapStateToProps(state) {
    let timeSlotToHome = [];
    let timeSlotToWork = [];
    let selectedTimeSlotToHome = [];
    let selectedTimeSlotToWork = [];
    if (state.consts.timeSlotToHome) {
        timeSlotToHome = state.consts.timeSlotToHome;
    }
    if (state.consts.timeSlotToWork) {
        timeSlotToWork = state.consts.timeSlotToWork;
    }
    if (state.reportParams.qTimeSlotHomeParams) {
        for (const selectedTimeSlot of state.reportParams.qTimeSlotHomeParams) {
            for(const timeSlot of timeSlotToHome)
                if (timeSlot.id===selectedTimeSlot){
                    selectedTimeSlotToHome.push(timeSlot);
                    break;
            }
        }
    }
    if (state.reportParams.qTimeSlotWorkParams) {
        for (const selectedTimeSlot of state.reportParams.qTimeSlotWorkParams) {
            for(const timeSlot of timeSlotToWork)
                if (timeSlot.id===selectedTimeSlot){
                    selectedTimeSlotToWork.push(timeSlot);
                    break;
            }
        }
    }
    return { timeSlotToWork: timeSlotToWork, timeSlotToHome: timeSlotToHome,
        selectedTimeSlotToWork: selectedTimeSlotToWork, selectedTimeSlotToHome: selectedTimeSlotToHome };
};

export default requireAuth(
    connect(mapStateToProps, actions)(TimeSlotQuery));