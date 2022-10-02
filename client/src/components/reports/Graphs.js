import React from 'react';
import * as reportTypes from "./types";
import requireAuth from "../requireAuth"; //used to check if login successfull

import Paper from "@mui/material/Paper";
import TopFiveGraphs from './TopFiveGraphs';
import MatchingSolutionGraphs from './MatchingSolutionGraphs';
import TrasnportDifficultiesGraphs from './TrasnportDifficultiesGraphs';


function Graphs({reportType, data}) {
  let jsx = null;
  switch (reportType) {
    case reportTypes.TOP_FIVE_SOLUTIONS:
        jsx = <TopFiveGraphs data={data} />
        break;
    case reportTypes.GENERAL_REPORT:
        jsx = <MatchingSolutionGraphs data={data} />
        break;
    case reportTypes.DIFFICULT_REPORT:
        jsx = <TrasnportDifficultiesGraphs data={data} />
        break;
    default:
        jsx = null;
        break;
  }
  return <Paper elevation={0} sx={{width: 700, marginRight: "auto", marginLeft: "auto", paddingBottom: '2vh' }}>
      {jsx}
  </Paper>;
}

export default requireAuth(Graphs);

