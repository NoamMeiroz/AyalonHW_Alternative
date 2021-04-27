import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Typography from '@material-ui/core/Typography';
import requireAuth from '../requireAuth'; //used to check if login successfull
import TimeSlotQuery from './TimeSlotQuery';
import MarksQuery from './MarksQuery';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import './HeatmapQueryPanel.css';
import VirtualListBox from '../common/VirtualListBox';

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
        const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
        const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
                            disableCloseOnSelect
                            value={this.props.selectedCompnayList}
                            options={this.props.companies}
                            getOptionLabel={(option) => option.NAME}
                            renderOption={(option, { selected }) => (
                                <React.Fragment>
                                  <Checkbox
                                    icon={icon}
                                    size="small"
                                    checkedIcon={checkedIcon}
                                    style={{ margin: '0px', paddingBottom: '0px', paddingTop: '0px'}}
                                    checked={selected}
                                  />
                                  <Typography variant="caption" style={{margin:'0px',  paddingBottom: '0px', paddingTop: '0px'}}>
                                      {option.NAME}
                                  </Typography>
                                </React.Fragment>
                              )}
                            renderInput={(params) => 
                                <TextField
                                    {...params}
                                    label="שם חברה"
                                />}
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
                            disableCloseOnSelect
                            ListboxComponent={VirtualListBox}
                            renderOption={(option, { selected }) => (
                                <React.Fragment>
                                  <Checkbox
                                    icon={icon}
                                    size="small"
                                    checkedIcon={checkedIcon}
                                    style={{ margin: '0px', paddingBottom: '0px', paddingTop: '0px'}}
                                    checked={selected}
                                  />
                                  <Typography variant="caption" style={{margin:'0px',  paddingBottom: '0px', paddingTop: '0px'}}>
                                      {option[CITY_NAME_COLUMN]}
                                  </Typography>
                                </React.Fragment>
                              )}
                            renderInput={(params) => 
                                <TextField
                                    {...params}
                                    label="ישוב מגורים"
                                />
                            }
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
                            disableCloseOnSelect
                            ListboxComponent={VirtualListBox}
                            renderOption={(option, { selected }) => (
                                <React.Fragment>
                                  <Checkbox
                                    icon={icon}
                                    size="small"
                                    checkedIcon={checkedIcon}
                                    style={{ margin: '0px', paddingBottom: '0px', paddingTop: '0px'}}
                                    checked={selected}
                                  />
                                  <Typography variant="caption" style={{margin:'0px',  paddingBottom: '0px', paddingTop: '0px'}}>
                                      {option[CITY_NAME_COLUMN]}
                                  </Typography>
                                </React.Fragment>
                              )}
                            renderInput={(params) => <TextField
                                    {...params}
                                    label="ישוב עבודה"
                                />
                            }
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
                    <Button className="queryButton" variant="contained"
                        onClick={this.handleClick}>הצגה
                        <Fade
                            in={this.props.isGeneralReportRunnig}
                            style={{
                                transitionDelay: this.props.isGeneralReportRunnig ? '800ms' : '0ms',
                            }}
                            unmountOnExit
                        >
                            <CircularProgress size={15} />
                        </Fade>
                    </Button>

                </Grid>
                <Grid item xs={12}>
                    {this.props.children}
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
    let qStartingPolygon = {};
    let qDestinationPolygon = {};
    let isGeneralReportRunnig = false;
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
            for (const city of state.consts.settlementList) {
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
    isGeneralReportRunnig = state.reports.isGeneralReportRunnig;
    return {
        companies: companies, settlementList: settlementList,
        qTimeSlotToWork: qTimeSlotToWork, qTimeSlotToHome: qTimeSlotToHome,
        qSelectedMarks: qSelectedMarks,
        selectedCompnayList: selectedCompnayList,
        selectedLivingCityList: selectedLivingCityList,
        selectedWorkingCityList: selectedWorkingCityList,
        qStartingPolygon: qStartingPolygon,
        qDestinationPolygon: qDestinationPolygon,
        isGeneralReportRunnig: isGeneralReportRunnig
    };
};

export default requireAuth(
    connect(mapStateToProps, actions)(HeatmapQueryPanel));
