import { useLeafletContext } from "@react-leaflet/core";

import L from "leaflet";
import { useEffect, useState } from "react";
import Draw from "leaflet-draw";

function LeafletDrawControl({
  name,
  draw,
  edit,
  position,
  drawPolygon,
  onCreated,
  deletePolygon,
  onRemovePolygon,
  initialValue,
}) {
  const context = useLeafletContext();

  const [drawRef, setDraw] = useState(null);
  const [polygonLayer, setPolygonLayer] = useState({});
  const [featureGroup, setFeatureGroup] = useState(null);

  useEffect(() => {
    if (drawPolygon) {
      if (featureGroup && polygonLayer && polygonLayer[name]) {
        featureGroup.removeLayer(polygonLayer[name]);
        onRemovePolygon(name);
      }
      drawRef._toolbars.draw._modes.polygon.handler.enable();
    }
  }, [drawPolygon]);

  useEffect(() => {
    if (deletePolygon)
      //drawRef._toolbars.edit._modes.remove.handler.options.featureGroup.clearLayers();
      featureGroup.clearLayers();
      onRemovePolygon();
  }, [deletePolygon]);

  useEffect(() => {
    const { layerContainer, map } = context;
    setFeatureGroup(layerContainer);
    const options = {
      edit: {
        ...edit,
        featureGroup: layerContainer,
      },
    };

    if (draw) {
      options.draw = { ...draw };
    }

    if (position) {
      options.position = position;
    }
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    setDraw(drawControl);

    // add polygon to layer
    map.on(L.Draw.Event.CREATED, function (e) {
      var layer = e.layer;
      if (layer.options.name === name) {
        layerContainer.addLayer(layer);
        var updatePolygonLayer = { ...polygonLayer };
        updatePolygonLayer[name] = layer;
        setPolygonLayer(updatePolygonLayer);
        onCreated(e);
      }
    });

    if (initialValue !== "") {
      initialValue.addTo(layerContainer);
      var updatePolygonLayer = { ...polygonLayer };
      updatePolygonLayer[name] = initialValue;
      setPolygonLayer(updatePolygonLayer);
    }
    return () => {
      map.removeControl(drawControl);
    };
  }, []);

  return null;
}

export default LeafletDrawControl;
