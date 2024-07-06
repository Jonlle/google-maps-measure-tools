import React from "react";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import CustomTooltip from "./CustomTooltip";
import { googleMapProps } from "../utils/googleMapProps";
import { polygonOptions } from "../utils/polylineUtils";
import { usePolylineMap } from "../hooks/usePolylineMap";

type CallbackFunction = () => void;

export interface InteractivePolylineMapProps {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setHasDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalDistance: React.Dispatch<React.SetStateAction<number>>;
  setArea: React.Dispatch<React.SetStateAction<number>>;
  setStartDrawingCallback: React.Dispatch<
    React.SetStateAction<CallbackFunction | null>
  >;
  setStopDrawingCallback: React.Dispatch<
    React.SetStateAction<CallbackFunction | null>
  >;
  setClearDrawingCallback: React.Dispatch<
    React.SetStateAction<CallbackFunction | null>
  >;
}

const InteractivePolylineMap: React.FC<InteractivePolylineMapProps> = ({
  isDrawing,
  setIsDrawing,
  setHasDrawing,
  setTotalDistance,
  setArea,
  setStartDrawingCallback,
  setStopDrawingCallback,
  setClearDrawingCallback,
}) => {
  const {
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
    isDrawing,
    setIsDrawing,
    setHasDrawing,
    setTotalDistance,
    setArea,
    setStartDrawingCallback,
    setStopDrawingCallback,
    setClearDrawingCallback,
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
