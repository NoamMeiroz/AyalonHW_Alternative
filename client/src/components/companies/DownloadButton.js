import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import axios from 'axios';

import * as actions from '../../actions';
import { timeConvert } from '../../utils/time';

import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';

import { SERVER } from '../../utils/config';


class DownloadButton extends Component {

   constructor() {
      super();
      this.fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      this.fileExtension = '.xlsx';
      this.state = { uploadProgess: 0, isWorkerStarted: false };

   }

   /**
    * translate english words in string to hebrew and return the new string
    * @param {string} str 
    */
   translate = (str) => {
      return str.replace(/km/g, 'ק"מ')
         .replace(/mins/g, 'דקות')
         .replace(/Bus/g, "אוטובוס")
         .replace(/hours/g, "שעות")
         .replace(/hour/g, "שעה")
         .replace(/train/g, "רכבת");
   }

   /**
    * return the fastest routes
    * @param {array of routes} route 
    */
   findFastestRoute = (route) => {
      let bestRoute = route[0];
      for(let i=1; i<route.length; i++) {
         if ( route[i].legs[0].duration.value < bestRoute.legs[0].duration.value )
            bestRoute = route[i];
      }
      return bestRoute;
   }

   /**
    * convert google transit route recommendation to meaningful string
    * @param {json} transitDescription 
    */
   getTransitDescription = (transitDescription) => {
      if (transitDescription.error)
         return transitDescription.error;
      let bestRoute = this.findFastestRoute(transitDescription);
      const steps = bestRoute.legs[0].steps;
      let walkingDuration = 0;
      let transit = [];
      let description = "";
      steps.forEach((step, index, array) => {
         switch (step.travel_mode) {
            case 'WALKING':
               walkingDuration = walkingDuration + parseInt(step.duration.value);
               break;
            case 'TRANSIT':
               let details = step.transit_details.line;
               let currentTranit = {
                  duration: parseInt(step.duration.value),
                  line: `${details.vehicle.name} ${details.agencies[0].name} קו ${details.short_name}, תחנה ${step.transit_details.departure_stop.name}`
               };
               transit.push(currentTranit);
               break;
            default:
               break;
         }
      });

      if (transit.length === 0)
         return "";
      // add all public transportation
      transit.forEach((currentTranit, index, array) => {
         description = description + " " + currentTranit.line + " במשך כ- " +
            timeConvert(currentTranit.duration, "שניות", true) + ".\n";
      });
      // add walking duration
      if (walkingDuration > 0) {
         walkingDuration = timeConvert(walkingDuration, "שניות", true);
         description = description + `\nמרחק הליכה כולל הינו כ- ${walkingDuration}.`;
      }
      // add total length and length
      description = description + `\nסה"כ ${bestRoute.legs[0].duration.text} למרחק של ${bestRoute.legs[0].distance.text}`;
      description = this.translate(description);
      return description
   }

   /**
    * convert google bicycle route recommendation to meaningful string
    * @param {json} bicycleDescription 
    */
   getBicycleDescription = (bicycleDescription) => {
      if (bicycleDescription.error)
         return bicycleDescription.error;
      const steps = bicycleDescription[0].legs[0].steps;
      let bicycle = [];
      let description = "";
      steps.forEach((step, index, array) => {
         switch (step.travel_mode) {
            case 'BICYCLING':
               let details = step.html_instructions;
               details = details.replace(/(<([^>]+)>)/gi, "");
               bicycle.push(details);
               break;
            default:
               break;
         }
      });

      // no bicycle ride is suggested
      if (bicycle.length === 0)
         return "";

      // 90 minute ride is not recommended
      if ((bicycleDescription[0].legs[0].duration.value / 60) > 90)
         return "";

      // add total length and length
      description = `סה"כ ${bicycleDescription[0].legs[0].duration.text} למרחק של ${bicycleDescription[0].legs[0].distance.text}\n`;

      // add all streets
      /*bicycle.forEach((currentStep, index, array) => {
         description = description + currentStep + '\n';
      });*/
      description = this.translate(description);
      return description
   }

   /**
    * convert google walking route recommendation to meaningful string
    * @param {json} bicycleDescription 
    */
   getWalkingDescription = (walkingDescription) => {
      if (walkingDescription.error)
         return walkingDescription.error;
      const steps = walkingDescription[0].legs[0].steps;
      let walking = [];
      let description = "";
      steps.forEach((step, index, array) => {
         switch (step.travel_mode) {
            case 'WALKING':
               let details = step.html_instructions;
               details = details.replace(/(<([^>]+)>)/gi, "");
               walking.push(details);
               break;
            default:
               break;
         }
      });

      // no bicycle ride is suggested
      if (walking.length === 0)
         return "";

      // 60 minute walking is not recommended
      if ((walkingDescription[0].legs[0].duration.value / 60) > 60)
         return "";

      // add total length and length
      description = `סה"כ ${walkingDescription[0].legs[0].duration.text} למרחק של ${walkingDescription[0].legs[0].distance.text}\n`;

      // add all streets
      /*walking.forEach((currentStep, index, array) => {
         description = description + currentStep + '\n';
      });*/
      description = this.translate(description);
      return description
   }


      /**
    * convert google driving route recommendation to meaningful string
    * @param {json} bicycleDescription 
    */
   getDrivingDescription = (drivingDescription) => {
      if (drivingDescription.error)
         return drivingDescription.error;
      let bestRoute = this.findFastestRoute(drivingDescription);
      const steps = bestRoute.legs[0].steps;
      let driving = [];
      let description = "";
      steps.forEach((step, index, array) => {
         switch (step.travel_mode) {
            case 'DRIVING':
               let details = step.html_instructions;
               details = details.replace(/(<([^>]+)>)/gi, "");
               driving.push(details);
               break;
            default:
               break;
         }
      });

      // no bicycle ride is suggested
      if (driving.length === 0)
         return "";

      // add total length and length
      description = `סה"כ ${bestRoute.legs[0].duration.text} למרחק של ${bestRoute.legs[0].distance.text}\n`;

      // add all streets
      /*driving.forEach((currentStep, index, array) => {
         description = description + currentStep + '\n';
      });*/
      description = this.translate(description);
      return description
   }

   saveEmployeesList = (employerId, fileName) => {
      axios.get(`${SERVER}/api/employer/${employerId}/employee`, {headers:
         { 'authorization': localStorage.getItem('token') }})
         .then(payload => {
            let employeeList = payload.data;
            console.log(employeeList);
            if (employeeList && !(typeof employeeList === "string")) {
               employeeList.forEach((emp) => {
                  if (!emp.BEST_ROUTE.error) {
                     emp.transit = this.getTransitDescription(emp.BEST_ROUTE.transit);
                     emp.bicycling = this.getBicycleDescription(emp.BEST_ROUTE.bicycling);
                     emp.walking = this.getWalkingDescription(emp.BEST_ROUTE.walking);
                     emp.driving = this.getDrivingDescription(emp.BEST_ROUTE.driving);
                  }
                  else {
                     emp.ERROR = emp.BEST_ROUTE.error;
                  }
                  delete emp.BEST_ROUTE;
               });
               this.exportToCSV(employeeList, fileName);
            }
         }).catch(err => {
            console.log(err);
            let message = actions.handleError(err);
            this.props.callFail(message);
         });
   }

   exportToCSV = async (csvData, fileName) => {
      let wb = new ExcelJS.Workbook();
      let ws = wb.addWorksheet('המלצות לעובדים');

      // set columns 
      ws.columns = [{ header: 'מזהה עובד', key: 'WORKER_ID', width: 10 },
      { header: 'עיר', key: 'CITY', width: 25 },
      { header: 'רחוב', key: 'STREET', width: 25 },
      { header: 'מספר בניין', key: 'BUILDING_NUMBER', width: 12 },
      { header: 'כתובת מקום העבודה', key: 'WORK_SITE', width: 50 },
      { header: 'תחבורה ציבורית מומלצת', key: 'transit', width: 50 },
      { header: 'מסלול אופניים מומלץ', key: 'bicycling', width: 50 },
      { header: 'מסלול הליכה מומלץ', key: 'walking', width: 50 },
      { header: 'מסלול לנהיגה עצמית מומלץ', key: 'driving', width: 50 },
      { header: 'שגיאות ברשומה', key: 'ERROR', width: 50 }];

      ws.getColumn('transit').alignment = { vertical: 'top', horizontal: 'right', wrapText: true, readingOrder: 'rtl' };
      ws.getColumn('bicycling').alignment = { vertical: 'top', horizontal: 'right', wrapText: true, readingOrder: 'rtl' };
      ws.getColumn('walking').alignment = { vertical: 'top', horizontal: 'right', wrapText: true, readingOrder: 'rtl' };
      ws.getColumn('driving').alignment = { vertical: 'top', horizontal: 'right', wrapText: true, readingOrder: 'rtl' };
      ws.getColumn('ERROR').alignment = { vertical: 'top', horizontal: 'right', wrapText: true, readingOrder: 'rtl' };
      // make header bold
      ws.getRow(1).font = { bold: true }

      // add data
      ws.addRows(csvData);

      ws.eachRow((row, rowNumber) => {
         if (rowNumber === 1)
            return;
         //apply conditional formatting
         ws.addConditionalFormatting({
            ref: `A${rowNumber}:I${rowNumber}`,
            rules: [
               {
                  type: 'expression',
                  formulae: [`IF($J$${rowNumber}<>"", 1, 0)`],
                  style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFF0000' } } },
               }
            ]
         })
         row.height = 30;
      });
      const buffer = await wb.xlsx.writeBuffer();
      const data = new Blob([buffer], { type: this.fileType });
      FileSaver.saveAs(data, fileName + this.fileExtension);
   }

   render() {
      let jsx = {};
      if (this.props.csvData.EMPLOYEES_READY === 1 || this.props.uploadProgess === 100)
         jsx = <IconButton color="primary" aria-label="upload picture" component="span"
            onClick={(e) => { this.saveEmployeesList(this.props.csvData.id, this.props.fileName) }}>
            <SaveRoundedIcon />
            {this.state.count}
         </IconButton>;
      else if (this.props.csvData.EMPLOYEES_READY === 0) {
         jsx = <div>
            <Typography variant="caption" color="textSecondary">טעינת עובדים</Typography>
            <Box position="relative" display="inline-flex">
               <CircularProgress variant="static" value={this.props.uploadProgess} />
               <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
               >
                  <Typography variant="caption" component="div" color="textSecondary">{`${this.props.uploadProgess}%`}</Typography>
               </Box>
            </Box>
         </div>
      }
      // error in loading employees 
      else  {
         jsx = <Typography variant="caption" color="textSecondary">טעינת עובדים נכשלה</Typography>

      }
      return jsx;
   }
}

const mapStateToProps = (state, ownProps) => {
   if (state.employeesData.employerID === ownProps.csvData.id)
      return { uploadProgess: state.employeesData.uploadProgess };
   else
      return { uploadProgess: 0 };
};

export default connect(mapStateToProps, actions)(DownloadButton);