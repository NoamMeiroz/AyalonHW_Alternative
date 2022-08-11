import { useMapEvents } from 'react-leaflet'

function MapEvents({onmoveend}) {
    const map = useMapEvents({
      moveend: (e) => {
        onmoveend(e);
      },
    })
    return null;
  }

  export default MapEvents;
