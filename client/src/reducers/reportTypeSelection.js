import React from "react";

import { REPORT_SELECTION, GENERAL_REPORT_RESULT } from "../actions/types";
import * as reportTypes from "../components/reports/types";

/**
 * return column stracture for general report (all columns)
 */
const getGeneralReport = () => {
  const columnProperties = {};
  columnProperties.columnGrouping = [
    { label: "", span: 2 },
    { label: "כתובת מגורים", span: 2 },
    { label: "מקום עבודה", span: 4 },
    { label: "", span: 2 },
    { label: "ציונים", span: 7 },
    { label: "זמני הגעה בדקות", span: 8 },
    { label: "מרחק במטרים", span: 8 },
  ];
  columnProperties.columns = [
    { label: "שם חברה", id: "COMPANY", minWidth: 100, top: 57 },
    { label: "מזהה עובד", id: "WORKER_ID", minWidth: 50, top: 57 },
    { label: "ישוב", id: "CITY", minWidth: 100, top: 57 },
    { label: "רחוב", id: "STREET", minWidth: 100, top: 57 },
    { label: "סניף", id: "SITE_NAME", minWidth: 100, top: 57 },
    { label: "ישוב", id: "WORK_CITY", minWidth: 100, top: 57 },
    { label: "רחוב", id: "WORK_STREET", minWidth: 100, top: 57 },
    { label: "מספר", id: "WORK_BUILDING", minWidth: 100, top: 57 },
    {
      label: "שעת הגעה למקום העבודה",
      id: "EXIT_HOUR_TO_WORK",
      minWidth: 100,
      top: 57,
    },
    {
      label: "שעת היציאה ממקום העבודה",
      id: "RETURN_HOUR_TO_HOME",
      minWidth: 100,
      top: 57,
    },
    {
      label: "מיקרומוביליטי",
      id: "FINAL_BICYCLE_GRADE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "שאטלים מטעם העבודה",
      id: "FINAL_WORK_SHUTTLE_GRADE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "שאטל במתחם העבודה",
      id: "FINAL_COMPOUND_SHUTTLE_GRADE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "Carpool/Vanpool",
      id: "FINAL_CARPOOL_GRADE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "תחבורה ציבורית",
      id: "FINAL_PUBLIC_TRANSPORT_GRADE",
      width: 20,
      top: 57,
    },
    { label: "הגעה רגלית", id: "FINAL_WALKING_GRADE", minWidth: 100 },
    {
      label: "עבודה מרחוק",
      id: "FINAL_WORKING_FROM_HOME_GRADE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-רכב פרטי",
      id: "BEST_ROUTE_TO_WORK_DRIVING_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-הליכה",
      id: "BEST_ROUTE_TO_WORK_WALKING_DURATION",
      minWidth: 100,
    },
    {
      label: "הלוך למשרד-תחבורה ציבורית",
      id: "BEST_ROUTE_TO_WORK_TRANSIT_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-אופניים",
      id: "BEST_ROUTE_TO_WORK_BICYCLING_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזרה הביתה-רכב פרטי",
      id: "BEST_ROUTE_TO_HOME_DRIVING_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזרה הביתה-הליכה",
      id: "BEST_ROUTE_TO_HOME_WALKING_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזרה הביתה-תחבורה ציבורית",
      id: "BEST_ROUTE_TO_HOME_TRANSIT_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזור הביתה-אופניים",
      id: "BEST_ROUTE_TO_HOME_BICYCLING_DURATION",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-רכב פרטי",
      id: "BEST_ROUTE_TO_WORK_DRIVING_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-הליכה",
      id: "BEST_ROUTE_TO_WORK_WALKING_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-תחבורה ציבורית",
      id: "BEST_ROUTE_TO_WORK_TRANSIT_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "הלוך למשרד-אופניים",
      id: "BEST_ROUTE_TO_WORK_BICYCLING_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזרה הביתה-רכב פרטי",
      id: "BEST_ROUTE_TO_HOME_DRIVING_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזרה הביתה-הליכה",
      id: "BEST_ROUTE_TO_HOME_WALKING_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזרה הביתה-תחבורה ציבורית",
      id: "BEST_ROUTE_TO_HOME_TRANSIT_DISTANCE",
      minWidth: 100,
      top: 57,
    },
    {
      label: "חזור הביתה-אופניים",
      id: "BEST_ROUTE_TO_HOME_BICYCLING_DISTANCE",
      minWidth: 100,
      top: 57,
    },
  ];
  return columnProperties;
};

/**
 * return column stracture for Time potentail report
 */
const getTimePotential = () => {
  const highlightColor = "#99EDC3";
  const columnProperties = {};
  columnProperties.columnGrouping = [
    { label: "", span: 2 },
    { label: "זמן הגעה למשרד בדקות", span: 4 },
    { label: "זמן חזרה הביתה בדקות", span: 4 },
  ];

  columnProperties.columns = [
    { label: "שם חברה", id: "COMPANY", minWidth: 100 },
    { label: "מזהה עובד", id: "WORKER_ID", minWidth: 50 },
    {
      label: "רכב פרטי",
      id: "BEST_ROUTE_TO_WORK_DRIVING_DURATION",
      minWidth: 100,
    },
    {
      label: "תחבורה ציבורית",
      id: "BEST_ROUTE_TO_WORK_TRANSIT_DURATION",
      Cell: (props) => {
        return (
          <div
            style={{
              width: 100,
              backgroundColor:
                props.value === 'נתונים חסרים' ? null : 
                props.row.BEST_ROUTE_TO_WORK_DRIVING_DURATION >=
                props.value
                  ? highlightColor
                  : null,
            }}
          >
            {props.value}
          </div>
        );
      },
    },
    {
      label: "אופניים",
      id: "BEST_ROUTE_TO_WORK_BICYCLING_DURATION",
      Cell: (props) => {
        return (
          <div
            style={{
              width: 100,
              backgroundColor:
                props.value === 'נתונים חסרים' ? null : 
                props.row.BEST_ROUTE_TO_WORK_DRIVING_DURATION >=
                props.value
                  ? highlightColor
                  : null,
            }}
          >
            {props.value}
          </div>
        );
      },
    },
    {
      label: "הליכה",
      id: "BEST_ROUTE_TO_WORK_WALKING_DURATION",
      Cell: (props) => {
        return (
          <div
            style={{
              width: 100,
              backgroundColor:
                props.value === 'נתונים חסרים' ? null : 
                props.row.BEST_ROUTE_TO_WORK_DRIVING_DURATION >=
                props.value
                  ? highlightColor
                  : null,
            }}
          >
            {props.value}
          </div>
        );
      },
    },
    {
      label: "חזרה הביתה-רכב פרטי",
      id: "BEST_ROUTE_TO_HOME_DRIVING_DURATION",
      minWidth: 100,
    },
    {
      label: "חזרה הביתה-תחבורה ציבורית",
      id: "BEST_ROUTE_TO_HOME_TRANSIT_DURATION",
      Cell: (props) => {
        return (
          <div
            style={{
              width: 100,
              backgroundColor:
                props.value === 'נתונים חסרים' ? null : 
                props.row.BEST_ROUTE_TO_HOME_DRIVING_DURATION >=
                props.value
                  ? highlightColor
                  : null,
            }}
          >
            {props.value}
          </div>
        );
      },
    },
    {
      label: "חזור הביתה-אופניים",
      id: "BEST_ROUTE_TO_HOME_BICYCLING_DURATION",
      Cell: (props) => {
        return (
          <div
            style={{
              width: 100,
              backgroundColor:
                props.value === 'נתונים חסרים' ? null : 
                props.row.BEST_ROUTE_TO_HOME_DRIVING_DURATION >=
                props.value
                  ? highlightColor
                  : null,
            }}
          >
            {props.value}
          </div>
        );
      },
    },
    {
      label: "חזרה הביתה-הליכה",
      id: "BEST_ROUTE_TO_HOME_WALKING_DURATION",
      Cell: (props) => {
        return (
          <div
            style={{
              width: 100,
              backgroundColor:
                props.value === 'נתונים חסרים' ? null : 
                props.row.BEST_ROUTE_TO_HOME_DRIVING_DURATION >=
                props.value
                  ? highlightColor
                  : null,
            }}
          >
            {props.value}
          </div>
        );
      },
    },
  ];
  return columnProperties;
};

/**
 * return column stracture for top five solution report
 */
const getTopSolutionsColumns = () => {
  const columnProperties = {};
  const columns = [
    { label: "שם חברה", id: "COMPANY", minWidth: 100 },
    { label: "מזהה עובד", id: "WORKER_ID", minWidth: 50 },
    { label: "דרוג 1", id: "TOP_SOLUTION_1", minWidth: 50 },
    { label: "דרוג 2", id: "TOP_SOLUTION_2", minWidth: 50 },
    { label: "דרוג 3", id: "TOP_SOLUTION_3", minWidth: 50 },
    { label: "דרוג 4", id: "TOP_SOLUTION_4", minWidth: 50 },
    { label: "דרוג 5", id: "TOP_SOLUTION_5", minWidth: 50 },
  ];
  columnProperties.columns = columns;
  return columnProperties;
};

const getCouplngReportColumns = () => {
  const columnProperties = {};
  columnProperties.columnGrouping = [
    { label: "", span: 3 },
    { label: "ציונים", span: 3 },
    { label: "כתובת מגורים", span: 2 },
    { label: "כתובת עבודה", span: 4 },
    { label: "", span: 2 },
  ];
  columnProperties.columns = [
    { label: "שם חברה", id: "COMPANY", minWidth: 100 },
    { label: "מזהה עובד", id: "WORKER_ID", minWidth: 50 },
    { label: "קבוצה", id: "cluster", minWidth: 50 },
    {
      label: "שאטלים מטעם העבודה",
      id: "FINAL_WORK_SHUTTLE_GRADE",
      minWidth: 100,
    },
    {
      label: "שאטל במתחם העבודה",
      id: "FINAL_COMPOUND_SHUTTLE_GRADE",
      minWidth: 100,
    },
    { label: "Carpool/Vanpool", id: "FINAL_CARPOOL_GRADE", minWidth: 100 },
    { label: "ישוב", id: "CITY", minWidth: 100 },
    { label: "רחוב", id: "STREET", minWidth: 100 },
    { label: "סניף", id: "SITE_NAME", minWidth: 100 },
    { label: "ישוב", id: "WORK_CITY", minWidth: 100 },
    { label: "רחוב", id: "WORK_STREET", minWidth: 100 },
    { label: "מספר", id: "WORK_BUILDING", minWidth: 100 },
    { label: "שעת הגעה למקום העבודה", id: "EXIT_HOUR_TO_WORK", minWidth: 100 },
    {
      label: "שעת היציאה ממקום העבודה",
      id: "RETURN_HOUR_TO_HOME",
      minWidth: 100,
    },
  ];
  return columnProperties;
};

const getTopSolutionsData = (origData) => {
  let data = [];

  for (const employee of origData) {
    let row = {};
    if (isNaN(parseFloat(employee["X"]))) continue;
    row["id"] = employee.id;
    row["COMPANY"] = employee["COMPANY"];
    row["WORKER_ID"] = employee["WORKER_ID"];
    row["TOP_SOLUTION_1"] = employee["TOP_SOLUTION_1"];
    row["TOP_SOLUTION_2"] = employee["TOP_SOLUTION_2"];
    row["TOP_SOLUTION_3"] = employee["TOP_SOLUTION_3"];
    row["TOP_SOLUTION_4"] = employee["TOP_SOLUTION_4"];
    row["TOP_SOLUTION_5"] = employee["TOP_SOLUTION_5"];
    data.push(row);
  }
  return data;
};

/**
 * Create data structure for specified reportType
 * @param {*} origData
 * @param {*} reportType
 */
const getData = (reportsData, reportType) => {
  let data = [];
  switch (reportType) {
    case reportTypes.GENERAL_REPORT:
      // show only employees with location data;
      if (reportsData.employeesList) {
        data = reportsData.employeesList.filter((employee) => {
          return parseFloat(employee.X);
        });
      }
      break;
    case reportTypes.TIME_POTENTIAL:
      // show only employees with location data;
      if (reportsData.employeesList) {
        data = reportsData.employeesList.filter((employee) => {
          return parseFloat(employee.X);
        });
      }
      break;
    case reportTypes.TOP_FIVE_SOLUTIONS:
      if (reportsData) {
        data = getTopSolutionsData(reportsData.employeesList);
      }
      break;
    case reportTypes.COUPLING_REPORT:
      if (reportsData.clusterReport) {
        data = reportsData.clusterReport.slice(0);
        data = data.map((employee) => {
          let emp = { ...employee };
          if (emp.cluster === -1) emp.cluster = "ללא שיוך לקבוצה";
          return emp;
        });
      }
      break;
    default:
      // show only employees with location data;
      if (reportsData.employeesList) {
        data = reportsData.employeesList.filter((employee) => {
          return parseFloat(employee.X);
        });
      }
      break;
  }
  return data;
};

/**
 * Return column stracture for the report table
 * @param {*} reportType
 */
const getColumns = (reportType) => {
  let columns = [];
  switch (reportType) {
    case reportTypes.GENERAL_REPORT:
      columns = getGeneralReport();
      break;
    case reportTypes.TIME_POTENTIAL:
      columns = getTimePotential();
      break;
    case reportTypes.TOP_FIVE_SOLUTIONS:
      columns = getTopSolutionsColumns();
      break;
    case reportTypes.COUPLING_REPORT:
      columns = getCouplngReportColumns();
      break;
    default:
      columns = getGeneralReport();
      break;
  }
  return columns;
};

const INITIAL_STATE = {
  data: [],
  reportType: reportTypes.GENERAL_REPORT,
  columns: getGeneralReport().columns,
  columnGrouping: getGeneralReport().columnGrouping,
};

export default function (state = INITIAL_STATE, action) {
  let columnProperties = {};

  switch (action.type) {
    case GENERAL_REPORT_RESULT:
      columnProperties = getColumns(reportTypes.GENERAL_REPORT);
      return {
        ...state,
        columns: columnProperties.columns,
        columnGrouping: columnProperties.columnGrouping,
        reportType: reportTypes.GENERAL_REPORT,
        data: getData(
          { employeesList: action.employeesList },
          reportTypes.GENERAL_REPORT
        ),
        timestamp: new Date(),
      };
    case REPORT_SELECTION:
      columnProperties = getColumns(action.reportType);
      return {
        ...state,
        columns: columnProperties.columns,
        columnGrouping: columnProperties.columnGrouping,
        reportType: action.reportType,
        data: getData(action.reportsData, action.reportType),
        timestamp: new Date(),
      };
    default:
      return state;
  }
}
