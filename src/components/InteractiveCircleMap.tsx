import { useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Libraries,
  DrawingManager,
} from "@react-google-maps/api";
import { circleOptions } from "../utils/circleUtils";
import { polygonOptions } from "../utils/polygonUtils";
import useMapFitBounds from "../hooks/useMapFitBounds";

interface InteractiveCircleMapProps {
  drawMode: boolean;
  radiusSelected: number;
  onCircleComplete: (circle: google.maps.Circle | null) => void;
}

const libraries: Libraries = ["geometry", "drawing"];

const googleMapProps = {
  mapContainerStyle: {
    width: "100%",
    height: "60vh",
  },
  zoom: 8,
  center: {
    lat: 40.2085,
    lng: -3.713,
  },
};

const InteractiveCircleMap = ({
  drawMode,
  radiusSelected,
  onCircleComplete,
}: InteractiveCircleMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null,
  );
  const circleRef = useRef<google.maps.Circle | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    googleMapRef.current = map;
  };

  const onDrawingManagerLoad = (
    drawingManager: google.maps.drawing.DrawingManager,
  ) => {
    drawingManagerRef.current = drawingManager;
  };

  const handleCircleComplete = useCallback(
    (circle: google.maps.Circle) => {
      circleRef.current = circle;
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
      onCircleComplete(circle);
    },
    [onCircleComplete],
  );

  useEffect(() => {
    if (googleMapRef.current && radiusSelected > 0) {
      const center = googleMapRef.current.getCenter();
      if (center) {
        const newCircle = new google.maps.Circle({
          ...circleOptions,
          map: googleMapRef.current,
          center: center.toJSON(),
          radius: radiusSelected,
        });
        handleCircleComplete(newCircle);
      }
    }
  }, [radiusSelected, onCircleComplete, handleCircleComplete]);

  useMapFitBounds(googleMapRef.current, circleRef.current);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <GoogleMap {...googleMapProps} onLoad={onMapLoad}>
        <DrawingManager
          options={{
            circleOptions: circleOptions,
            polygonOptions: polygonOptions,
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
