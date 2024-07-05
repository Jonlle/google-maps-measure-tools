import React from "react";
import {
  GoogleMap,
  Libraries,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

const libraries: Libraries = ["geometry"];

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
};

const centerGMap = {
  lat: 40.2085,
  lng: -3.713,
};

const options: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

interface InteractivePolylineMapProps {
  isDrawingMode: boolean;
  polylines: google.maps.LatLng[][];
  currentPolyline: google.maps.LatLng[];
  handleMapLoad: (map: google.maps.Map) => void;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
  handlePolylineLoad: (polyline: google.maps.Polyline) => void;
}

const InteractivePolylineMap: React.FC<InteractivePolylineMapProps> = ({
  isDrawingMode,
  polylines,
  currentPolyline,
  handleMapLoad,
  handleMapClick,
  handlePolylineLoad,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={centerGMap}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
      options={options}
    >
      {polylines.map((path, index) => (
        <Polyline
          key={index}
          path={path}
          options={{
            strokeColor: "#FF0000",
            strokeWeight: 2,
            editable: false,
            draggable: false,
          }}
          onLoad={handlePolylineLoad}
        />
      ))}
      {isDrawingMode && currentPolyline.length > 0 && (
        <Polyline
          path={currentPolyline}
          options={{
            strokeColor: "#FF0000",
            strokeWeight: 2,
            editable: true,
            draggable: false,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default InteractivePolylineMap;
