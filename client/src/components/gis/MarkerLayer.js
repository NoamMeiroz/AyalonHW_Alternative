import React, { Component } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import './MarkerLayer.css';

class MarkerLayer extends Component {

    getIcon(iconName, color) {
        var m;
        if (iconName)
            m = new L.divIcon({
                className: `custom-div-icon-${iconName}`,
                html: `<div style="background-color:${color}" class='shape-marker-pin'></div><i/>`,
                iconSize: [30, 42],
                iconAnchor: [14, 28],
                popupAnchor:[0, -30]
            });
        else
            m = new L.Icon.Default();
        return m;
    }

    getParams(item) {
        let paramsObject = {}
        for (const field of this.props.popupFields) {
            paramsObject[field] = item[field];
        }
        return paramsObject;
    }

    createPopup(item) {
        let str = this.props.popupString(this.getParams(item));
        let parts = str.split("<br>");
        let jsx = []
        let i =0;
        for (let part of parts) {
            i = i+1;
            jsx.push(<div key={i}>{part}<br/></div>);
        }
        return jsx;
    }

    render() {
        let jsx = this.props.data.map((item, index, arr) => (
            <Marker key={index}
                position={[item.lat, item.lng]}
                icon={this.getIcon(this.props.icon, this.props.companies[item[this.props.colorIndex]].color)}
            >
                <Popup>
                    <div style={{textAlign: "right"}}>
                        {this.createPopup(item)}
                    </div>
                </Popup>
            </Marker>));
        return jsx;
    }
}


export default MarkerLayer;