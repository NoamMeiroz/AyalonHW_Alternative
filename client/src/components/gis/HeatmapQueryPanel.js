import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import requireAuth from '../requireAuth'; //used to check if login successfull
import TimeSlotQuery from './TimeSlotQuery';
import MarksQuery from './MarksQuery';
import './HeatmapQueryPanel.css';

const CITY_NAME_COLUMN = "NAME";

class HeatmapQueryPanel extends PureComponent {

    state = {
        company: null,
        livingCity: null,
        workingCity: null,
    }

    handleClick = () => {
        let cityList = this.props.selectedLivingCityList.map(city => {
            return city[CITY_NAME_COLUMN];
        });
        let workingCity = this.props.selectedWorkingCityList.map(city => {
            return city[CITY_NAME_COLUMN];
        });
        let companies = this.props.selectedCompnayList.map(company => {
            return company.id;
        })

        this.props.getEmployees(companies,
            cityList,
            workingCity,
            this.props.qTimeSlotToWork,
            this.props.qTimeSlotToHome,
            this.props.qSelectedMarks,
            this.props.qDestinationPolygon,
            this.props.qStartingPolygon);
    }

    render() {
        return <div className="queryPanel">
            <Grid
                container
                spacing={1}
                alignItems="flex-start"
                style={{ margin: 2 }}
            >
                <Grid container item spacing={2}>
                    <Grid item xs={10}>
                        <Autocomplete
                            size="small"
                            multiple
                            id="company"
                            value={this.props.selectedCompnayList}
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
                                this.props.setQueryCompany(companyList);
                            }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Autocomplete
                            size="small"
                            multiple
                            id="living_city"
                            value={this.props.selectedLivingCityList}
                            options={this.props.settlementList}
                            getOptionLabel={(option) => option[CITY_NAME_COLUMN]}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ישוב מגורים"
                                />
                            )}
                            onChange={(event, value) => {
                                let cities = value.map(city => {
                                    return city[CITY_NAME_COLUMN];
                                })
                                this.setState({ livingCity: cities });
                                this.props.setQueryLivingCity(cities);
                            }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Autocomplete
                            size="small"
                            multiple
                            id="work_city"
                            value={this.props.selectedWorkingCityList}
                            options={this.props.settlementList}
                            getOptionLabel={(option) => option[CITY_NAME_COLUMN]}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ישוב עבודה"
                                />
                            )}
                            onChange={(event, value) => {
                                let cities = value.map(city => {
                                    return city[CITY_NAME_COLUMN];
                                })
                                this.setState({ workingCity: cities });
                                this.props.setQueryWorkingCity(cities);
                            }}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <TimeSlotQuery />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider style={{ width: '10vh', margin: 'auto' }} />
                    </Grid>
                    <Grid item xs={10}>
                        <MarksQuery />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider style={{ width: '10vh', margin: 'auto' }} />
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
    let qTimeSlotToHome = [];
    let qTimeSlotToWork = [];
    let qSelectedMarks = [];
    let selectedCompnayList = [];
    let selectedLivingCityList = [];
    let selectedWorkingCityList = [];
    let qStartingPolygon= {};
    let qDestinationPolygon = {};
    if (state.loadData.companyList) {
        companies = state.loadData.companyList;
    }
    if (state.consts.settlementList) {
        settlementList = state.consts.settlementList;
    }
    // selected companyList
    if (state.reportParams.qCompanyParams) {
        for (const selectedCompany of state.reportParams.qCompanyParams) {
            for (const company of companies)
                if (company.id === selectedCompany) {
                    selectedCompnayList.push(company);
                    break;
                }
        }
    }
    // selected livingCity
    if (state.reportParams.qLivingCityParams) {
        for (const selectedCity of state.reportParams.qLivingCityParams) {
            for (const city of state.consts.settlementList)
                if (city[CITY_NAME_COLUMN] === selectedCity) {
                    selectedLivingCityList.push(city);
                    break;
                }
        }
    }
    // selected workingCity
    if (state.reportParams.qWorkingCityParams) {
        for (const selectedCity of state.reportParams.qWorkingCityParams) {
            for (const city of state.consts.settlementList){
                if (city[CITY_NAME_COLUMN] === selectedCity) {
                    selectedWorkingCityList.push(city);
                    break;
                }
            }
        }
    }
    // selected time slots
    if (state.reportParams.qTimeSlotHomeParams) {
        qTimeSlotToHome = state.reportParams.qTimeSlotHomeParams;
    }
    if (state.reportParams.qTimeSlotWorkParams) {
        qTimeSlotToWork = state.reportParams.qTimeSlotWorkParams;
    }
    if (state.reportParams.qSelectedMarks) {
        qSelectedMarks = state.reportParams.qSelectedMarks;
    }
    if (state.reportParams.qDestinationPolygonParams) {
        qDestinationPolygon = state.reportParams.qDestinationPolygonParams.polygon;
    }
    if (state.reportParams.qStartingPolygonParams) {
        qStartingPolygon = state.reportParams.qStartingPolygonParams.polygon;
    }
    return {
        companies: companies, settlementList: settlementList,
        qTimeSlotToWork: qTimeSlotToWork, qTimeSlotToHome: qTimeSlotToHome,
        qSelectedMarks: qSelectedMarks,
        selectedCompnayList: selectedCompnayList,
        selectedLivingCityList: selectedLivingCityList,
        selectedWorkingCityList: selectedWorkingCityList,
        qStartingPolygon: qStartingPolygon,
        qDestinationPolygon: qDestinationPolygon
    };
};

export default requireAuth(
    connect(mapStateToProps, actions)(HeatmapQueryPanel));
