// src/components/CircleMap.tsx
import { useState, useEffect } from "react";
import { Circle } from "@react-google-maps/api";

interface CircleMapProps {
  map: google.maps.Map;
  center?: google.maps.LatLngLiteral;
  radius?: number;
}

const CircleMap: React.FC<CircleMapProps> = ({ map, center, radius }) => {
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLngLiteral | null>(center || null);
  const [circleRadius, setCircleRadius] = useState<number>(radius || 0);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setCircleCenter({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };
  useEffect(() => {
    if (center && radius && radius > 0) {
      setCircleCenter(center);
      setCircleRadius(radius);
    }
  }, [center, radius]);

  useEffect(() => {
    if (map) {
      map.addListener("click", handleMapClick);
    }

    return () => {
      if (map) {
        google.maps.event.clearListeners(map, "click");
      }
    };
  }, [map]);
  

  return (
    <>
      {circleCenter && circleRadius > 0 && (
        <Circle
          center={circleCenter}
          radius={circleRadius}
        />
      )}
    </>
  );
};

export default CircleMap;
