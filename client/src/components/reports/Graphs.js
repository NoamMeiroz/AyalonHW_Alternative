import React from 'react';
import * as reportTypes from "./types";
import requireAuth from "../requireAuth"; //used to check if login successfull

import TopFiveGraphs from './TopFiveGraphs';


function Graphs({reportType, data}) {
  let jsx = null;
  switch (reportType) {
    case reportTypes.TOP_FIVE_SOLUTIONS:
        jsx = <TopFiveGraphs data={data} />
        break;
    default:
        jsx = null;
        break;
  }
  return jsx;
}

export default requireAuth(Graphs);

