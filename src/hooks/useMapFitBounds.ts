import { useEffect } from "react";

const useMapFitBounds = (
  map: google.maps.Map | null,
  circle: google.maps.Circle | null,
) => {
  useEffect(() => {
    if (map && circle) {
      const circleCenter = circle.getCenter()!;
      const circleRadius = circle.getRadius();

      const bounds = new google.maps.LatLngBounds();
      const start = google.maps.geometry.spherical.computeOffset(
        circleCenter,
        circleRadius * 1.1,
        225,
      );
      const end = google.maps.geometry.spherical.computeOffset(
        circleCenter,
        circleRadius * 1.1,
        45,
      );
      bounds.extend(start);
      bounds.extend(end);
      map.fitBounds(bounds);
    }
  }, [map, circle]);
};

export default useMapFitBounds;
