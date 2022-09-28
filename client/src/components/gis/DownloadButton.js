import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import * as reportTypes from '../reports/types';
import * as actions from '../../actions';

import IconButton from '@mui/material/IconButton';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { countTopSolutions, labels } from '../reports/TopFiveGraphs';
import { tableRowClasses } from '@mui/material';


class DownloadButton extends Component {

   constructor() {
      super();
      this.fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      this.fileExtension = '.xlsx';
      this.state = { uploadProgess: 0, isWorkerStarted: false };

   }

   generalReport = async (csvData) => {
      const fileName = "דוח נתוני עובדים";
      let wb = new ExcelJS.Workbook();
      let ws = wb.addWorksheet('נתוני עובדים');

      // set columns 
      ws.columns = [
         { header: 'שם חברה', key: 'COMPANY', width: 20 },
         { header: 'מזהה עובד', key: 'WORKER_ID', width: 20 },
         { header: 'ישוב', key: 'CITY', width: 20 },
         { header: 'רחוב', key: 'STREET', width: 20 },
         { header: "סניף", key: 'SITE_NAME', width: 20 },
         { header: "מקום עבודה-ישוב", key: 'WORK_CITY', width: 20 },
         { header: "מקום עבודה-רחוב", key: 'WORK_STREET', width: 20 },
         { header: "מקום עבודה-מספר בנין", key: 'WORK_BUILDING', width: 12 },
         { header: 'שעת הגעה למקום העבודה', key: 'EXIT_HOUR_TO_WORK', width: 15 },
         { header: 'שעת היציאה ממקום העבודה', key: 'RETURN_HOUR_TO_HOME', width: 15 },
         { header: 'ציון מחושב\nמיקרומוביליטי', key: 'FINAL_BICYCLE_GRADE', width: 15 },
         { header: 'ציון מחושב\nשאטלים מטעם העבודה', key: 'FINAL_WORK_SHUTTLE_GRADE', width: 15 },
         { header: 'ציון מחושב\nשאטל במתחם העבודה', key: 'FINAL_COMPOUND_SHUTTLE_GRADE', width: 15 },
         { header: 'ציון מחושב\nCarpool/Vanpool', key: 'FINAL_CARPOOL_GRADE', width: 15 },
         { header: 'ציון מחושב\nתחבורה ציבורית', key: 'FINAL_PUBLIC_TRANSPORT_GRADE', width: 15 },
         { header: 'ציון מחושב\nהגעה רגלית', key: 'FINAL_WALKING_GRADE', width: 15 },
         { header: 'ציון מחושב\nעבודה מרחוק', key: 'FINAL_WORKING_FROM_HOME_GRADE', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nרכב פרטי', key: 'BEST_ROUTE_TO_WORK_DRIVING_DURATION', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nהליכה', key: 'BEST_ROUTE_TO_WORK_WALKING_DURATION', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nתחבורה ציבורית', key: 'BEST_ROUTE_TO_WORK_TRANSIT_DURATION', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nאופניים', key: 'BEST_ROUTE_TO_WORK_BICYCLING_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nרכב פרטי', key: 'BEST_ROUTE_TO_HOME_DRIVING_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nהליכה', key: 'BEST_ROUTE_TO_HOME_WALKING_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nתחבורה ציבורית', key: 'BEST_ROUTE_TO_HOME_TRANSIT_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nאופניים', key: 'BEST_ROUTE_TO_HOME_BICYCLING_DURATION', width: 15 },
         { header: 'מרחק במטרים לעבודה\nרכב פרטי', key: 'BEST_ROUTE_TO_WORK_DRIVING_DISTANCE', width: 15 },
         { header: 'מרחק במטרים לעבודה\nהליכה', key: 'BEST_ROUTE_TO_WORK_WALKING_DISTANCE', width: 15 },
         { header: 'מרחק במטרים לעבודה\nתחבורה ציבורית', key: 'BEST_ROUTE_TO_WORK_TRANSIT_DISTANCE', width: 15 },
         { header: 'מרחק במטרים לעבודה\nאופניים', key: 'BEST_ROUTE_TO_WORK_BICYCLING_DISTANCE', width: 15 },
         { header: 'מרחק במטרים הביתה\nרכב פרטי', key: 'BEST_ROUTE_TO_HOME_DRIVING_DISTANCE', width: 15 },
         { header: 'מרחק במטרים הביתה\nהליכה', key: 'BEST_ROUTE_TO_HOME_WALKING_DISTANCE', width: 15 },
         { header: 'מרחק במטרים הביתה\nתחבורה ציבורית', key: 'BEST_ROUTE_TO_HOME_TRANSIT_DISTANCE', width: 15 },
         { header: 'מרחק במטרים הביתה\nאופניים', key: 'BEST_ROUTE_TO_HOME_BICYCLING_DISTANCE', width: 15 },
      ];

      // make header bold
      ws.getRow(1).font = { bold: true }

      // add data
      ws.addRows(csvData);

      ws.eachRow((row, rowNumber) => {
         if (rowNumber === 1) {
            row.height = 30;
            return;
         }
         row.height = 30;
      });
      const buffer = await wb.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: this.fileType });
      FileSaver.saveAs(data, fileName + this.fileExtension);
   }

   /**
    * Export timePotential report to excel file
    * @param {*} csvData 
    */
   timePotential = async (csvData) => {
      const fileName = "דוח פוטנציאל צמצום זמני נסיעה";
      let wb = new ExcelJS.Workbook();
      let ws = wb.addWorksheet('נתוני עובדים');
      const TO_WORK = ["D", "E", "F"];
      const TO_HOME = ["H", "I", "J"];

      // set columns 
      ws.columns = [
         { header: 'שם חברה', key: 'COMPANY', width: 20 },
         { header: 'מזהה עובד', key: 'WORKER_ID', width: 20 },
         { header: 'זמני הגעה למשרד בדקות\nרכב פרטי', key: 'BEST_ROUTE_TO_WORK_DRIVING_DURATION', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nתחבורה ציבורית', key: 'BEST_ROUTE_TO_WORK_TRANSIT_DURATION', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nאופניים', key: 'BEST_ROUTE_TO_WORK_BICYCLING_DURATION', width: 15 },
         { header: 'זמני הגעה למשרד בדקות\nהליכה', key: 'BEST_ROUTE_TO_WORK_WALKING_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nרכב פרטי', key: 'BEST_ROUTE_TO_HOME_DRIVING_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nתחבורה ציבורית', key: 'BEST_ROUTE_TO_HOME_TRANSIT_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nאופניים', key: 'BEST_ROUTE_TO_HOME_BICYCLING_DURATION', width: 15 },
         { header: 'זמני חזרה הביתה בדקות\nהליכה', key: 'BEST_ROUTE_TO_HOME_WALKING_DURATION', width: 15 },

      ];

      // make header bold
      ws.getRow(1).font = { bold: true }

      // add data
      ws.addRows(csvData);

      ws.eachRow((row, rowNumber) => {
         if (rowNumber === 1) {
            row.height = 30;
            return;
         }
         row.height = 30;
         //apply conditional formatting
         for (let column of TO_WORK) {
            ws.addConditionalFormatting({
               ref: `${column}${rowNumber}`,
               rules: [
                  {
                     type: 'expression',
                     formulae: [`IF(ISNUMBER(C${rowNumber}), IF(${column}${rowNumber}<=C${rowNumber}, 1, 0), 0)`],
                     style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '99EDC3' } } },
                  }
               ]
            })
         }
         //apply conditional formatting
         for (let column of TO_HOME) {
            ws.addConditionalFormatting({
               ref: `${column}${rowNumber}`,
               rules: [
                  {
                     type: 'expression',
                     formulae: [`IF(ISNUMBER(G${rowNumber}), IF(${column}${rowNumber}<=G${rowNumber}, 1, 0), 0)`],
                     style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: '99EDC3' } } },
                  }
               ]
            })
         }
      });
      const buffer = await wb.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: this.fileType });
      FileSaver.saveAs(data, fileName + this.fileExtension);
   }

   /**
    * Export top 5 solution report to excel file
    * @param {*} csvData 
    */
   topSolutions = async (csvData) => {
      const fileName = "דוח דירוג פתרונות ניידות";
      let wb = new ExcelJS.Workbook();
      let ws = wb.addWorksheet('דירוג פתרונות לעובד');

      // set columns 
      ws.columns = [
         { header: 'שם חברה', key: 'COMPANY', width: 20 },
         { header: 'מזהה עובד', key: 'WORKER_ID', width: 20 },
         { header: 'דרוג 1', key: 'TOP_SOLUTION_1', width: 20 },
         { header: 'דרוג 2', key: 'TOP_SOLUTION_2', width: 20 },
         { header: 'דרוג 3', key: 'TOP_SOLUTION_3', width: 20 },
         { header: 'דרוג 4', key: 'TOP_SOLUTION_4', width: 20 },
         { header: 'דרוג 5', key: 'TOP_SOLUTION_5', width: 20 },
       ];

      // make header bold
      ws.getRow(1).font = { bold: true }
      
      // add data
      ws.addRows(csvData);

      ws.eachRow((row, rowNumber) => {
         if (rowNumber === 1) {
            row.height = 30;
            return;
         }
         row.height = 30;
      });


      let ws1 = wb.addWorksheet('ספירת פתרונות');

      // set columns 
      ws1.columns = [
         { header: 'שם פתרון', key: 'SOLUTION_NAME', width: 20 },
         { header: 'דרוג 1', key: 'TOP_SOLUTION_1', width: 20 },
         { header: 'דרוג 2', key: 'TOP_SOLUTION_2', width: 20 },
         { header: 'דרוג 3', key: 'TOP_SOLUTION_3', width: 20 },
         { header: 'דרוג 4', key: 'TOP_SOLUTION_4', width: 20 },
         { header: 'דרוג 5', key: 'TOP_SOLUTION_5', width: 20 },
       ];
      
       // make header bold
      ws1.getRow(1).font = { bold: true }

       const results = countTopSolutions( csvData );
       const countData = Object.entries(labels).map( ([solution, location]) => { 
          const row = { 'SOLUTION_NAME': solution };
          let pos = 0;
          results.forEach( rank => {
            pos = pos+1;
            row[`TOP_SOLUTION_${pos}`] = rank.data[location];
          });
          return row;
       });
         // add data
      ws1.addRows(countData);


      const buffer = await wb.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: this.fileType });
      FileSaver.saveAs(data, fileName + this.fileExtension);
   }

   /**
    * Export cluster data report to excel file
    * @param {*} csvData 
    */
   clusterReport = async (csvData) => {
      const fileName = "דוח צימודים";
      let wb = new ExcelJS.Workbook();
      let ws = wb.addWorksheet('רשימת עובדים');

      // set columns 
      ws.columns = [
         { header: 'שם חברה', key: 'COMPANY', width: 20 },
         { header: 'מזהה עובד', key: 'WORKER_ID', width: 20 },
         { header: 'קבוצה', key: 'cluster', width: 20 },
         { header: 'ציון מחושב\nשאטלים מטעם העבודה', key: 'FINAL_WORK_SHUTTLE_GRADE', width: 15 },
         { header: 'ציון מחושב\nשאטל במתחם העבודה', key: 'FINAL_COMPOUND_SHUTTLE_GRADE', width: 15 },
         { header: 'ציון מחושב\nCarpool/Vanpool', key: 'FINAL_CARPOOL_GRADE', width: 15 },
         { header: 'ישוב', key: 'CITY', width: 20 },
         { header: 'רחוב', key: 'STREET', width: 20 },
         { header: "סניף", key: 'SITE_NAME', width: 20 },
         { header: "מקום עבודה-ישוב", key: 'WORK_CITY', width: 20 },
         { header: "מקום עבודה-רחוב", key: 'WORK_STREET', width: 20 },
         { header: "מקום עבודה-מספר בנין", key: 'WORK_BUILDING', width: 12 },
         { header: 'שעת הגעה למקום העבודה', key: 'EXIT_HOUR_TO_WORK', width: 15 },
         { header: 'שעת היציאה ממקום העבודה', key: 'RETURN_HOUR_TO_HOME', width: 15 }
      ];

      // make header bold
      ws.getRow(1).font = { bold: true }

      // add data
      ws.addRows(csvData);

      ws.eachRow((row, rowNumber) => {
         if (rowNumber === 1) {
            row.height = 30;
            return;
         }
         row.height = 30;
      });
      const buffer = await wb.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: this.fileType });
      FileSaver.saveAs(data, fileName + this.fileExtension);
   }

   exportToCSV = (data, reportType) => {
      switch (reportType) {
         case reportTypes.GENERAL_REPORT:
            this.generalReport(data);
            break;
         case reportTypes.TIME_POTENTIAL:
            this.timePotential(data);
            break;
         case reportTypes.TOP_FIVE_SOLUTIONS:
            this.topSolutions(data);
            break;
         case reportTypes.COUPLING_REPORT:
            this.clusterReport(data);
            break;
         default:
            this.generalReport(data);
            break;
      }
      return data;
   }

   render() {
      let jsx = {};
      let isEnabled = false;
      if (this.props.data.length > 0) {
         isEnabled = true;
      }

      jsx = <IconButton color="primary" aria-label="upload picture" component="span"
         disabled={!isEnabled}
         onClick={(e) => { this.exportToCSV(this.props.data, this.props.reportType) }}>
         <SaveRoundedIcon />
      </IconButton>;

      return jsx;
   }
}

function mapStateToProps(state) {
   let data = [];
   let reportType = state.reportTypeSelection.reportType;

   if (state.reportTypeSelection.data) {
      data = state.reportTypeSelection.data
   }
   return { data: data, reportType: reportType };
};

export default connect(mapStateToProps, actions)(DownloadButton);