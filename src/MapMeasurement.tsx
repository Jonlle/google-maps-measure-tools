import React, { useState, useCallback, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Polygon,
  Circle,
  Libraries,
  Marker,
  Polyline,
} from "@react-google-maps/api";

type Mode = "area" | "radius";
type LatLng = google.maps.LatLngLiteral;
type Measurement = {
  area: string | null;
  perimeter: string | null;
  radius: string | null;
};

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
};

const centerGMap = {
  lat: 40.2085,
  lng: -3.713,
};

const libraries: Libraries = ["geometry", "drawing"];

const MapMeasurement: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [mapKey, setMapKey] = useState<number>(0);

  const [mode, setMode] = useState<Mode>("area");
  const [points, setPoints] = useState<LatLng[]>([]);
  const [center, setCenter] = useState<LatLng | null>(null);
  const [radius, setRadius] = useState<number>(0);
  const [measurement, setMeasurement] = useState<Measurement>({
    area: null,
    perimeter: null,
    radius: null,
  });

  const cursorStyle =
    mode === "area" || mode === "radius" ? "crosshair" : "default";

  const calculateArea = useCallback((polygonPoints: LatLng[]) => {
    if (polygonPoints.length < 3) return;
    const area = google.maps.geometry.spherical.computeArea(
      polygonPoints.map((point) => new google.maps.LatLng(point.lat, point.lng))
    );
    const areaM2 = area.toFixed(0);
    const areaKm2 = (area / 1000000).toFixed(2);
    setMeasurement((prevMeasurement) => ({
      ...prevMeasurement,
      area: `${areaM2} m² | ${areaKm2} km²`,
    }));
  }, []);

  const calculatePerimeter = useCallback((polygonPoints: LatLng[]) => {
    if (polygonPoints.length < 2) return;
    let perimeter = 0;
    for (let i = 0; i < polygonPoints.length - 1; i++) {
      const point1 = polygonPoints[i];
      const point2 = polygonPoints[i + 1];
      perimeter += google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(point1),
        new google.maps.LatLng(point2)
      );
    }
    perimeter += google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(polygonPoints[0]),
      new google.maps.LatLng(polygonPoints[polygonPoints.length - 1])
    );
    const perimeterM = perimeter.toFixed(0);
    const perimeterKm = (perimeter / 1000).toFixed(2);
    setMeasurement((prevMeasurement) => ({
      ...prevMeasurement,
      perimeter: `${perimeterM} m | ${perimeterKm} km`,
    }));
  }, []);

  const calculateRadius = useCallback((newRadius: number) => {
    const area = Math.PI * newRadius * newRadius;
    const areaM2 = area.toFixed(0);
    const areaKm2 = (area / 1000000).toFixed(2);
    const radiusKm = (newRadius / 1000).toFixed(2);
    setMeasurement((prevMeasurement) => ({
      ...prevMeasurement,
      area: `${areaM2} m² | ${areaKm2} km²`,
      radius: `${newRadius} m | ${radiusKm} km`,
    }));
  }, []);

  const resetMeasurement = useCallback(() => {
    setPoints([]);
    setCenter(null);
    setRadius(0);
    setMeasurement({ area: null, perimeter: null, radius: null });
    setMapKey((prevKey) => prevKey + 1);
  }, []);

  const handleModeChange = (newMode: Mode) => {
    resetMeasurement();
    setMode(newMode);
  };

  const polygonOptions = useMemo(
    () => ({
      fillColor: "blue",
      fillOpacity: 0.2,
      strokeColor: "blue",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    }),
    []
  );

  const circleOptions = useMemo(
    () => ({
      fillColor: "blue",
      fillOpacity: 0.2,
      strokeColor: "blue",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    }),
    []
  );

  const polylineOptions = useMemo(
    () => ({
      strokeColor: "blue",
      strokeOpacity: 1,
      strokeWeight: 2,
    }),
    []
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };

      if (mode === "area") {
        setPoints((current) => [...current, newPoint]);
        if (points.length >= 2) {
          calculateArea([...points, newPoint]);
          calculatePerimeter([...points, newPoint]);
        }
      } else if (mode === "radius") {
        if (!center) {
          setCenter(newPoint);
        } else {
          const newRadius =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(center),
              event.latLng
            );
          setRadius(newRadius);
          calculateRadius(newRadius);
        }
      }
    },
    [mode, points, calculateArea, calculatePerimeter, center, calculateRadius]
  );

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  const nodeIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="white" stroke="black" stroke-width="1"/></svg>',
    scaledSize: new google.maps.Size(10, 10),
    anchor: new google.maps.Point(5, 5), // Center the icon
  };

  return (
    <div className="map-container">
      <div className="button-container">
        <button
          className={`map-button ${mode === "area" ? "active" : ""}`}
          onClick={() => handleModeChange("area")}
          disabled={mode === "area"}
        >
          Área
        </button>
        <button
          className={`map-button ${mode === "radius" ? "active" : ""}`}
          onClick={() => handleModeChange("radius")}
          disabled={mode === "radius"}
        >
          Radio
        </button>
        <button className="map-button" onClick={resetMeasurement}>
          Reiniciar
        </button>
      </div>
      <div className="google-map-container">
        <GoogleMap
          key={mapKey}
          mapContainerStyle={{ ...mapContainerStyle, cursor: cursorStyle }}
          zoom={7}
          center={centerGMap}
          onClick={handleMapClick}
        >
          {mode === "area" && (
            <>
              {points.map((point, index) => (
                <Marker key={index} position={point} icon={nodeIcon} />
              ))}
              {points.length > 1 && (
                <Polyline path={points} options={polylineOptions} />
              )}
              {points.length > 2 && (
                <Polygon paths={points} options={polygonOptions} />
              )}
            </>
          )}
          {mode === "radius" && center && (
            <>
              <Circle center={center} radius={radius} options={circleOptions} />
              <Marker position={center} icon={nodeIcon} />
            </>
          )}
        </GoogleMap>
      </div>

      <div className="result-container">
        {measurement.radius && (
          <p>
            <strong>Radio:</strong> {measurement.radius}
          </p>
        )}
        {measurement.area && (
          <p>
            <strong>Área:</strong> {measurement.area}
          </p>
        )}
        {measurement.perimeter && (
          <p>
            <strong>Distancia total:</strong> {measurement.perimeter}
          </p>
        )}
      </div>
    </div>
  );
};

export default MapMeasurement;
