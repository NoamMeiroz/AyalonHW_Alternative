import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FileSaver from 'file-saver';
import ExcelJS from 'exceljs';
import axios from 'axios';

import * as actions from '../../actions';
import * as actionsUtil from '../../utils/actionsUtil';
import { timeConvert } from '../../utils/time';

import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid'

const API_SERVER = process.env.REACT_APP_API_SERVER || `/api`;

class DownloadButton extends Component {

   constructor() {
      super();
      this.fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      this.fileExtension = '.xlsx';
      this.state = { uploadProgess: 0, isWorkerStarted: false, isEmployeesReady: null };

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
      /*let bestRoute = route[0];
      for (let i = 1; i < route.length; i++) {
         if (route[i].legs[0].duration.value < bestRoute.legs[0].duration.value)
            bestRoute = route[i];
      }
      return bestRoute;*/
      return route;
   }

   /**
    * convert google transit route recommendation to meaningful string
    * @param {json} transitDescription 
    */
   getTransitDescription = (transitDescription) => {
      if (transitDescription.error)
         return { description: transitDescription.error };
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
      let result = { description: description, duration: bestRoute.legs[0].duration.value, distance: bestRoute.legs[0].distance.value };
      return result;
   }

   /**
    * convert google bicycle route recommendation to meaningful string
    * @param {json} bicycleDescription 
    */
   getBicycleDescription = (bicycleDescription) => {
      if (bicycleDescription.error)
         return { description: bicycleDescription.error };
      let bestRoute = this.findFastestRoute(bicycleDescription);
      const steps = bestRoute.legs[0].steps;
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

      // add total length and length
      description = `סה"כ ${bestRoute.legs[0].duration.text} למרחק של ${bestRoute.legs[0].distance.text}\n`;
      description = this.translate(description);
      let result = { description: description, duration: bestRoute.legs[0].duration.value, distance: bestRoute.legs[0].distance.value };
      return result;
   }

   /**
    * convert google walking route recommendation to meaningful string
    * @param {json} walkingDescription 
    */
   getWalkingDescription = (walkingDescription) => {
      if (walkingDescription.error)
         return { description: walkingDescription.error };
      const steps = walkingDescription.legs[0].steps;
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

      // add total length and length
      description = `סה"כ ${walkingDescription.legs[0].duration.text} למרחק של ${walkingDescription.legs[0].distance.text}\n`;
      description = this.translate(description);
      let result = { description: description, duration: walkingDescription.legs[0].duration.value, distance: walkingDescription.legs[0].distance.value };
      return result;
   }


   /**
 * convert google driving route recommendation to meaningful string
 * @param {json} bicycleDescription 
 */
   getDrivingDescription = (drivingDescription) => {
      if (drivingDescription.error)
         return { description: drivingDescription.error };
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

      // no driving ride is suggested
      if (driving.length === 0)
         return "";

      // add total length and length
      description = `סה"כ ${bestRoute.legs[0].duration.text} למרחק של ${bestRoute.legs[0].distance.text}\n`;
      description = this.translate(description);
      let result = { description: description, duration: bestRoute.legs[0].duration.value, distance: bestRoute.legs[0].distance.value };
      return result;
   }

   saveEmployeesList = (employerId, fileName) => {
      axios.get(`${API_SERVER}/employer/${employerId}/employee`, {
         headers:
            { 'authorization': localStorage.getItem('token') }
      })
         .then(payload => {
            let employeeList = payload.data;
            if (employeeList && !(typeof employeeList === "string")) {
               employeeList.forEach((emp) => {
                  try{
                  emp.ERROR = "";
                  let temp = {};
                  if (!emp.UPLOAD_ERROR) {
                     temp = this.getTransitDescription(emp.BEST_ROUTE_TO_WORK.transit);
                     emp.transit = temp.description;
                     emp.transit_duration = temp.duration;
                     emp.transit_distance = temp.distance;
                     temp = this.getBicycleDescription(emp.BEST_ROUTE_TO_WORK.bicycling);
                     emp.bicycling = temp.description;;
                     emp.bicycling_duration = temp.duration;
                     emp.bicycling_distance = temp.distance;
                     temp = this.getWalkingDescription(emp.BEST_ROUTE_TO_WORK.walking);
                     emp.walking = temp.description;
                     emp.walking_duration = temp.duration;
                     emp.walking_distance = temp.distance;
                     temp = this.getDrivingDescription(emp.BEST_ROUTE_TO_WORK.driving);
                     emp.driving = temp.description;
                     emp.driving_duration = temp.duration;
                     emp.driving_distance = temp.distance;
                     temp = this.getTransitDescription(emp.BEST_ROUTE_TO_HOME.transit);
                     emp.transit_home = temp.description;
                     emp.transit_home_duration = temp.duration;
                     emp.transit_home_distance = temp.distance;
                     temp = this.getBicycleDescription(emp.BEST_ROUTE_TO_HOME.bicycling);
                     emp.bicycling_home = temp.description;;
                     emp.bicycling_home_duration = temp.duration;
                     emp.bicycling_home_distance = temp.distance;
                     temp = this.getWalkingDescription(emp.BEST_ROUTE_TO_HOME.walking);
                     emp.walking_home = temp.description;
                     emp.walking_home_duration = temp.duration;
                     emp.walking_home_distance = temp.distance;
                     temp = this.getDrivingDescription(emp.BEST_ROUTE_TO_HOME.driving);
                     emp.driving_home = temp.description;
                     emp.driving_home_duration = temp.duration;
                     emp.driving_home_distance = temp.distance;
                  }
                  else {
                     emp.ERROR = emp.UPLOAD_ERROR.error;
                  }
                  try {
                     if (emp.transit !== undefined && emp.transit.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול תחבורה ציבורית נכשל.";
                     if (emp.bicycling !== undefined && emp.bicycling.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול רכיבה נכשל.";
                     if (emp.walking !== undefined && emp.walking.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול הליכה נכשל.";
                     if (emp.driving !== undefined && emp.driving.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול נהיגה עצמית נכשל.";
                     if (emp.transit_home !== undefined && emp.transit_home.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול תחבורה ציבורית נכשל.";
                     if (emp.bicycling_home !== undefined && emp.bicycling_home.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול רכיבה נכשל.";
                     if (emp.walking_home !== undefined && emp.walking_home.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול הליכה נכשל.";
                     if (emp.driving_home !== undefined && emp.driving_home.includes("שגיאה"))
                        emp.ERROR = emp.ERROR + "\nחישוב מסלול נהיגה עצמית נכשל.";
                  }
                  catch (error) {
                     console.log(error);
                     console.log(emp);
                  }
                  delete emp.BEST_ROUTE_TO_WORK;
                  delete emp.BEST_ROUTE_TO_HOME;
                  delete emp.UPLOAD_ERROR;
               }
               catch(err) {
                  console.log(err);
                  console.log(emp);
               }
               });
               this.exportToCSV(employeeList, fileName);
            }
         }).catch(err => {
            let message = actionsUtil.handleError(err);
            this.props.showMessage(message);
         });
   }

   exportToCSV = async (csvData, fileName) => {
      let wb = new ExcelJS.Workbook();
      let ws = wb.addWorksheet('המלצות לעובדים');

      // set columns 
      ws.columns = [
         { header: 'שגיאות ברשומה', key: 'ERROR', width: 50 },
         { header: 'מזהה עובד', key: 'WORKER_ID', width: 20 },
         { header: 'עיר', key: 'CITY', width: 20 },
         { header: 'רחוב', key: 'STREET', width: 20 },
         { header: 'מספר בניין', key: 'BUILDING_NUMBER', width: 12 },
         { header: 'כתובת מקום העבודה', key: 'WORK_SITE', width: 50 },
         { header: 'שעת הגעה למקום העבודה', key: 'EXIT_HOUR_TO_WORK', width: 15 },
         { header: 'שעת היציאה ממקום העבודה', key: 'RETURN_HOUR_TO_HOME', width: 15 },
         { header: 'פתרון מומלץ 1', key: 'TOP_SOLUTION_1', width: 15},
         { header: 'פתרון מומלץ 2', key: 'TOP_SOLUTION_2', width: 15},
         { header: 'פתרון מומלץ 3', key: 'TOP_SOLUTION_3', width: 15},
         { header: 'פתרון מומלץ 4', key: 'TOP_SOLUTION_4', width: 15},
         { header: 'פתרון מומלץ 5', key: 'TOP_SOLUTION_5', width: 15},         
         { header: 'מיקרומוביליטי\nציון', key: 'FINAL_BICYCLE_GRADE', width: 15 },
         { header: 'מיקרומוביליטי\nסיבת פסילה', key: 'BICYCLE_DISQUALIFY_REASON', width: 25},
         { header: 'שאטלים מטעם העבודה\nציון', key: 'FINAL_WORK_SHUTTLE_GRADE', width: 15 },
         { header: 'שאטלים מטעם העבודה\nסיבת פסילה', key: 'WORK_SHUTTLE_DISQUALIFY_REASON', width: 25},
         { header: 'שאטל פנים מתחמי\nציון', key: 'FINAL_COMPOUND_SHUTTLE_GRADE', width: 15 },
         { header: 'שאטל פנים מתחמי\nסיבת פסילה', key: 'COMPOUND_SHUTTLE_DISQUALIFY_REASON', width: 15 },
         { header: 'Carpool/Vanpool\nציון', key: 'FINAL_CARPOOL_GRADE', width: 15 },
         { header: 'Carpool/Vanpool\nסיבת פסילה', key: 'CARPOOL_DISQUALIFY_REASON', width: 15 },
         { header: 'תחבורה ציבורית\nציון', key: 'FINAL_PUBLIC_TRANSPORT_GRADE', width: 15 },
         { header: 'תחבורה ציבורית\nסיבת פסילה', key: 'PUBLIC_TRANSPORT_DISQUALIFY_REASON', width: 15 },

         { header: 'הגעה רגלית\nציון', key: 'FINAL_WALKING_GRADE', width: 15 },
         { header: 'הגעה רגלית\nסיבת פסילה', key: 'WALKING_DISQUALIFY_REASON', width: 15 },

         { header: 'עבודה מרחוק\nציון', key: 'FINAL_WORKING_FROM_HOME_GRADE', width: 15 },
         { header: 'עבודה מרחוק\nסיבת פסילה', key: 'WORKING_FROM_HOME_DISQUALIFY_REASON', width: 15 },

         { header: 'תחבורה ציבורית למקום העבודה\nמסלול', key: 'transit', width: 50 },
         { header: 'תחבורה ציבורית למקום העבודה\nמשך בשניות', key: 'transit_duration', width: 15 },
         { header: 'תחבורה ציבורית למקום העבודה\nמרחק במטרים', key: 'transit_distance', width: 15 },
         { header: 'אופניים למקום העבודה\nמסלול', key: 'bicycling', width: 50 },
         { header: 'אופניים למקום העבודה\nמשך בשניות', key: 'bicycling_duration', width: 15 },
         { header: 'אופניים למקום העבודה\nמרחק במטרים', key: 'bicycling_distance', width: 15 },
         { header: 'הליכה למקום העבודה\nמסלול', key: 'walking', width: 50 },
         { header: 'הליכה למקום העבודה\nמשך בשניות', key: 'walking_duration', width: 15 },
         { header: 'הליכה למקום העבודה\nמרחק במטרים', key: 'walking_distance', width: 15 },
         { header: 'נהיגה למקום העבודה\nמסלול', key: 'driving', width: 50 },
         { header: 'נהיגה למקום העבודה\nמשך בשניות', key: 'driving_duration', width: 15 },
         { header: 'נהיגה למקום העבודה\nמרחק במטרים', key: 'driving_distance', width: 15 },
         { header: 'תחבורה ציבורית חזרה הביתה\nמסלול', key: 'transit_home', width: 50 },
         { header: 'תחבורה ציבורית חזרה הביתה\nמשך בשניות', key: 'transit_home_duration', width: 15 },
         { header: 'תחבורה ציבורית חזרה הביתה\nמרחק במטרים', key: 'transit_home_distance', width: 15 },
         { header: 'אופניים חזרה הביתה\nמסלול', key: 'bicycling_home', width: 50 },
         { header: 'אופניים חזרה הביתה\nמשך בשניות', key: 'bicycling_home_duration', width: 15 },
         { header: 'אופניים חזרה הביתה\nמרחק במטרים', key: 'bicycling_home_distance', width: 15 },
         { header: 'הליכה חזרה הביתה\nמסלול', key: 'walking_home', width: 50 },
         { header: 'הליכה חזרה הביתה\nמשך בשניות', key: 'walking_home_duration', width: 15 },
         { header: 'הליכה חזרה הביתה\nמרחק במטרים', key: 'walking_home_distance', width: 15 },
         { header: 'נהיגה חזרה הביתה\nמסלול', key: 'driving_home', width: 50 },
         { header: 'נהיגה חזרה הביתה\nמשך בשניות', key: 'driving_home_duration', width: 15 },
         { header: 'נהיגה חזרה הביתה\nמרחק במטרים', key: 'driving_home_distance', width: 15 }
      ];

      ws.getColumn('ERROR').alignment = { vertical: 'top', horizontal: 'right', wrapText: true, readingOrder: 'rtl' };
      // make header bold
      ws.getRow(1).font = { bold: true }

      // add data
      ws.addRows(csvData);

      ws.eachRow((row, rowNumber) => {
         if (rowNumber === 1) {
            row.height = 30;
            return;
         }
         //apply conditional formatting
         ws.addConditionalFormatting({
            ref: `A${rowNumber}:B${rowNumber}`,
            rules: [
               {
                  type: 'expression',
                  formulae: [`IF($A$${rowNumber}<>"", 1, 0)`],
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
      if (this.props.employeesReady === 1)
         jsx = <div>
            <Tooltip title="דוח טעינה">
               <IconButton color="primary" aria-label="upload picture" component="span" style={{ padding: '2px' }}
                  onClick={(e) => { this.saveEmployeesList(this.props.csvData.id, this.props.fileName) }}>
                  <SaveRoundedIcon />
               </IconButton>
            </Tooltip>
         </div>;
      else if (this.props.employeesReady === 0) {
         jsx =  <Grid container>
         <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary">טעינת עובדים</Typography>
            </Grid>
			<Grid item xs={12}>
            <Box sx={{position:"relative", display:"inline-flex"}}>
               <CircularProgress variant="determinate" value={this.props.uploadPrecent} />
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
                  <Typography variant="caption" component="div" color="textSecondary">{`${this.props.uploadPrecent}%`}</Typography>
               </Box>
            </Box>
			</Grid>
         </Grid>
      }
      else
         jsx = null;
      return jsx;
   }
}


export default connect(null, actions)(DownloadButton);