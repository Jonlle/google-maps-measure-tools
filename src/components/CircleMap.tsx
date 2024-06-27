// src/components/CircleMap.tsx
import React, { useEffect, useState } from "react";
import { Circle } from "@react-google-maps/api";

interface CircleMapProps {
  map: google.maps.Map;
  center?: google.maps.LatLngLiteral | null;
  radius?: number;
}

const CircleMap: React.FC<CircleMapProps> = ({ map, center, radius }) => {
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  useEffect(() => {
    if (circle) {
      circle.setMap(null);
    }

    if (!map || !center || !radius || radius < 0) {
      setCircle(null);
      return;
    }

    const newCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center,
      radius,
    });

    setCircle(newCircle);

    return () => {
      newCircle.setMap(null);
    };
  }, [map, center, radius]);

  return null;
};

export default CircleMap;
