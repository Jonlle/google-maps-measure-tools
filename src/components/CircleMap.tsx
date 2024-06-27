// src/components/CircleMap.tsx
import { Circle } from "@react-google-maps/api";

interface CircleMapProps {
  center?: google.maps.LatLngLiteral | null;
  radius?: number;
}

const options = {
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
};

const CircleMap = ({ center, radius }: CircleMapProps) => {
  if (!center || !radius || radius <= 0) {
    return null;
  }

  return (
    <Circle
      center={center}
      radius={radius}
      options={options}
    />
  );
};

export default CircleMap;
