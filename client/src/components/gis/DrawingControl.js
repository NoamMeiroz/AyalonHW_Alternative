import React from "react";
import { useMemo } from "react";
import { useMap } from "react-leaflet";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RoomIcon from "@mui/icons-material/Room";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// Classes used by Leaflet to position controls
const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

/**
 * remove a layer by its id
 */
const removeLayer = (layerContainer, targetId) => {
  var layers = layerContainer._layers;
  var layer_ids = Object.keys(layers);
  // remove previous destination area
  layer_ids.forEach((id) => {
    if (id == targetId) {
      let layer = layers[id];
      layerContainer.removeLayer(layer);
    }
  });
};

/**
 * show origin and destination query filter control
 */
function DrawControl({
  position,
  startPolygon,
  destinationPolygon,
  startDrawClicked,
  destinationDrawClicked,
  deleteClicked,
}) {
  const map = useMap();
  const destination = useMap();
  const starting = useMap();

  const [selectedArea, setSelectedArea] = React.useState("work");
  const [destinationGeoJSON, setDestinationGeoJSON] = React.useState(null);
  const [startGeoJSON, setStartGeoJSON] = React.useState(null);

  /**
   * clear origin and destination polygon query filter
   */
  function deleteAllPolygon() {
    deleteClicked();
    //drawRef._toolbars.edit._modes.remove.handler.options.featureGroup.clearLayers();

    // var layerContainer =
    //   destination.current.leafletElement.options.edit.featureGroup;
    // var layers = layerContainer._layers;
    // var layer_ids = Object.keys(layers);
    // // remove previous destination area
    // layer_ids.forEach((id) => {
    //   let layer = layers[id];
    //   layerContainer.removeLayer(layer);
    // });

    // if (this.state.startGeoJSON !== null)
    //   removeLayer(map, this.state.startGeoJSON);
    // if (this.state.destinationGeoJSON !== null)
    //   removeLayer(map, this.state.destinationGeoJSON);

    // this.props.setDestinationPolygonQuery({});
    // this.props.setStartingPolygonQuery({});
  }

  // Memoize the minimap so it's not affected by position changes
  const drawingMenu = useMemo(
    () => (
      <Box className="drawBox">
        <Tooltip title="מקור" placement="right">
          <IconButton
		  onMouseDown={(e) => {
			startDrawClicked();
		  }}
		  onMouseUp={(e) => {
			startDrawClicked();
		  }}
            //onClick={() => {
             // startDrawClicked();
              //setSelectedArea("starting");
              // var layerContainer = starting._container.children[1].children[0].children[1];
              // let targetId = startPolygon.id;
              // removeLayer(layerContainer, targetId);
              // if (startGeoJSON !== null)
              //   removeLayer(
              //     map,
              //     startGeoJSON
              //   );

              //this.props.setStartingPolygonQuery([]);
              //  starting.current.leafletElement._toolbars.draw._modes.polygon.handler.enable();
           //
          >
            <RadioButtonUncheckedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="יעד" placement="right">
          <IconButton
            onMouseDown={(e) => {
              destinationDrawClicked();
            }}
            onMouseUp={(e) => {
              destinationDrawClicked();
            }}
            /*           onClick={() => {
				destinationDrawClicked();
              this.setState({ selectedArea: "destination" });
              var layerContainer =
                this.destination.current.leafletElement.options.edit
                  .featureGroup;
              let targetId = this.props.destinationPolygon.id;
              this.removeLayer(layerContainer, targetId);
              if (this.state.destinationGeoJSON !== null)
                this.removeLayer(
                  this.mapRef.current.leafletElement,
                  this.state.destinationGeoJSON
                );
              this.props.setDestinationPolygonQuery([]);
              this.destination.current.leafletElement._toolbars.draw._modes.polygon.handler.enable();
            }}*/
          >
            <RoomIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="מחיקה">
          <IconButton
            onMouseDown={(e) => {
              deleteAllPolygon();
            }}
            onMouseUp={(e) => {
              deleteAllPolygon();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    []
  );

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{drawingMenu}</div>
    </div>
  );
}

export default DrawControl;
