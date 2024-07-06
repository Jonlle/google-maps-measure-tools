import React from "react";
import InteractivePolylineMap from "./InteractivePolylineMap";
import { usePolylineMap } from "../hooks/usePolylineMap";

const PolylineMap: React.FC = () => {
  const {
    isDrawingMode,
    mapRef,
    polylinePath,
    totalDistance,
    tooltipContent,
    tooltipPosition,
    handleMapLoad,
    handleMapClick,
    startDrawing,
    stopDrawing,
    clearDrawing,
    handlePolylineLoad,
    handlePolylineClick,
    handlePolylineMouseOver,
    handlePolylineMouseOut,
    handlePolylineMouseDown,
    handlePolylineMouseUp,
  } = usePolylineMap();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex justify-start space-x-2">
        <button
          onClick={startDrawing}
          disabled={isDrawingMode}
          className={`button button--secondary`}
        >
          Dibujar
        </button>
        <button
          onClick={stopDrawing}
          disabled={!isDrawingMode}
          className={`button button--secondary`}
        >
          Detener
        </button>
        <button
          onClick={clearDrawing}
          disabled={polylinePath.length === 0}
          className={`button button--secondary`}
        >
          Limpiar
        </button>
      </div>
      <InteractivePolylineMap
        isDrawingMode={isDrawingMode}
        map={mapRef.current}
        polylinePath={polylinePath}
        tooltipContent={tooltipContent}
        tooltipPosition={tooltipPosition}
        handleMapLoad={handleMapLoad}
        handleMapClick={handleMapClick}
        handlePolylineLoad={handlePolylineLoad}
        handlePolylineClick={handlePolylineClick}
        handlePolylineMouseOver={handlePolylineMouseOver}
        handlePolylineMouseOut={handlePolylineMouseOut}
        handlePolylineMouseDown={handlePolylineMouseDown}
        handlePolylineMouseUp={handlePolylineMouseUp}
      />
      <div className="mt-4 rounded bg-gray-100 p-4 shadow-lg">
        <div>Distancia total: {(totalDistance / 1000).toFixed(2)} km</div>
      </div>
    </div>
  );
};

export default PolylineMap;
