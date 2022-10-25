import React from "react";
import { useMemo } from "react";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import requireAuth from '../requireAuth'; //used to check if login successfull

import './legend.css';

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }

function Legend({ position, data, companies }) {

  // Memoize the minimap so it's not affected by position changes
  const legendControl = useMemo(
    () => {

      function getItemList() {
        let companyList = {};
      
        for (let company in companies) {
          companyList[company] = {
            color: companies[company].color,
            count: 0,
          };
        }
        for (let employee of data) {
          companyList[employee.EMPLOYER_ID].count =
            companyList[employee.EMPLOYER_ID].count + 1;
          companyList[employee.EMPLOYER_ID].name = employee.COMPANY;
        }
      
        return Object.values(companyList).map((values) => {
          let jsx = (
            <ListItem key={values.name} style={{ paddingRight: "1px" }}>
              <ListItemIcon style={{ minWidth: 20 }}>
                <CheckBoxOutlineBlankIcon
                  fontSize="small"
                  style={{
                    backgroundColor: `${values.color}`,
                    fill: `${values.color}`,
                    fontSize: "0.8rem",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                disableTypography={true}
                primary={`${values.name}, ${values.count} עובדים`}
                style={{ margin: 0 }}
              ></ListItemText>
            </ListItem>
          );
          return jsx;
        });
      }


      return <div>
        <Box
          style={{
            opacity: 0.8,
            backgroundColor: "white",
            direction: "ltr",
            height: "10vh",
            overflowX: "none",
            overflowY: "auto",
            whiteSpace: "nowrap",
            border: "2px solid rgba(0,0,0,0.2)",
            paddingLeft: "0px",
          }}
        >
          <List dense style={{ padding: 0, direction: "rtl" }}>
            {getItemList()}
          </List>
        </Box>
      </div>
    },
    [data, companies]
  );

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{legendControl}</div>
    </div>
  );
}

export default requireAuth(Legend);
