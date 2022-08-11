import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet.heat";
import { useMap } from "react-leaflet";

function HeatmapLayer({
  points,
  latitudeExtractor,
  longitudeExtractor,
  intensityExtractor,
}) {
  const context = useLeafletContext();
  const [ heatmap, setHeatmap ] = useState(null);
  const map = useMap();

  useEffect(() => {
    const newPoints = points.map((p) => {
      return [
        latitudeExtractor(p),
        longitudeExtractor(p),
        intensityExtractor(p),
      ];
    });
    if (heatmap && heatmap._map)
      heatmap.setLatLngs(newPoints);
  }, [points]);

  useEffect(() => {
    const newPoints = points.map((p) => {
      return [
        latitudeExtractor(p),
        longitudeExtractor(p),
        intensityExtractor(p),
      ];
    });

    const heatmap = new L.heatLayer(newPoints);
    setHeatmap(heatmap);
    const container = context.layerContainer || context.map;
    container.addLayer(heatmap);
    heatmap.addTo(map);
  }, []);

  return null;
}

export default HeatmapLayer;
