// src/components/MainPage.tsx
import { useState } from "react";
import GoogleMapContainer from "./GoogleMapContainer";
import CircleMap from "./CircleMap";
import Result from "./Result";

type Mode = "area" | "radius" | null;

const MainPage = () => {
  const [mode, setMode] = useState<Mode>(null);
  const [radius, setRadius] = useState<number>(0);
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setRadius(0);
    setDrawMode(false);
    setCenter(null);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRadius(Number(e.target.value));
    if (map) {
      setCenter({
        lat: map.getCenter()!.lat(),
        lng: map.getCenter()!.lng(),
      });
    }
  };

  const handleDrawClick = () => {
    setDrawMode(true);
  };

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
    if (mode === "radius") {
      setCenter({
        lat: map.getCenter()!.lat(),
        lng: map.getCenter()!.lng(),
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Map Measurement Tool</h1>
      <p className="mb-4 text-lg">Selecciona una opción para calcular:</p>
      <div className="mb-4 flex justify-start space-x-2">
        <button
          className={`button button--primary ${mode === "area" ? "button--active" : ""}`}
          onClick={() => handleModeChange("area")}
        >
          Área
        </button>
        <button
          className={`button button--primary ${mode === "radius" ? "button--active" : ""}`}
          onClick={() => handleModeChange("radius")}
        >
          Radio
        </button>
      </div>

      {mode === "radius" && (
        <div className="mb-4">
          <button
            className="button button--secondary"
            onClick={handleDrawClick}
          >
            Dibujar un círculo
          </button>
          <select
            className="ml-2 rounded border border-gray-300 p-2"
            value={radius}
            onChange={handleRadiusChange}
          >
            <option value="0">Selecciona un radio</option>
            <option value="50">50 m</option>
            <option value="100">100 m</option>
            <option value="200">200 m</option>
            <option value="300">300 m</option>
            <option value="400">400 m</option>
            <option value="500">500 m</option>
            <option value="1000">1 km</option>
            <option value="2000">2 km</option>
            <option value="3000">3 km</option>
            <option value="4000">4 km</option>
            <option value="5000">5 km</option>
            <option value="6000">6 km</option>
            <option value="7000">7 km</option>
            <option value="8000">8 km</option>
            <option value="9000">9 km</option>
            <option value="10000">10 km</option>
            <option value="15000">15 km</option>
            <option value="20000">20 km</option>
            <option value="25000">25 km</option>
            <option value="30000">30 km</option>
            <option value="35000">35 km</option>
            <option value="40000">40 km</option>
            <option value="45000">45 km</option>
            <option value="50000">50 km</option>
            <option value="100000">100 km</option>
          </select>
        </div>
      )}

      <GoogleMapContainer mode={mode} onMapLoad={handleMapLoad}>
        {mode === "radius" && map && (
          <CircleMap center={center} radius={drawMode ? 0 : radius} />
        )}
      </GoogleMapContainer>
      <Result area={null} perimeter={null} radius={null} />
    </div>
  );
};

export default MainPage;
