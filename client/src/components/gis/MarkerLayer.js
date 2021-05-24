import React, { Component } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import './MarkerLayer.css';

class MarkerLayer extends Component {

    getIcon(iconName, color, label) {
        const iconSize = [30, 42];
        const iconAnchor = [14, 28];
        const popupAnchor = [0, -30];
        var m;
        if (iconName) {
            if (label) {
                m = new L.divIcon({
                    className: `custom-div-icon-${iconName}`,
                    html: `<div><div style="background-color:${color}" class='shape-marker-pin'></div><i/>
                        <div class="shape-marker-label">${label}</div>
                    <div>`,
                    iconSize: iconSize,
                    iconAnchor: iconAnchor,
                    popupAnchor: popupAnchor
                });
            }
            else
                m = new L.divIcon({
                    className: `custom-div-icon-${iconName}`,
                    html: `<div style="background-color:${color}" class='shape-marker-pin'></div><i/>`,
                    iconSize: iconSize,
                    iconAnchor: iconAnchor,
                    popupAnchor: popupAnchor
                });
        }
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
        let i = 0;
        for (let part of parts) {
            i = i + 1;
            jsx.push(<div key={i}>{part}<br /></div>);
        }
        return jsx;
    }

    render() {
        let jsx = this.props.data.map((item, index, arr) => (
            <Marker key={`${index}_${item.lat}`}
                count={item.count}
                position={[item.lat, item.lng]}
                icon={this.getIcon(this.props.icon, this.props.companies[item[this.props.colorIndex]].color, item[this.props.label])}
            >
                <Popup>
                    <div style={{ textAlign: "right" }}>
                        {this.createPopup(item)}
                    </div>
                </Popup>
            </Marker>));
        return jsx;
    }
}


export default MarkerLayer;