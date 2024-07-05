import { useCallback, useEffect, useRef } from "react";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import { circleOptions } from "../utils/circleUtils";
import useMapFitBounds from "../hooks/useMapFitBounds";
import { googleMapProps } from "../utils/googleMapProps";

interface InteractiveCircleMapProps {
  drawMode: boolean;
  radiusSelected: number;
  waitingForCenter: boolean;
  onCircleComplete: (circle: google.maps.Circle | null) => void;
  onCircleEdit: (circle: google.maps.Circle) => void;
}

const InteractiveCircleMap = ({
  drawMode,
  radiusSelected,
  waitingForCenter,
  onCircleComplete,
  onCircleEdit,
}: InteractiveCircleMapProps) => {
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null,
  );
  const circleRef = useRef<google.maps.Circle | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    googleMapRef.current = map;
    if (waitingForCenter) {
      map.setOptions({ draggableCursor: "crosshair" });
    }
  };

  const onDrawingManagerLoad = (
    drawingManager: google.maps.drawing.DrawingManager,
  ) => {
    drawingManagerRef.current = drawingManager;
  };

  const handleCircleComplete = useCallback(
    (circle: google.maps.Circle) => {
      circleRef.current = circle;
      circle.setEditable(true);
      circle.setDraggable(true);
      circle.addListener("radius_changed", () => {
        onCircleEdit(circle);
      });
      circle.addListener("center_changed", () => {
        onCircleEdit(circle);
      });
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
      if (googleMapRef.current) {
        googleMapRef.current.setOptions({ draggableCursor: "" });
      }
      onCircleComplete(circle);
    },
    [onCircleComplete, onCircleEdit],
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (waitingForCenter && e.latLng && googleMapRef.current) {
        const newCircle = new google.maps.Circle({
          ...circleOptions,
          map: googleMapRef.current,
          center: e.latLng,
          radius: radiusSelected,
        });
        handleCircleComplete(newCircle);
      }
    },
    [waitingForCenter, radiusSelected, handleCircleComplete],
  );

  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setOptions({
        draggableCursor: waitingForCenter ? "crosshair" : "",
      });
    }
  }, [waitingForCenter]);

  useMapFitBounds(googleMapRef.current, circleRef.current);

  return (
    <div>
      <GoogleMap
        {...googleMapProps}
        onLoad={onMapLoad}
        onClick={handleMapClick}
      >
        <DrawingManager
          options={{
            circleOptions: circleOptions,
            drawingControl: false,
            map: googleMapRef.current,
          }}
          onLoad={onDrawingManagerLoad}
          drawingMode={drawMode ? google.maps.drawing.OverlayType.CIRCLE : null}
          onCircleComplete={handleCircleComplete}
        />
      </GoogleMap>
    </div>
  );
};

export default InteractiveCircleMap;
