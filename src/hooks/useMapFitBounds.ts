import { useEffect } from "react";
import { TLatLng } from "../types/googleMapsTypes";

const useMapFitBounds = (
  map: google.maps.Map | null,
  center: TLatLng | null | undefined,
  radius: number | null | undefined,
) => {
  useEffect(() => {
    if (map && center && radius) {
      const bounds = new google.maps.LatLngBounds();
      const start = google.maps.geometry.spherical.computeOffset(
        center,
        radius * 1.1,
        225,
      );
      const end = google.maps.geometry.spherical.computeOffset(
        center,
        radius * 1.1,
        45,
      );
      bounds.extend(start);
      bounds.extend(end);
      map.fitBounds(bounds);
    }
  }, [map, center, radius]);
};

export default useMapFitBounds;
