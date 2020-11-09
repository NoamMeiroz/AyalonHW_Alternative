import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import * as actions from '../../actions';
import './InfoPanel.css';

class InfoPanel extends Component {

    render() {
        return <div style={{paddingBottom: 14}}>
            <Grid container spacing={2}>
                <Grid item>
                    <Card className="info-card">
                        <CardContent>
                            <Typography className="card-label" gutterBottom variant="caption">
                                חברות
                            </Typography>
                            <Typography variant="h6" component="h2">
                                {this.props.companyCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                <Card className="info-card">
                        <CardContent>
                            <Typography className="card-label" gutterBottom variant="caption">
                                עובדים
                            </Typography>
                            <Typography variant="h6" component="h2">
                            {this.props.employeesCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    }

}

function mapStateToProps(state) {
    let companyCount = 0;
    let employeesCount = 0;
    if (state.loadData.companyList) {
        companyCount = state.loadData.companyList.length;
        employeesCount = state.loadData.companyList.reduce((sum,company)=>{
            return (sum + company.EMP_COUNT)
        }, 0);
    }
    return {
        companyCount: companyCount,
        employeesCount: employeesCount
    }
    
}

export default
    connect(mapStateToProps, actions)(InfoPanel);
