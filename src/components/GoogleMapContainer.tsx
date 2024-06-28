// src/components/GoogleMapContainer.tsx
import {
  GoogleMap,
  useLoadScript,
  Libraries,
  DrawingManager,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { circleOptions } from "../utils/circleUtils";

interface GoogleMapContainerProps {
  mode: "area" | "radius" | null;
  drawMode: boolean;
  radiusSelected: number;
  onCircleComplete: (circle: google.maps.Circle) => void;
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

const polygonOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
};

const GoogleMapContainer = ({
  mode,
  drawMode,
  radiusSelected,
  onCircleComplete,
}: GoogleMapContainerProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
    console.log("map", map);
    console.log("mode", mode);
  };

  const onLoad = (drawingManager: google.maps.drawing.DrawingManager) => {
    console.log(drawingManager);
  };

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    console.log("handlePolygonComplete", polygon);
  };

  useEffect(() => {
    if (map && radiusSelected > 0) {
      const center = map.getCenter();
      const circle = new google.maps.Circle({
        ...circleOptions,
        map,
        center: center!,
        radius: radiusSelected,
      });
      onCircleComplete(circle);
    }
  }, [radiusSelected, map, onCircleComplete]);

  const getDrawingMode = () => {
    if (mode === "radius" && drawMode)
      return google.maps.drawing.OverlayType.CIRCLE;
    if (mode === "area") return google.maps.drawing.OverlayType.POLYGON;
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
            drawingControl: false,
            map: map,
            polygonOptions: polygonOptions,
          }}
          drawingMode={getDrawingMode()}
          onCircleComplete={onCircleComplete}
          onPolygonComplete={handlePolygonComplete}
          onLoad={onLoad}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapContainer;
