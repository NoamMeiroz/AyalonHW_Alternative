import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import requireAuth from "../requireAuth"; //used to check if login successfull
import * as actions from "../../actions";

const MAX_VALUE = 30;
const MIN_VALUE = 2;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  noElevation: {
    elevation: 0,
    boxShadow: "none",
    padding: 0,
  },
  details: {
    paddingLeft: "5px",
    paddingRight: "4px",
    paddingTop: "0px",
  },
  button: {
    width: "100%",
  },
  progress: {
    size: "10",
  },
}));

/**
 * make Slider with small font labels
 */
const ClusterSizeSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-markLabel": {
    fontSize: "0.6rem",
  },
}));

/**
 * return marks label (tiks)
 */
function getMarks() {
  let marks = [];
  for (let i = MIN_VALUE; i <= MAX_VALUE; i = i + 4) {
    let mark = { value: i, label: `${i}` };
    marks.push(mark);
  }
  return marks;
}

function ClusterSlider({ values }) {
  const dispatch = useDispatch();

  const handleChange = (newValue) => {
    dispatch(actions.setClusterBoundey(newValue));
  };
  return (
    <ClusterSizeSlider
      id="minMaxCluster"
      value={values}
      onChange={(event, newValue) => handleChange(newValue)}
      valueLabelDisplay="auto"
      //     getAriaValueText={valuetext}
      marks={getMarks()}
      step={1}
      min={MIN_VALUE}
      max={MAX_VALUE}
    />
  );
}

/**
 * Return jsx with all slider marks
 */
const ClusterComponents = ({ values }) => {
  return (
    <Grid item xs={10}>
      <Typography variant="caption" gutterBottom>
        גודל קבוצה
      </Typography>
      <ClusterSlider values={values} />
    </Grid>
  );
};

function ClusterBounderyQuery({ qClusterBoundery }) {
  //const CITY_NAME_COLUMN = "NAME";
  const classes = useStyles();
  const dispatch = useDispatch();

  const qWorkingCityParams = useSelector(
    (state) => state.reportParams.qWorkingCityParams
  );
  const qLivingCityParams = useSelector(
    (state) => state.reportParams.qLivingCityParams
  );
  const qCompanyParams = useSelector(
    (state) => state.reportParams.qCompanyParams
  );
  const qTimeSlotToWork = useSelector(
    (state) => state.reportParams.qTimeSlotToWork
  );
  const qTimeSlotToHome = useSelector(
    (state) => state.reportParams.qTimeSlotToHome
  );
  const qSelectedMarks = useSelector(
    (state) => state.reportParams.qSelectedMarks
  );
  const qDestinationPolygon = useSelector(
    (state) => state.reportParams.qDestinationPolygonParams.polygon
  );
  const qStartingPolygon = useSelector(
    (state) => state.reportParams.qStartingPolygonParams.polygon
  );
  const qClusterBounderyParams = useSelector(
    (state) => state.reportParams.qClusterBoundery
  );
  const isClusterReportRunnig = useSelector(
    (state) => state.reports.isClusterReportRunnig
  );
  const qCompoundParams = useSelector(
    (state) => state.reportParams.qCompoundParams
  );

  const handleClick = () => {
    dispatch(
      actions.calculateCluster(
        qCompanyParams,
        qLivingCityParams,
        qWorkingCityParams,
        qCompoundParams,
        qTimeSlotToWork,
        qTimeSlotToHome,
        qSelectedMarks,
        qDestinationPolygon,
        qStartingPolygon,
        qClusterBounderyParams
      )
    );
  };

  const clearReport = () => {
    dispatch(actions.clearClusterReport());
  };

  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <Divider style={{ width: "10vh", margin: "auto" }} />
      </Grid>
      <ClusterComponents values={qClusterBoundery} />
      <Grid item container xs={10}>
        <Grid item xs={10}>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClick}
          >
            הפק דוח צימודים
            <Fade
              in={isClusterReportRunnig}
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
        <Grid item xs={2}>
          <Tooltip title="נקה דוח צימודים">
            <IconButton
              color="primary"
              aria-label="clear cluster report"
              component="span"
              disabled={isClusterReportRunnig}
              onClick={clearReport}
            >
              <LayersClearIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
}

function mapStateToProps(state) {
  var qClusterBoundery = MAX_VALUE;
  if (state.reportParams.qClusterBoundery) {
    qClusterBoundery = state.reportParams.qClusterBoundery;
  }
  return { qClusterBoundery: qClusterBoundery };
}

export default requireAuth(
  connect(mapStateToProps, actions)(ClusterBounderyQuery)
);
