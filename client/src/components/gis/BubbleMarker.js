import React, { Component } from 'react';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import MarkerLayer from './layers/MarkerLayer';
import { template } from '../../utils/string';

import './BubbleMarker.css';

class BubbleMarker extends Component {

    hexToRgb = (hex, opacity) => {
        if (!hex.startsWith('#')) return hex;
        const hashless = hex.slice(1);
        const num = parseInt(
            hashless.length === 3
                ? hashless.split('').map(c => c.repeat(2)).join('')
                : hashless,
            16,
        );
        const red = num >> 16;
        const green = (num >> 8) & 255;
        const blue = num & 255;

        if (opacity) {
            return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        }
        return `rgb(${red}, ${green}, ${blue})`;
    };


    reducer(accumulator, branch) {
        return accumulator + branch.options.count
    }

    createClusterCustomIcon = (cluster) => {
        const clusterChildMarkers = cluster.getAllChildMarkers(); // list of all markers
        const count = clusterChildMarkers.reduce(this.reducer, 0);

        let size = 'LargeXL';

        if (count < 100) {
            size = 'Small';
        }
        else if (count >= 100 && count < 1000) {
            size = 'Medium';
        }
        else if (count >= 1000) {
            size = 'Large';
        }
        const options = {
            cluster: `markerCluster${size}`,
            circle1: `markerCluster${size}DivOne`,
            circle2: `markerCluster${size}DivTwo`,
            circle3: `markerCluster${size}DivThree`,
            circle4: `markerCluster${size}DivFour`,
            label: `markerCluster${size}Label`,
        };

        const clusterColor = this.hexToRgb('#fc4b51');
        const circleStyle1 = `background-color: ${clusterColor.slice(0, -1)}, 0.05)`;
        const circleStyle2 = `background-color: ${clusterColor.slice(0, -1)}, 0.15)`;
        const circleStyle3 = `background-color: ${clusterColor.slice(0, -1)}, 0.25)`;
        const circleStyle4 = `background-color: ${clusterColor.slice(0, -1)}, 0.65)`;

        return L.divIcon({
            html:
                `<div style="${circleStyle1}" class="${options.circle1}">
                    <div style="${circleStyle2}" class="${options.circle2}">
                        <div style="${circleStyle3}" class="${options.circle3}">
                            <div style="${circleStyle4}" class="${options.circle4}">
                                <span class="${options.label}">${count}</span>
                            </div>
                        </div>
                    </div>
                </div>`,
            className: `${options.cluster}`,
        });
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
        let jsx = <MarkerClusterGroup
            iconCreateFunction={this.createClusterCustomIcon}
            spiderLegPolylineOptions={{
                weight: 0,
                opacity: 0,
            }}>
            <MarkerLayer key={"bubbles"}
                data={this.props.data}
                label={"count"}
                icon={"building"}
                companies={this.props.companies}
                colorIndex={"EMPLOYER_ID"}
                popupFields={["COMPANY", "SITE_NAME", "count"]}
                popupString={template(["", "<br>", "<br>", " עובדים"], "COMPANY", "SITE_NAME", "count")}
            />
        </MarkerClusterGroup>

        return jsx;
    }
}

export default BubbleMarker;