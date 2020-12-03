import React, { createRef, Component } from 'react';
import { Map, LayerGroup, TileLayer, LayersControl } from 'react-leaflet';
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
import { template } from '../../utils/string';
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

/**
 * Return list of companies. for each company has a unique color
 * @param {*} employees 
 */
const createColorIndex = (employees) => {
    let companies = {};
    for (let employee of employees) {
        if (!companies[employee.EMPLOYER_ID])
            companies[employee.EMPLOYER_ID] = {name: employee.COMPANY};
    }
    let count = Object.keys(companies).length;
    let colorList = randomColor({ luminosity: 'dark', count: count, seed: 12 });
    for (const key in companies) {
        count = count - 1;
        companies[key].color = colorList[count];
    }
    return companies;
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

    createCompanyLayer(companyID) {
        let jsx = [];

        let employees = this.props.data.filter(emp => {
            return (emp.EMPLOYER_ID == companyID)
        });
        let branchList = this.props.branches.filter(branch => {
            return (branch.EMPLOYER_ID == companyID)
        });
        let empLayer = <MarkerLayer key={companyID}
            data={employees}
            icon={"Worker"}
            companies={this.props.companies}
            colorIndex="EMPLOYER_ID"
            popupFields={["WORKER_ID", "COMPANY"]}
            popupString={template(["מזהה עובד: ", "<br>חברת "], "WORKER_ID", "COMPANY")}
        />
        let branchLayer = <MarkerLayer key={companyID+"_b"}
            data={branchList}
            icon={"building"}
            companies={this.props.companies}
            colorIndex={"EMPLOYER_ID"}
            popupFields={["COMPANY", "SITE_NAME", "count"]}
            popupString={template(["", "<br>", "<br>", " עובדים"], "COMPANY", "SITE_NAME", "count")}
        />
        jsx.push(empLayer);
        jsx.push(branchLayer);

    return <LayerGroup>{jsx}</LayerGroup>;
    }

    createDataLayers() {
        if (!this.props.companies)
            return null;
        return Object.keys(this.props.companies).map(companyId=> {
                return <LayersControl.Overlay key={companyId} name={this.props.companies[companyId].name}>
                    {this.createCompanyLayer(companyId)}
                </LayersControl.Overlay>;
            });
    }


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
                    {this.createDataLayers()}
                    <LayersControl.Overlay name="איזורי תנועה">
                        <ShapeLayer zipUrl={zipUrl} />
                    </LayersControl.Overlay>
                </LayersControl>
                <Control position="bottomright">
                    <Legend data={this.props.data}
                        companies={this.props.companies}></Legend>
                </Control>
            </Map>
        </Box>
    }
}


function mapStateToProps(state) {
    let data = [];
    let branches = [];
    if (state.reports.employeesList) {
        data = state.reports.employeesList.filter(employee => {
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
            let currentSite = branches.find((item) => {
                return (item.SITE_NAME === employee.SITE_NAME && item.EMPLOYER_ID === employee.EMPLOYER_ID)
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
    let companies = createColorIndex(branches);
    return { data: data, branches: branches, companies: companies };
};

export default requireAuth(
    connect(mapStateToProps, null)(MapPanel));
