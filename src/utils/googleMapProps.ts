import { CSSProperties } from "react";
import { Libraries } from "@react-google-maps/api";

interface GoogleMapProps {
  mapContainerStyle: CSSProperties;
  zoom: number;
  center: google.maps.LatLng | google.maps.LatLngLiteral;
  options?: google.maps.MapOptions;
}

export const libraries: Libraries = ["geometry", "drawing", "marker"];

export const googleMapProps: GoogleMapProps = {
  mapContainerStyle: {
    width: "100%",
    height: "60vh",
  },
  center: {
    lat: 40.41831,
    lng: -3.70275,
  },
  zoom: 10,
  options: {
    disableDefaultUI: true,
    zoomControl: true,
  },
};
