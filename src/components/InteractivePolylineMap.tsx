import React, { useCallback } from "react";
import {
  GoogleMap,
  Libraries,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import CustomTooltip from "./CustomTooltip";

const libraries: Libraries = ["geometry", "drawing", "marker"];

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
  tooltipContent: string;
  tooltipPosition: { x: number; y: number };
  handleMapLoad: (map: google.maps.Map) => void;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
  handlePolylineLoad: (polyline: google.maps.Polyline) => void;
  handleCurrentPolylineLoad: (polyline: google.maps.Polyline) => void;
  handleCurrentPolylineClick: (event: google.maps.MapMouseEvent) => void;
  handleCurrentPolylineMouseOver: (event: google.maps.MapMouseEvent) => void;
  handleCurrentPolylineMouseOut: () => void;
}

const InteractivePolylineMap: React.FC<InteractivePolylineMapProps> = ({
  isDrawingMode,
  polylines,
  currentPolyline,
  tooltipContent,
  tooltipPosition,
  handleMapLoad,
  handleMapClick,
  handlePolylineLoad,
  handleCurrentPolylineLoad,
  handleCurrentPolylineClick,
  handleCurrentPolylineMouseOver,
  handleCurrentPolylineMouseOut,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const handlePolylineClick = useCallback(
    (
      event: google.maps.MapMouseEvent,
      polylinePath: google.maps.LatLng[],
      polylineIndex: number,
    ) => {
      console.log("Polyline Clicked", polylinePath, polylineIndex, event);
    },
    [],
  );

  const handlePolylineMouseOver = useCallback(
    (
      event: google.maps.MapMouseEvent,
      polylinePath: google.maps.LatLng[],
      polylineIndex: number,
    ) => {
      console.log("Polyline MouseOver", polylinePath, polylineIndex, event);
    },
    [],
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={centerGMap}
        zoom={10}
        options={options}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        {polylines.map((polylinePath, index) => (
          <Polyline
            key={index}
            path={polylinePath}
            options={{
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
            onLoad={handlePolylineLoad}
            onClick={(event) => handlePolylineClick(event, polylinePath, index)}
            onMouseOver={(event) =>
              handlePolylineMouseOver(event, polylinePath, index)
            }
          />
        ))}
        {isDrawingMode && currentPolyline.length > 0 && (
          <Polyline
            path={currentPolyline}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
            }}
            onLoad={handleCurrentPolylineLoad}
            onClick={handleCurrentPolylineClick}
            onMouseOver={handleCurrentPolylineMouseOver}
            onMouseOut={handleCurrentPolylineMouseOut}
          />
        )}
      </GoogleMap>
      {tooltipContent && (
        <CustomTooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </>
  );
};

export default InteractivePolylineMap;
