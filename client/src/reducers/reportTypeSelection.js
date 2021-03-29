
import React from 'react';

import { REPORT_SELECTION, GENERAL_REPORT_RESULT } from '../actions/types';
import * as reportTypes from '../components/reports/types';

/**
 * return column stracture for general report (all columns)
 */
const getGeneralReport = () => {
    const columns = [
        { Header: 'שם חברה', accessor: 'COMPANY', className: "secondHeader", style: { width: 100 } },
        { Header: 'מזהה עובד', accessor: 'WORKER_ID', className: "secondHeader", style: { width: 50 } },
        {
            Header: 'כתובת מגורים', className: "firstHeader", columns: [
                { Header: "ישוב", accessor: 'CITY', className: "secondHeader", style: { width: 100 } },
                { Header: "רחוב", accessor: 'STREET', className: "secondHeader", style: { width: 100 } },
                { Header: "מספר בית", accessor: 'BUILDING_NUMBER', className: "secondHeader", style: { width: 100 } }
            ]
        },
        {
            Header: 'מקום עבודה', className: "firstHeader", columns: [
                { Header: "סניף", accessor: 'SITE_NAME', className: "secondHeader", style: { width: 100 } },
                { Header: "ישוב", accessor: 'WORK_CITY', className: "secondHeader", style: { width: 100 } },
                { Header: "רחוב", accessor: 'WORK_STREET', className: "secondHeader", style: { width: 100 } },
                { Header: "מספר", accessor: 'WORK_BUILDING', className: "secondHeader", style: { width: 100 } }
            ]
        },
        { Header: "שעת הגעה למקום העבודה", accessor: 'EXIT_HOUR_TO_WORK', className: "secondHeader", style: { width: 100 } },
        { Header: "שעת היציאה ממקום העבודה", accessor: 'RETURN_HOUR_TO_HOME', className: "secondHeader", style: { width: 100 } },
        {
            Header: 'ציונים', className: "firstHeader", columns: [
                { Header: "קיצור שעות העבודה", accessor: 'FINAL_SHORT_HOURS_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "הזזת זמן הגעה לעבודה", accessor: 'FINAL_SHIFTING_HOURS_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "דו גלגלי-אופניים", accessor: 'FINAL_BICYCLE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "דו גלגלי-קורקינט", accessor: 'FINAL_SCOOTER_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "Shuttle On Demand", accessor: 'FINAL_PERSONALIZED_SHUTTLE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "שאטלים מטעם העבודה", accessor: 'FINAL_WORK_SHUTTLE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "Carshare/Vanshare", accessor: 'FINAL_CARSHARE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "Carpool/Vanpool", accessor: 'FINAL_CARPOOL_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "מוניות שיתופיות", accessor: 'FINAL_CABSHARE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "תחבורה ציבורית", accessor: 'FINAL_PUBLIC_TRANSPORT_GRADE', className: "secondHeader", width: 20 },
                { Header: "הגעה רגלית", accessor: 'FINAL_WALKING_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "עבודה מהבית", accessor: 'FINAL_WORKING_FROM_HOME_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "עבודה במרכזים שיתופיים", accessor: 'FINAL_SHARED_WORKSPACE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "שינוי ימי הגעה לעבודה", accessor: 'FINAL_SHIFTING_WORKING_DAYS_GRADE', className: "secondHeader", style: { width: 100 } }
            ]
        },
        {
            Header: 'זמני הגעה בדקות', className: "firstHeader", columns: [
                { Header: "הלוך למשרד-רכב פרטי", accessor: 'BEST_ROUTE_TO_WORK_DRIVING_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "הלוך למשרד-הליכה", accessor: 'BEST_ROUTE_TO_WORK_WALKING_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "הלוך למשרד-תחבורה ציבורית", accessor: 'BEST_ROUTE_TO_WORK_TRANSIT_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "הלוך למשרד-אופניים", accessor: 'BEST_ROUTE_TO_WORK_BICYCLING_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "חזרה הביתה-רכב פרטי", accessor: 'BEST_ROUTE_TO_HOME_DRIVING_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "חזרה הביתה-הליכה", accessor: 'BEST_ROUTE_TO_HOME_WALKING_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "חזרה הביתה-תחבורה ציבורית", accessor: 'BEST_ROUTE_TO_HOME_TRANSIT_DURATION', className: "secondHeader", style: { width: 100 } },
                { Header: "חזור הביתה-אופניים", accessor: 'BEST_ROUTE_TO_HOME_BICYCLING_DURATION', className: "secondHeader", style: { width: 100 } }
            ]
        },
        {
            Header: 'מרחק במטרים', className: "firstHeader", columns: [
                { Header: "הלוך למשרד-רכב פרטי", accessor: 'BEST_ROUTE_TO_WORK_DRIVING_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "הלוך למשרד-הליכה", accessor: 'BEST_ROUTE_TO_WORK_WALKING_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "הלוך למשרד-תחבורה ציבורית", accessor: 'BEST_ROUTE_TO_WORK_TRANSIT_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "הלוך למשרד-אופניים", accessor: 'BEST_ROUTE_TO_WORK_BICYCLING_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "חזרה הביתה-רכב פרטי", accessor: 'BEST_ROUTE_TO_HOME_DRIVING_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "חזרה הביתה-הליכה", accessor: 'BEST_ROUTE_TO_HOME_WALKING_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "חזרה הביתה-תחבורה ציבורית", accessor: 'BEST_ROUTE_TO_HOME_TRANSIT_DISTANCE', className: "secondHeader", style: { width: 100 } },
                { Header: "חזור הביתה-אופניים", accessor: 'BEST_ROUTE_TO_HOME_BICYCLING_DISTANCE', className: "secondHeader", style: { width: 100 } }
            ]
        }

    ];
    return columns;
}

/**
 * return column stracture for Time potentail report
 */
const getTimePotential = () => {
    const columns = [
        { Header: 'שם חברה', accessor: 'COMPANY', className: "secondHeader", style: { width: 100 } },
        { Header: 'מזהה עובד', accessor: 'WORKER_ID', className: "secondHeader", style: { width: 50 } },
        {
            Header: 'זמן הגעה למשרד בדקות', className: "firstHeader", columns: [
                { Header: "רכב פרטי", accessor: 'BEST_ROUTE_TO_WORK_DRIVING_DURATION', className: "secondHeader", style: { width: 100 } },
                {
                    Header: "תחבורה ציבורית", accessor: 'BEST_ROUTE_TO_WORK_TRANSIT_DURATION', className: "secondHeader",
                    Cell: (props) => {
                        return (<div style={{
                            width: 100,
                            backgroundColor: (props.row.values.BEST_ROUTE_TO_WORK_DRIVING_DURATION >=
                                props.value ? 'yellow' : null)
                        }}>
                            {props.value}
                        </div>
                        )
                    }
                },
                {
                    Header: "אופניים", accessor: 'BEST_ROUTE_TO_WORK_BICYCLING_DURATION', className: "secondHeader",
                    Cell: (props) => {
                        return (<div style={{
                            width: 100,
                            backgroundColor: (props.row.values.BEST_ROUTE_TO_WORK_DRIVING_DURATION >=
                                props.value ? 'yellow' : null)
                        }}>
                            {props.value}
                        </div>
                        )
                    }
                },
                {
                    Header: "הליכה", accessor: 'BEST_ROUTE_TO_WORK_WALKING_DURATION', className: "secondHeader",
                    Cell: (props) => {
                        return (<div style={{
                            width: 100,
                            backgroundColor: (props.row.values.BEST_ROUTE_TO_WORK_DRIVING_DURATION >=
                                props.value ? 'yellow' : null)
                        }}>
                            {props.value}
                        </div>
                        )
                    }
                }
            ]
        },
        {
            Header: 'זמן חזרה הביתה בדקות', className: "firstHeader", columns: [
                { Header: "חזרה הביתה-רכב פרטי", accessor: 'BEST_ROUTE_TO_HOME_DRIVING_DURATION', className: "secondHeader", style: { width: 100 } },
                {
                    Header: "חזרה הביתה-תחבורה ציבורית", accessor: 'BEST_ROUTE_TO_HOME_TRANSIT_DURATION', className: "secondHeader",
                    Cell: (props) => {
                        return (<div style={{
                            width: 100,
                            backgroundColor: (props.row.values.BEST_ROUTE_TO_HOME_DRIVING_DURATION >=
                                props.value ? 'yellow' : null)
                        }}>
                            {props.value}
                        </div>
                        )
                    }
                },
                {
                    Header: "חזור הביתה-אופניים", accessor: 'BEST_ROUTE_TO_HOME_BICYCLING_DURATION', className: "secondHeader",
                    Cell: (props) => {
                        return (<div style={{
                            width: 100,
                            backgroundColor: (props.row.values.BEST_ROUTE_TO_HOME_DRIVING_DURATION >=
                                props.value ? 'yellow' : null)
                        }}>
                            {props.value}
                        </div>
                        )
                    }
                },
                {
                    Header: "חזרה הביתה-הליכה", accessor: 'BEST_ROUTE_TO_HOME_WALKING_DURATION', className: "secondHeader",
                    Cell: (props) => {
                        return (<div style={{
                            width: 100,
                            backgroundColor: (props.row.values.BEST_ROUTE_TO_HOME_DRIVING_DURATION >=
                                props.value ? 'yellow' : null)
                        }}>
                            {props.value}
                        </div>
                        )
                    }
                }
            ]
        }
    ];
    return columns;
}

/**
 * return column stracture for top five solution report
 */
const getTopSolutionsColumns = () => {
    const columns = [
        { Header: 'שם חברה', accessor: 'COMPANY', style: { width: 100 } },
        { Header: 'מזהה עובד', accessor: 'WORKER_ID', style: { width: 50 } },
        { Header: 'דרוג 1-פתרון', accessor: 'SOLUTION_1', style: { width: 50 } },
        { Header: 'דרוג 1-ציון', accessor: 'GRADE_1', style: { width: 50 } },
        { Header: 'דרוג 2-פתרון', accessor: 'SOLUTION_2', style: { width: 50 } },
        { Header: 'דרוג 2-ציון', accessor: 'GRADE_2', style: { width: 50 } },
        { Header: 'דרוג 3-פתרון', accessor: 'SOLUTION_3', style: { width: 50 } },
        { Header: 'דרוג 3-ציון', accessor: 'GRADE_3', style: { width: 50 } },
        { Header: 'דרוג 4-פתרון', accessor: 'SOLUTION_4', style: { width: 50 } },
        { Header: 'דרוג 4-ציון', accessor: 'GRADE_4', style: { width: 50 } },
        { Header: 'דרוג 5-פתרון', accessor: 'SOLUTION_5', style: { width: 50 } },
        { Header: 'דרוג 5-ציון', accessor: 'GRADE_5', style: { width: 50 } }
    ];
    return columns;
}

const getCouplngReportColumns = () => {
    const columns = [
        { Header: 'שם חברה', accessor: 'COMPANY', className: "secondHeader", style: { width: 100 } },
        { Header: 'מזהה עובד', accessor: 'WORKER_ID', className: "secondHeader", style: { width: 50 } },
        { Header: 'קבוצה', accessor: 'cluster', className: "secondHeader", style: { width: 50 } },
        {
            Header: 'ציונים', className: "firstHeader", columns: [
                { Header: "Shuttle On Demand", accessor: 'FINAL_PERSONALIZED_SHUTTLE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "שאטלים מטעם העבודה", accessor: 'FINAL_WORK_SHUTTLE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "Carshare/Vanshare", accessor: 'FINAL_CARSHARE_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "Carpool/Vanpool", accessor: 'FINAL_CARPOOL_GRADE', className: "secondHeader", style: { width: 100 } },
                { Header: "מוניות שיתופיות", accessor: 'FINAL_CABSHARE_GRADE', className: "secondHeader", style: { width: 100 } }
            ]
        },
        {
            Header: 'כתובת מגורים', className: "firstHeader", columns: [
                { Header: "ישוב", accessor: 'CITY', className: "secondHeader", style: { width: 100 } },
                { Header: "רחוב", accessor: 'STREET', className: "secondHeader", style: { width: 100 } },
                { Header: "מספר בית", accessor: 'BUILDING_NUMBER', className: "secondHeader", style: { width: 100 } }
            ]
        },
        {
            Header: 'מקום עבודה', className: "firstHeader", columns: [
                { Header: "סניף", accessor: 'SITE_NAME', className: "secondHeader", style: { width: 100 } },
                { Header: "ישוב", accessor: 'WORK_CITY', className: "secondHeader", style: { width: 100 } },
                { Header: "רחוב", accessor: 'WORK_STREET', className: "secondHeader", style: { width: 100 } },
                { Header: "מספר", accessor: 'WORK_BUILDING', className: "secondHeader", style: { width: 100 } }
            ]
        },
        { Header: "שעת הגעה למקום העבודה", accessor: 'EXIT_HOUR_TO_WORK', className: "secondHeader", style: { width: 100 } },
        { Header: "שעת היציאה ממקום העבודה", accessor: 'RETURN_HOUR_TO_HOME', className: "secondHeader", style: { width: 100 } },
    ];
    return columns;
}


const getTopSolutionsData = (origData) => {
    let data = [];
    const MARK_COLUMNS = [{ Header: "קיצור שעות העבודה", accessor: 'FINAL_SHORT_HOURS_GRADE' },
    { Header: "הזזת זמן הגעה לעבודה", accessor: 'FINAL_SHIFTING_HOURS_GRADE' },
    { Header: "דו גלגלי-אופניים", accessor: 'FINAL_BICYCLE_GRADE' },
    { Header: "דו גלגלי-קורקינט", accessor: 'FINAL_SCOOTER_GRADE' },
    { Header: "Shuttle On Demand", accessor: 'FINAL_PERSONALIZED_SHUTTLE_GRADE' },
    { Header: "שאטלים מטעם העבודה", accessor: 'FINAL_WORK_SHUTTLE_GRADE' },
    { Header: "Carshare/Vanshare", accessor: 'FINAL_CARSHARE_GRADE' },
    { Header: "Carpool/Vanpool", accessor: 'FINAL_CARPOOL_GRADE' },
    { Header: "מוניות שיתופיות", accessor: 'FINAL_CABSHARE_GRADE' },
    { Header: "תחבורה ציבורית", accessor: 'FINAL_PUBLIC_TRANSPORT_GRADE' },
    { Header: "הגעה רגלית", accessor: 'FINAL_WALKING_GRADE' },
    { Header: "עבודה מהבית", accessor: 'FINAL_WORKING_FROM_HOME_GRADE' },
    { Header: "עבודה במרכזים שיתופיים", accessor: 'FINAL_SHARED_WORKSPACE_GRADE' },
    { Header: "שינוי ימי הגעה לעבודה", accessor: 'FINAL_SHIFTING_WORKING_DAYS_GRADE' }
    ];

    for (const employee of origData) {
        let row = {};
        if (isNaN(parseFloat(employee["X"])))
            continue;
        row["COMPANY"] = employee["COMPANY"];
        row["WORKER_ID"] = employee["WORKER_ID"];
        let marks = [];
        for (const solution of MARK_COLUMNS) {
            marks.push({ solution: solution, grade: employee[solution.accessor] });
        }
        marks = marks.sort((markA, markB) => { return (markB.grade - markA.grade) });
        for (let i = 0; i < 5; i++) {
            let solution = `SOLUTION_${i + 1}`;
            let grade = `GRADE_${i + 1}`;
            row[solution] = marks[i].solution.Header;
            row[grade] = marks[i].grade;
        }
        data.push(row);
    }
    return data;
}

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
                data = reportsData.employeesList.filter(employee => {
                    return parseFloat(employee.X);
                });
            }
            break;
        case reportTypes.TIME_POTENTIAL:
            // show only employees with location data;
            if (reportsData.employeesList) {
                data = reportsData.employeesList.filter(employee => {
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
                data = data.map(employee=> {
                    let emp = {...employee};
                    if (emp.cluster===-1)
                        emp.cluster = "ללא שיוך לקבוצה";
                    return emp;
                })
            }
            break;
        default:
            // show only employees with location data;
            if (reportsData.employeesList) {
                data = reportsData.employeesList.filter(employee => {
                    return parseFloat(employee.X);
                });
            }
            break;
    }
    return data;
}


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
}

const INITIAL_STATE = {
    data: [],
    reportType: reportTypes.GENERAL_REPORT,
    columns: getGeneralReport()
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case GENERAL_REPORT_RESULT:
            return {
                ...state,
                columns: getColumns(reportTypes.GENERAL_REPORT),
                reportType: reportTypes.GENERAL_REPORT,
                data: getData({ employeesList: action.employeesList }, reportTypes.GENERAL_REPORT),
                timestamp: new Date()
            };    
        case REPORT_SELECTION:
            return {
                ...state,
                columns: getColumns(action.reportType),
                reportType: action.reportType,
                data: getData(action.reportsData, action.reportType),
                timestamp: new Date()
            };
        default:
            return state;
    }
}
