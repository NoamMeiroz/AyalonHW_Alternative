import React, { PureComponent } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Typography from "@mui/material/Typography";
import requireAuth from "../requireAuth"; //used to check if login successfull
import TimeSlotQuery from "./TimeSlotQuery";
import MarksQuery from "./MarksQuery";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import "./HeatmapQueryPanel.css";
import VirtualListBox from "../common/VirtualListBox";

const CITY_NAME_COLUMN = "NAME";

class HeatmapQueryPanel extends PureComponent {
  state = {
    company: null,
    livingCity: null,
    workingCity: null,
    compounds: null,
  };

  handleClick = () => {
    let cityList = this.props.selectedLivingCityList.map((city) => {
      return city[CITY_NAME_COLUMN];
    });
    let workingCity = this.props.selectedWorkingCityList.map((city) => {
      return city[CITY_NAME_COLUMN];
    });
    let companies = this.props.selectedCompnayList.map((company) => {
      return company.id;
    });
    let compounds = this.props.selectedCompoundList.map((compound) => {
      return compound.NAME;
    });

    this.props.getEmployees(
      companies,
      cityList,
      workingCity,
      compounds,
      this.props.qTimeSlotToWork,
      this.props.qTimeSlotToHome,
      this.props.qSelectedMarks,
      this.props.qDestinationPolygon,
      this.props.qStartingPolygon
    );
  };

  render() {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <div className="queryPanel">
        <Grid
          container
          spacing={1}
          alignItems="flex-start"
          style={{ margin: 10 }}
        >
          <Grid container item spacing={2}>
            <Grid item xs={10}>
              <Autocomplete
                size="small"
                multiple
                id="compound"
                value={this.props.selectedCompoundList}
                options={this.props.compoundList}
                getOptionLabel={(option) => option.NAME}
                disableCloseOnSelect
                ListboxComponent={VirtualListBox}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      size="small"
                      checkedIcon={checkedIcon}
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                      checked={selected}
                    />
                    <Typography
                      variant="caption"
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                    >
                      {option.NAME}
                    </Typography>
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="מתחם" />}
                onChange={(event, value) => {
                  let compounds = value.map((compound) => {
                    return compound.NAME;
                  });
                  this.setState({ compounds: compounds });
                  this.props.setQueryCompounds(compounds);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <Autocomplete
                size="small"
                multiple
                id="company"
                disableCloseOnSelect
                value={this.props.selectedCompnayList}
                options={this.props.companies}
                getOptionLabel={(option) => option.NAME}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      size="small"
                      checkedIcon={checkedIcon}
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                      checked={selected}
                    />
                    <Typography
                      variant="caption"
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                    >
                      {option.NAME}
                    </Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="שם חברה" />
                )}
                onChange={(event, value) => {
                  let companyList = value.map((company) => {
                    return company.id;
                  });
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
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      size="small"
                      checkedIcon={checkedIcon}
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                      checked={selected}
                    />
                    <Typography
                      variant="caption"
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                    >
                      {option[CITY_NAME_COLUMN]}
                    </Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="ישוב מגורים" />
                )}
                onChange={(event, value) => {
                  let cities = value.map((city) => {
                    return city[CITY_NAME_COLUMN];
                  });
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
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      size="small"
                      checkedIcon={checkedIcon}
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                      checked={selected}
                    />
                    <Typography
                      variant="caption"
                      style={{
                        margin: "0px",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                      }}
                    >
                      {option[CITY_NAME_COLUMN]}
                    </Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="ישוב עבודה" />
                )}
                onChange={(event, value) => {
                  let cities = value.map((city) => {
                    return city[CITY_NAME_COLUMN];
                  });
                  this.setState({ workingCity: cities });
                  this.props.setQueryWorkingCity(cities);
                }}
              />
            </Grid>
            <Grid item xs={10}>
              <TimeSlotQuery />
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ width: "10vh", margin: "auto" }} />
            </Grid>
            <Grid item xs={10}>
              <MarksQuery />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ width: "10vh", margin: "auto" }} />
          </Grid>
          <Grid item xs={12}>
            <Button
              className="queryButton"
              variant="contained"
              onClick={this.handleClick}
            >
              הצגה
              <Fade
                in={this.props.isGeneralReportRunnig}
                unmountOnExit
              >
                <CircularProgress
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === "light" ? 100 : 800
                      ],
                  }}
                  size={25}
                  thickness={4}
                />
              </Fade>
            </Button>
          </Grid>
          <Grid item xs={12}>
            {this.props.children}
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let companies = [];
  let settlementList = [];
  let compoundList = [];
  let qTimeSlotToHome = [];
  let qTimeSlotToWork = [];
  let qSelectedMarks = [];
  let selectedCompnayList = [];
  let selectedLivingCityList = [];
  let selectedWorkingCityList = [];
  let selectedCompoundList = [];
  let qStartingPolygon = {};
  let qDestinationPolygon = {};
  let isGeneralReportRunnig = false;
  if (state.loadData.companyList) {
    companies = state.loadData.companyList;
  }
  if (state.consts.settlementList) {
    settlementList = state.consts.settlementList;
  }
  if (state.consts.compoundList) {
    compoundList = state.consts.compoundList;
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
  // selected compound
  if (state.reportParams.qCompoundParams) {
    for (const selectedCompound of state.reportParams.qCompoundParams) {
      for (const compound of state.consts.compoundList)
        if (compound.NAME === selectedCompound) {
          selectedCompoundList.push(compound);
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
    companies: companies,
    settlementList: settlementList,
    qTimeSlotToWork: qTimeSlotToWork,
    qTimeSlotToHome: qTimeSlotToHome,
    qSelectedMarks: qSelectedMarks,
    selectedCompnayList: selectedCompnayList,
    selectedLivingCityList: selectedLivingCityList,
    selectedWorkingCityList: selectedWorkingCityList,
    qStartingPolygon: qStartingPolygon,
    qDestinationPolygon: qDestinationPolygon,
    isGeneralReportRunnig: isGeneralReportRunnig,
    selectedCompoundList: selectedCompoundList,
    compoundList: compoundList,
  };
}

export default requireAuth(
  connect(mapStateToProps, actions)(HeatmapQueryPanel)
);
