import React from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import CustomTooltip from "./CustomTooltip";
import { googleMapProps } from "../utils/googleMapProps";
import { polygonOptions } from "../utils/polylineUtils";
import {
  TLatLng,
  TMap,
  TMapMouseEvent,
  TPolyline,
} from "../types/googleMapsTypes";

interface InteractivePolylineMapProps {
  isDrawingMode: boolean;
  map: TMap | null;
  polylinePath: TLatLng[];
  tooltipContent: string;
  tooltipPosition: { x: number; y: number };
  handleMapLoad: (map: TMap) => void;
  handleMapClick: (event: TMapMouseEvent) => void;
  handlePolylineLoad: (polyline: TPolyline) => void;
  handlePolylineClick: (event: TMapMouseEvent) => void;
  handlePolylineMouseOver: (event: TMapMouseEvent) => void;
  handlePolylineMouseOut: () => void;
  handlePolylineMouseDown: (event: TMapMouseEvent) => void;
  handlePolylineMouseUp: (event: TMapMouseEvent) => void;
}

const InteractivePolylineMap: React.FC<InteractivePolylineMapProps> = ({
  isDrawingMode,
  map,
  polylinePath,
  tooltipContent,
  tooltipPosition,
  handleMapLoad,
  handleMapClick,
  handlePolylineLoad,
  handlePolylineClick,
  handlePolylineMouseOver,
  handlePolylineMouseOut,
  handlePolylineMouseDown,
  handlePolylineMouseUp,
}) => {
  return (
    <>
      <GoogleMap
        {...googleMapProps}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        <Polyline
          path={polylinePath}
          options={{
            ...polygonOptions,
            map: map,
          }}
          editable={isDrawingMode}
          onLoad={handlePolylineLoad}
          onClick={handlePolylineClick}
          onMouseOver={handlePolylineMouseOver}
          onMouseOut={handlePolylineMouseOut}
          onMouseDown={handlePolylineMouseDown}
          onMouseUp={handlePolylineMouseUp}
        />
      </GoogleMap>
      {tooltipContent && (
        <CustomTooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </>
  );
};

export default InteractivePolylineMap;
