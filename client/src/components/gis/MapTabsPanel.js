import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MapPanel from './MapPanel';
import ResultTable from './ResultTable';
import DownloadButton from './DownloadButton';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
       // backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    tabPanel: {
        paddingLeft: '24px' 
    }
}));

function TabPanel(props) {
    const classes = useStyles();
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
                <Box className={classes.tabPanel} p={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MapTabsPanel() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Paper square className={classes.tabs}>
                <Tabs value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="ניתוח נתונים מבוסס גיאוגרפיה">
                    <Tab label="שאילתא גיאוגרפית" {...a11yProps(0)} />
                    <Tab label="טבלת תוצאות" {...a11yProps(1)} />
                </Tabs>
                <DownloadButton />

            </Paper>
            <TabPanel value={value} index={0}>
                <MapPanel />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div><ResultTable /></div>
            </TabPanel>
        </div>
    );
}