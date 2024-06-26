// src/components/MainPage.tsx
import React, { useState } from "react";
import GoogleMapContainer from "./GoogleMapContainer";
// import CircleMap from "./CircleMap";
// import PolygonMap from "./PolygonMap";
import Result from './Result';

type Mode = "area" | "radius" | null;

const MainPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>(null);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Map Measurement Tool</h1>
      <p className="text-lg mb-4">Selecciona una opción para calcular:</p>
      <div className="mb-4 flex justify-start space-x-2">
        <button
          className={`btn btn--primary ${mode === 'area' ? 'active' : ''}`}
          onClick={() => handleModeChange("area")}
        >
          Área
        </button>
        <button
          className={`btn btn--primary ${mode === 'radius' ? 'active' : ''}`}
          onClick={() => handleModeChange("radius")}
        >
          Radio
        </button>
      </div>
      <GoogleMapContainer mode={mode}>
        {/* {mode === "area" ? <PolygonMap /> : <CircleMap />}
        < */}
      </GoogleMapContainer>
      <Result area={null} perimeter={null} radius={null}/>
    </div>
  );
};

export default MainPage;
