import React from "react";
import { useMapMode } from "../hooks/useMapMode";
import PolylineMap from "./PolylineMap";
import CircleMap from "./CircleMap";

const MainPage: React.FC = () => {
  const { mode, handleModeChange } = useMapMode();
  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Herramienta de Medición de Mapa
      </h1>
      <p className="mb-4 text-lg">Selecciona una opción para calcular:</p>
      <div className="mb-4 flex justify-start space-x-2">
        <button
          className={`button button--primary ${mode === "area" ? "button--active" : ""}`}
          onClick={() => handleModeChange("area")}
          disabled={mode === "area"}
        >
          Distancia
        </button>
        <button
          className={`button button--primary ${mode === "radius" ? "button--active" : ""}`}
          onClick={() => handleModeChange("radius")}
          disabled={mode === "radius"}
        >
          Radio
        </button>
      </div>

      {mode === "area" && <PolylineMap />}
      {mode === "radius" && <CircleMap />}
    </div>
  );
};

export default MainPage;
