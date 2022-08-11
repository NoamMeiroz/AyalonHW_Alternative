import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet.heat";

function HeatmapLayer({
  points,
  latitudeExtractor,
  longitudeExtractor,
  intensityExtractor,
}) {
  const context = useLeafletContext();
  const [ heatmap, setHeatmap ] = useState(null);

  useEffect(() => {
    const newPoints = points.map((p) => {
      return [
        latitudeExtractor(p),
        longitudeExtractor(p),
        intensityExtractor(p),
      ];
    });
    if (heatmap)
      heatmap.setLatLngs(newPoints);
  }, [points]);

  useEffect(() => {
    const heatmap = new L.heatLayer([]);
    setHeatmap(heatmap);
    const container = context.layerContainer || context.map;
    container.addLayer(heatmap);

    return () => {
      container.removeLayer(heatmap);
    };
  }, []);

  return null;
}

export default HeatmapLayer;
