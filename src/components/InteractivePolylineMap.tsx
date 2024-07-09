import React from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import CustomTooltip from "./CustomTooltip";
import { PolylineState } from "./PolylineMap";
import { googleMapProps } from "../utils/googleMapProps";
import { polygonOptions } from "../utils/polylineUtils";
import { usePolylineMap } from "../hooks/usePolylineMap";
import { UseMapDrawing } from "../hooks/useMapDrawing";

export interface InteractivePolylineMapProps {
  setPolylineState: React.Dispatch<React.SetStateAction<PolylineState>>;
  useMapDrawing: UseMapDrawing;
}

const InteractivePolylineMap: React.FC<InteractivePolylineMapProps> = ({
  setPolylineState,
  useMapDrawing,
}) => {
  const {
    isDrawing,
    mapRef,
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
  } = usePolylineMap({
    setPolylineState,
    useMapDrawing,
  });

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
            map: mapRef.current,
          }}
          editable={isDrawing}
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
