// src/components/GoogleMapContainer.tsx
import { GoogleMap, useLoadScript, Libraries } from "@react-google-maps/api";

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

const libraries: Libraries = ["geometry", "drawing"];

interface GoogleMapContainerProps {
  children?: React.ReactNode;
  mode: "area" | "radius" | null;
  onMapLoad: (map: google.maps.Map) => void;
}

const GoogleMapContainer = ({
  children,
  mode,
  onMapLoad,
}: GoogleMapContainerProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const handleOnLoad = (map: google.maps.Map) => {
    onMapLoad(map);
  };

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <GoogleMap {...googleMapProps} onLoad={handleOnLoad}>
        {mode && children}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapContainer;
