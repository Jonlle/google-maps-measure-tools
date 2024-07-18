import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import { CircleState } from "./CircleMap";
import { UseMapDrawing } from "../hooks/useMapDrawing";
import { useCircleMap } from "../hooks/useCircleMap";
import { circleOptions } from "../utils/circleUtils";
import { googleMapProps } from "../utils/googleMapProps";

export interface InteractiveCircleMapProps {
  setCircleState: React.Dispatch<React.SetStateAction<CircleState>>;
  useMapDrawing: UseMapDrawing;
  radiusSelected: number;
  setRadiusSelected: React.Dispatch<React.SetStateAction<number>>;
}

const InteractiveCircleMap = ({
  setCircleState,
  useMapDrawing,
  radiusSelected,
  setRadiusSelected,
}: InteractiveCircleMapProps) => {
  const {
    isDrawing,
    mapRef,
    hasDrawing,
    waitingForCenter,
    handleMapLoad,
    handleDrawingManagerLoad,
    handleCircleComplete,
    handleMapClick,
  } = useCircleMap({
    setCircleState,
    useMapDrawing,
    radiusSelected,
    setRadiusSelected,
  });

  return (
    <>
      <GoogleMap
        {...googleMapProps}
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        <DrawingManager
          options={{
            circleOptions: circleOptions,
            drawingControl: false,
            map: mapRef.current,
          }}
          onLoad={handleDrawingManagerLoad}
          drawingMode={
            isDrawing && !hasDrawing && !waitingForCenter
              ? google.maps.drawing.OverlayType.CIRCLE
              : null
          }
          onCircleComplete={handleCircleComplete}
        />
      </GoogleMap>
    </>
  );
};

export default InteractiveCircleMap;
