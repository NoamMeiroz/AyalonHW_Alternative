import React, { Component } from 'react';
import { Marker, LayerGroup, Popup } from 'react-leaflet';
import L from 'leaflet';

import './MarkerLayer.css';

class WokerLayer extends Component {

    getIcon(iconName, color) {
        var m;
        if (iconName)
           // m = new L.DivIcon({className: 'leaflet-div-group' });
           m = new L.divIcon({
            className: `custom-div-icon-${iconName}`,
            html: `<div style="background-color:${color}" class='marker-pin'></div><i/>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        else    
            m = new L.Icon.Default();
        return m;
    }

    getParams(item) {
        let paramsObject = {} 
        for (const field of this.props.popupFields){
            paramsObject[field]=item[field];
        }
        return paramsObject;
    }

    render() {
        let jsx = <LayerGroup>{this.props.data.map((item, index, arr) => (
            <Marker key={index}
                position={[item.lat, item.lng]}
                icon={this.getIcon(this.props.icon, this.props.colors[item[this.props.colorIndex]])}
            >
                <Popup>
                    {this.props.popupString(this.getParams(item))} 
                </Popup>   
            </Marker>))}
        </LayerGroup>;
        return jsx;
    }
}


export default WokerLayer;