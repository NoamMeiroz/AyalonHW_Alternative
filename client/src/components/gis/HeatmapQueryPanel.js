import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions'; 
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';

import requireAuth from '../requireAuth'; //used to check if login successfull
import './HeatmapQueryPanel.css';

const CITY = "NAME";

class HeatmapQueryPanel extends PureComponent {

    state = {
        company: null,
        livingCity: null,
        workingCity: null
    }

    handleClick = () => {
        let cityList = null;
        let workingCity = null;
        let companies = null;
        if (this.state.livingCity)
            cityList = this.state.livingCity;
        if (this.state.workingCity)
            workingCity = this.state.workingCity;
        if (this.state.company)
            companies = this.state.company;
            this.props.getEmployees(companies,
                cityList,
                workingCity);
    }

    render() {
        return <div>
            <Grid
                container
                spacing={6}
                alignItems="flex-start"
                style={{margin: 0}}
            >
                <Grid container item spacing={2}>
                    <Grid item xs={10}>
                        <Autocomplete
                            size="small"
                            multiple
                            id="company"
                            options={this.props.companies}
                            getOptionLabel={(option) => option.NAME}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="שם חברה"
                                />
                            )}
                            onChange={(event, value) => {
                                let companyList = value.map(company => {
                                    return company.id;
                                })
                                this.setState({ company: companyList })
                            }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Autocomplete
                            size="small"
                            multiple
                            id="living_city"
                            options={this.props.settlementList}
                            getOptionLabel={(option) => option[CITY]}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ישוב מגורים"
                                />
                            )}
                            onChange={(event, value) => {
                                let cities = value.map(city => {
                                    return city[CITY];
                                })
                                this.setState({ livingCity: cities })
                            }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Autocomplete
                            size="small"
                            multiple
                            id="work_city"
                            options={this.props.settlementList}
                            getOptionLabel={(option) => option[CITY]}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ישוב עבודה"
                                />
                            )}
                            onChange={(event, value) => {
                                let cities = value.map(city => {
                                    return city[CITY];
                                })
                                this.setState({ workingCity: cities })
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button className="Button" variant="contained"
                        onClick={this.handleClick}>הצגה</Button>
                </Grid>
            </Grid>
        </div>
    }
}

function mapStateToProps(state) {
    let companies = [];
    let settlementList = [];
    if (state.loadData.companyList) {
        companies = state.loadData.companyList;
    }
    if (state.reports.settlementList) {
        settlementList = state.reports.settlementList;
    }
    return { companies: companies, settlementList: settlementList };
};

export default requireAuth(
    connect(mapStateToProps, actions)(HeatmapQueryPanel));
