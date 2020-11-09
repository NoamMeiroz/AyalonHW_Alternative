import React, { Component } from "react";
import { GeoJSON, LayerGroup, Popup } from "react-leaflet";
import shp from "shpjs";

class ShapeLayer extends Component {
    state = {
        data: []
    }

    constructor(props) {
        super(props)
        this.componentDidMount = this.componentDidMount.bind(this)
    }


    componentDidMount = () => {
        shp(this.props.zipUrl).then(data => {
            this.setState({ data: data.features });
        });
    }

    popUp = (properties) => {
        var out = [];
        if (properties) {
            for (var key in properties) {
                out.push(key + ": " + properties[key]);
            }
        }
        out.join("");
        return out;
    }

    render() {
        let jsx = <LayerGroup>{this.state.data.map((feature, index, arr) => (
            <GeoJSON key={feature.properties.ID} data={feature} style={{ opacity: 0.65 }}>
                <Popup>
                    <div style={{whiteSpace:'no-warp'}}>
                    {this.popUp(feature.properties)}
                    </div>
                </Popup>
            </GeoJSON>
        ))}
        </LayerGroup>;
        return jsx;
    }
}
export default ShapeLayer;
