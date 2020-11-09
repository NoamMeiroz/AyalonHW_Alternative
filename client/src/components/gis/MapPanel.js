import React, { createRef, Component } from 'react';
import { Map, TileLayer, LayersControl } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import Control from 'react-leaflet-control';
import Box from '@material-ui/core/Box';
import randomColor from 'randomcolor';
import { connect } from 'react-redux';

import requireAuth from '../requireAuth'; //used to check if login successfull
//import proj4 from 'proj4';
import MapSidebar from './MapSidebar';
import MarkerLayer from './MarkerLayer';
import Legend from './Legend';
import {template} from '../../utils/string';
import ShapeLayer from "./ShapeLayer";
import zipUrl from "./TAZ.zip";

import './MapPanel.css';

//const israelProjection = "+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs";

/*const convertCoordinate = (location) => {
    const y = parseFloat(location["Y"]);
    const x = parseFloat(location["X"]);
    const converted_xy = proj4(israelProjection).inverse([x, y]);
    const result = { X: converted_xy[0], Y: converted_xy[1] };
    return result;
}*/

const createColorIndex = (employees) => {
    let colors = {};
    for (let employee of employees) {
        if (!colors[employee.EMPLOYER_ID])
            colors[employee.EMPLOYER_ID] = 0;
    }
    let count = Object.keys(colors).length;
    let colorList = randomColor({luminosity: 'dark', count: count});
    for (const key in colors) {
        count = count - 1;
        colors[key] = colorList[count];
    }
    return colors;
}


class MapPanel extends Component {
    state = {
        position: [32.087934, 34.774547],
        zoom: 7,
        bounds: [
            [31.4101697, 34.2486116],
            [33.5074706, 36.2478762]]
    };

    mapRef = createRef();


    handleZoom = (e) => {
        this.setState({ zoom: this.mapRef.current.viewport.zoom });
    };


    render() {
        return <Box display="flex">
            <MapSidebar>
            </MapSidebar>
            <Map center={this.state.position}
                zoom={this.state.zoom}
                // maxBounds={this.state.bounds}
                onzoomend={this.handleZoom}
                //crs={this.state.crs}
                ref={this.mapRef}>
                <LayersControl>
                    <LayersControl.BaseLayer name="מפה" checked>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.Overlay name="מפת חום" checked>
                        <HeatmapLayer
                            points={this.props.data}
                            longitudeExtractor={item => item.lng}
                            latitudeExtractor={item => item.lat}
                            intensityExtractor={item => item.intensity}
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="עובדים">
                        <MarkerLayer
                            data={this.props.data}
                            icon={"Worker"}
                            colors={this.props.colors}
                            colorIndex="EMPLOYER_ID"
                            popupFields={["COMPANY"]}
                            popupString={template([""], "COMPANY")}
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="סניפים">
                        <MarkerLayer
                            data={this.props.branches}
                            icon={"building"}
                            colors={this.props.colors}
                            colorIndex={"EMPLOYER_ID"}
                            popupFields={["COMPANY", "SITE_NAME", "count"]}
                            popupString={template(["", "/", ", ", " אנשים"], "COMPANY", "SITE_NAME", "count")}
                        />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="איזורי תנועה">
                        <ShapeLayer zipUrl={zipUrl} />
                    </LayersControl.Overlay>
                </LayersControl>
                <Control position="bottomright">
                              <Legend data={this.props.data}
                              colors={this.props.colors}></Legend>
                </Control>
            </Map>
        </Box>
    }
}


function mapStateToProps(state) {
    let data = [];
    let branches = [];
    if (state.reports.employeesList) {
        data = state.reports.employeesList.filter(employee=> {
            return parseFloat(employee.X);
        });
        // employees data
        data = data.map(employee => {
            // handle employee
            let coor = { "X": employee.X, "Y": employee.Y };//convertCoordinate({ "X": employee.X, "Y": employee.Y });
            employee.lat = coor.X;
            employee.lng = coor.Y;
            employee.intensity = 100;

            // find the employee's working place and add it the branch list
            // If already in branch list then add employee to the counter of employees.
            let currentSite = branches.find((item)=> {
                return (item.SITE_NAME===employee.SITE_NAME && item.EMPLOYER_ID === employee.EMPLOYER_ID)
            });
            // exists
            if (currentSite)
                currentSite.count = currentSite.count + 1;
            else {
                let site = {};
                let coor = { "X": employee.WORK_X, "Y": employee.WORK_Y };//convertCoordinate({ "X": employee.WORK_X, "Y": employee.WORK_Y });
                site.lat = coor.X;
                site.lng = coor.Y;
                site.count = 1;
                site.EMPLOYER_ID = employee.EMPLOYER_ID;
                site.COMPANY = employee.COMPANY;
                site.intensity = 100;
                site.SITE_NAME = employee.SITE_NAME;
                branches.push(site);
            }
            return employee;
        });
    }
    let colors = createColorIndex(branches);
    return { data: data, branches: branches, colors: colors };
};

export default requireAuth(
    connect(mapStateToProps, null)(MapPanel));