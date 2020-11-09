import React, { Component } from 'react';
import "./MapSideBar.css";
import HeatmapQueryPanel from './HeatmapQueryPanel';
import Typography from '@material-ui/core/Typography'

class MapSidebar extends Component {


    render() {
        var jsx = <div className="sidebar">
            <Typography variant="h6" component="h2">מפת חום</Typography>
            <HeatmapQueryPanel/>
        </div>
        return jsx;
    }
}

export default MapSidebar;