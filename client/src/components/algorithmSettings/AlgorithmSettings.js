import React from "react";
import requireAuth from "../requireAuth"; //used to check if login successfull

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import SolutionMark from './SolutionMarks';
import SolutionPropertiesValues from './SolutionPropertiesValues';
import SolutionLimits from './SolutionLimits';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="מפתח ציונים לפתרונות" {...a11yProps(0)} />
          <Tab label="הגבלות לפתרונות" {...a11yProps(1)} />
          <Tab label="בסיס לנתוני הפתרונות" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SolutionMark />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SolutionLimits />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SolutionPropertiesValues />
      </TabPanel>
    </Box>
  );
}

/**
 * show origin and destination query filter control
 */
function AlgorithmSettings(props) {

  return (
    <BasicTabs />
  );
}

export default requireAuth(AlgorithmSettings);
