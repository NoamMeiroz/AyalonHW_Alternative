import React, { Component, createRef } from 'react';
import { Map, LayerGroup, TileLayer, LayersControl, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import Control from 'react-leaflet-control';
import { EditControl } from "react-leaflet-draw"
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RoomIcon from '@material-ui/icons/Room';
import DeleteIcon from '@material-ui/icons/Delete';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import randomColor from 'randomcolor';
import { connect } from 'react-redux';

import requireAuth from '../requireAuth'; //used to check if login successfull
import * as actions from '../../actions';
//import proj4 from 'proj4';
import MapSidebar from './MapSidebar';
import MarkerLayer from './MarkerLayer';
import Legend from './Legend';
import { template } from '../../utils/string';
import ShapeLayer from "./ShapeLayer";
import tazUrl from "./TAZ.zip";
import trainStationUrl from "./railstations.zip";

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
            companies[employee.EMPLOYER_ID] = { name: employee.COMPANY };
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
            [33.5074706, 36.2478762]],
        selectedArea: "work",
        destinationGeoJSON: null,
        startGeoJSON: null
    };


    mapRef = createRef();
    featureGroupRef = createRef();
    destination = createRef();
    starting = createRef();

    handleZoom = (e) => {
        this.setState({ zoom: this.mapRef.current.viewport.zoom });
    };

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.timestamp !== this.props.timestamp;
    }

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
        let branchLayer = <MarkerLayer key={companyID + "_b"}
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
        return Object.keys(this.props.companies).map(companyId => {
            return <LayersControl.Overlay key={companyId} name={this.props.companies[companyId].name}>
                {this.createCompanyLayer(companyId)}
            </LayersControl.Overlay>;
        });
    }

    /**
     * save the polygon is state after complition
     * @param {*} e 
     */
    _onCreatedWork = (e) => {
        const { _leaflet_id } = e.layer;
        if (this.state.selectedArea === "destination") {
            this.props.setDestinationPolygonQuery({ id: _leaflet_id, polygon: e.layer.toGeoJSON() });
        }
        else {
            this.props.setStartingPolygonQuery({ id: _leaflet_id, polygon: e.layer.toGeoJSON() });
        }
    }

    deleteAllPolygon() {
        var layerContainer = this.destination.current.leafletElement.options.edit.featureGroup;
        var layers = layerContainer._layers;
        var layer_ids = Object.keys(layers);
        // remove previous destination area
        layer_ids.forEach(id => {
            let layer = layers[id];
            layerContainer.removeLayer(layer);
        });
        this.props.setDestinationPolygonQuery([]);
        this.props.setStartingPolygonQuery([]);
    }

    /**
     * remove a layer by its id
     */
    removeLayer = (layerContainer, targetId) => {
        var layers = layerContainer._layers;
        var layer_ids = Object.keys(layers);
        // remove previous destination area
        layer_ids.forEach(id => {
            if (id == targetId) {
                let layer = layers[id];
                layerContainer.removeLayer(layer);
            }
        });
    }

    /**
     * show control 
     */
    drawControl() {
        return <Control position="topleft">
            <Box className="drawBox">
                <Tooltip title="מקור" placement="right">
                    <IconButton onClick={() => {
                        this.setState({ selectedArea: "starting" });
                        var layerContainer = this.starting.current.leafletElement.options.edit.featureGroup;
                        let targetId = this.props.startPolygon.id;
                        this.removeLayer(layerContainer, targetId);
                        if (this.state.destinationGeoJSON !== null)
                            this.removeLayer(this.mapRef.current.leafletElement, this.state.startGeoJSON);

                        this.props.setStartingPolygonQuery([]);
                        this.starting.current.leafletElement._toolbars.draw._modes.polygon.handler.enable();
                    }}>
                        <RadioButtonUncheckedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="יעד" placement="right">
                    <IconButton onClick={() => {
                        this.setState({ selectedArea: "destination" });
                        var layerContainer = this.destination.current.leafletElement.options.edit.featureGroup;
                        let targetId = this.props.destinationPolygon.id;
                        this.removeLayer(layerContainer, targetId);
                        if (this.state.destinationGeoJSON !== null)
                            this.removeLayer(this.mapRef.current.leafletElement, this.state.destinationGeoJSON);
                        this.props.setDestinationPolygonQuery([]);
                        this.destination.current.leafletElement._toolbars.draw._modes.polygon.handler.enable();
                    }} >
                        <RoomIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="מחיקה">
                    <IconButton onClick={() => {
                        this.deleteAllPolygon();
                    }} >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Control>
    }

    componentDidMount = () => {
        if (this.props.destinationPolygon.id) {
            let myStyle = {
                "color": "#3388ff",
                opacity: 0.5,
                weight: 5,
                width: 4
            }
            let geoJSON = new L.GeoJSON(this.props.destinationPolygon.polygon,
                { style: myStyle }).addTo(this.mapRef.current.leafletElement);
            this.setState({ destinationGeoJSON: geoJSON._leaflet_id });
        }
        if (this.props.startPolygon.id) {
            let myStyle = {
                color: '#000000',
                opacity: 0.5,
                weight: 5,
                width: 4
            }
            let geoJSON = new L.GeoJSON(this.props.startPolygon.polygon,
                { style: myStyle }).addTo(this.mapRef.current.leafletElement);
            this.setState({ startGeoJSON: geoJSON._leaflet_id });
        }

    }

    render() {
        return <Box display="flex">
            <MapSidebar>
            </MapSidebar>
            <Map center={this.state.position}
                zoom={this.state.zoom}
                onzoomend={this.handleZoom}
                maxZoom={14}
                ref={this.mapRef}
            >
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
                    <LayersControl.Overlay name="תחנות רכבת">
                        <ShapeLayer zipUrl={trainStationUrl} fieldsName={{ STAT_NAMEH: "שם תחנה" }} />
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="איזורי תנועה">
                        <ShapeLayer zipUrl={tazUrl} />
                    </LayersControl.Overlay>
                </LayersControl>
                <FeatureGroup ref={this.featureGroupRef}>
                    <EditControl ref={this.destination}
                        id="polygonDestination"
                        position='topleft'
                        onCreated={this._onCreatedWork}
                        draw={{
                            rectangle: false,
                            polyline: false,
                            circlemarker: false,
                            circle: false,
                            marker: false
                        }}
                        edit={{
                            allowIntersection: false,
                            edit: false
                        }}

                    />
                </FeatureGroup>
                <FeatureGroup >
                    <EditControl
                        ref={this.starting}
                        id="polygonStart"
                        position='bottomleft'
                        onCreated={this._onCreatedHome}
                        draw={{
                            rectangle: false,
                            polyline: false,
                            circlemarker: false,
                            circle: false,
                            marker: false,
                            polygon: {
                                allowIntersection: false, // Restricts shapes to simple polygons
                                shapeOptions: {
                                    color: '#000000'
                                }
                            }
                        }}
                        edit={{
                            allowIntersection: false,
                            edit: false
                        }}
                    />
                </FeatureGroup>
                {this.drawControl()}
                <Control position="bottomright">
                    <Legend data={this.props.data}
                        companies={this.props.companies}></Legend>
                </Control>
            </Map>
        </Box>
    }
}


function mapStateToProps(state, ownProps) {
    let data = [];
    let branches = [];
    let companies = [];
    let timestamp = new Date();
    let destinationPolygon = {};
    let startPolygon = {};
    if (state.reports.employeesList) {
        timestamp = state.reports.timestamp;
        data = state.reports.employeesList.filter(employee => {
            return parseFloat(employee.X);
        });
        // employees data
        data = data.map(employee => {
            // handle employee
            let coor = { "X": employee.X, "Y": employee.Y };//convertCoordinate({"X": employee.X, "Y": employee.Y });
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
                let coor = { "X": employee.WORK_X, "Y": employee.WORK_Y };//convertCoordinate({"X": employee.WORK_X, "Y": employee.WORK_Y });
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
        companies = createColorIndex(branches);
    }
    if (state.reportParams.qDestinationPolygonParams) {
        destinationPolygon = state.reportParams.qDestinationPolygonParams;
    }
    if (state.reportParams.qStartingPolygonParams) {
        startPolygon = state.reportParams.qStartingPolygonParams;
    }
    return {
        data: data, branches: branches, companies: companies, timestamp: timestamp,
        destinationPolygon: destinationPolygon, startPolygon: startPolygon
    };
};

export default requireAuth(
    connect(mapStateToProps, actions)(MapPanel));
