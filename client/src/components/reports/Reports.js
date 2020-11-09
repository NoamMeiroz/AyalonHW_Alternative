import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import requireAuth from '../requireAuth'; //used to check if login successfull
import ReportCard from './ReportCard';


class Reports extends Component {

    render() {
        return <div>
            <Grid container spacing={2}>
                <Grid item >
                    <ReportCard header="פוטנציאל שיתוף לפי ערים"
                        details="מספר עובדים החולקים את אותו היעד לפי ערים"
                        report="share_potential" />
                </Grid>
                <Grid item>
                    <ReportCard header="" details="" />
                </Grid>
            </Grid>
        </div>;
    }
}

export default requireAuth(Reports);