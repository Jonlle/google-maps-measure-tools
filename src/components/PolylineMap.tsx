import React, { useState } from "react";
import InteractivePolylineMap from "./InteractivePolylineMap";
import Result from "./Result";
import { useMapDrawing } from "../hooks/useMapDrawing";

export interface PolylineState {
  totalDistance: number | null;
  area: number | null;
}

const PolylineMap: React.FC = () => {
  const [polylineState, setPolylineState] = useState<PolylineState>({
    totalDistance: null,
    area: null,
  });
  const mapDrawing = useMapDrawing();
  const { isDrawing, hasDrawing } = mapDrawing.drawingState;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex justify-start space-x-2">
        <button
          onClick={mapDrawing.handleStartDrawing}
          disabled={isDrawing}
          className="button button--secondary"
        >
          Dibujar
        </button>
        <button
          onClick={mapDrawing.handleStopDrawing}
          disabled={!isDrawing}
          className="button button--secondary"
        >
          Cancelar
        </button>
        <button
          onClick={mapDrawing.handleClearDrawing}
          disabled={!hasDrawing}
          className="button button--secondary"
        >
          Limpiar
        </button>
      </div>
      <InteractivePolylineMap
        setPolylineState={setPolylineState}
        useMapDrawing={mapDrawing}
      />
      <Result polylineState={polylineState} />
    </div>
  );
};

export default PolylineMap;
