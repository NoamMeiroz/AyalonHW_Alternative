import { useMapEvents } from 'react-leaflet'

function MapEvents({onmoveend}) {
    useMapEvents({
      moveend: (e) => {
        onmoveend(e);
      },
    })
    return null;
  }

  export default MapEvents;
