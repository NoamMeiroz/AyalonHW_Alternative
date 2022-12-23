import L from 'leaflet';
import React, { Component } from "react";
import { GeoJSON, LayerGroup, Popup } from "react-leaflet";
import shp from "shpjs";

import './ShapeLayer.css';
/**
 * create a map layer from a shape file
 * zipUrl is the name of the shape file passed as props. (as zip)
 * fieldsName is an object with features name to show in the popup. passed as props.    
 */
class ShapeLayer extends Component {
    state = {
        data: []
    }

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this)

        this.style = this.style.bind(this);
    }


    // read the shape file from zip
    componentDidMount = () => {
        shp(this.props.zipUrl).then(data => {
            this.setState({ data: data.features });
        });
    }

    pointToLayer(feature, latlng) {
        // icon normal state
        let divIcon = L.divIcon({
            className: `custom-div-icon-train`,
            html: `<div class='marker-pin'></div><i/>`,
            iconSize: [25, 37],
            iconAnchor: [14, 28],
            popupAnchor: [0, -35]
        });

        return L.marker(latlng, {icon: divIcon}); // Change marker to circle
    }

    /**
     * Create a popup out of the properties of the feature.
     * Show only fieldsname if given as a paramaters. else Show all
     * @param {*} properties 
     * @param {*} fieldsName 
     */
    popUp = (properties, fieldsName) => {
        var out = [];
        if (properties) {
            let i = 0;
            for (var key in properties) {
                if (!fieldsName || Object.keys(fieldsName).includes(key)) {
                    let title = fieldsName ? fieldsName[key] : key;
                    i = i + 1;
                    out.push(<div key={`${key}_${i}`}>{`${title}: ${properties[key]}`}<br /></div>);
                }
            }
        }
        out.join("");
        return out;
    }

    style(feature) {
        return {
            //stroke-width: to have a constant width on the screen need to adapt with scale 
            opacity: 0.65,
            color: this.props.getColor(feature),
        };
    };

    render() {
        let jsx = <LayerGroup>{this.state.data.map((feature, index, arr) => (
            <GeoJSON key={index} data={feature}  style={this.style} //style={{ opacity: 0.65 }}
                pointToLayer={this.pointToLayer.bind(this)}>
                <Popup>
                    <div style={{ whiteSpace: 'no-warp' }}>
                        {this.popUp(feature.properties, this.props.fieldsName)}
                    </div>
                </Popup>
            </GeoJSON>
        ))}
        </LayerGroup>;
        return jsx;
    }
}
export default ShapeLayer;
