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

interface GoogleMapContainerProps {
  mode: "area" | "radius" | null;
  drawMode: boolean;
  radiusSelected: number;
  onCircleComplete: (circle: google.maps.Circle | null) => void;
  onPolygonComplete: (polygon: google.maps.Polygon | null) => void;
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

const GoogleMapContainer = ({
  mode,
  drawMode,
  radiusSelected,
  onCircleComplete,
  onPolygonComplete,
}: GoogleMapContainerProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null,
  );
  const circleRef = useRef<google.maps.Circle | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

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

  const handlePolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      polygonRef.current = polygon;
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
      onPolygonComplete(polygon);
    },
    [onPolygonComplete],
  );

  useEffect(() => {
    if (googleMapRef.current && radiusSelected > 0 && mode === "radius") {
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
  }, [radiusSelected, mode, onCircleComplete, handleCircleComplete]);

  useMapFitBounds(googleMapRef.current, circleRef.current);

  const getDrawingMode = () => {
    if (mode === "radius" && drawMode)
      return google.maps.drawing.OverlayType.CIRCLE;
    if (mode === "area" && drawMode)
      return google.maps.drawing.OverlayType.POLYGON;
    return null;
  };

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
          drawingMode={getDrawingMode()}
          onCircleComplete={handleCircleComplete}
          onPolygonComplete={handlePolygonComplete}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapContainer;
