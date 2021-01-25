import React, { PureComponent } from 'react';
import "./MapSideBar.css";
import HeatmapQueryPanel from './HeatmapQueryPanel';

class MapSidebar extends PureComponent {


    render() {
        var jsx = <div className="sidebar">
            <HeatmapQueryPanel/>
        </div>
        return jsx;
    }
}

export default MapSidebar;