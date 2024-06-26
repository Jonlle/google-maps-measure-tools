// src/components/GoogleMapContainer.tsx
import React from "react";
import { GoogleMap, useLoadScript, Libraries } from "@react-google-maps/api";

const googleMapProps = {
  mapContainerStyle: {
    width: "100%",
    height: "60vh",
  },
  zoom: 7,
  center: {
    lat: 40.2085,
    lng: -3.713,
  },
};

const libraries: Libraries = ["geometry", "drawing"];

interface GoogleMapContainerProps {
  children?: React.ReactNode;
  mode: "area" | "radius" | null;
}

const GoogleMapContainer: React.FC<GoogleMapContainerProps> = ({
  children,
  mode,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <GoogleMap {...googleMapProps}>
        {mode && children}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapContainer;
