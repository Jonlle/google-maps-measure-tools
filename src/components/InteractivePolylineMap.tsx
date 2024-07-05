import React, { useCallback } from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import CustomTooltip from "./CustomTooltip";
import { googleMapProps } from "../utils/googleMapProps";

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

  return (
    <>
      <GoogleMap
        {...googleMapProps}
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
