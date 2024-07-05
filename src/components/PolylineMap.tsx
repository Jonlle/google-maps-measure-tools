import React from "react";
import InteractivePolylineMap from "./InteractivePolylineMap";
import { usePolylineMap } from "../hooks/usePolylineMap";

const PolylineMap: React.FC = () => {
  const {
    isDrawingMode,
    polylines,
    currentPolyline,
    totalDistance,
    tooltipContent,
    tooltipPosition,
    handleMapLoad,
    handleMapClick,
    handlePolylineLoad,
    handleStartDrawing,
    handleStopDrawing,
    handleClearDrawing,
    handleCurrentPolylineLoad,
    handleCurrentPolylineClick,
    handleCurrentPolylineMouseOver,
    handleCurrentPolylineMouseOut,
  } = usePolylineMap();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex justify-start space-x-2">
        <button
          onClick={handleStartDrawing}
          disabled={isDrawingMode}
          className={`button button--secondary`}
        >
          Dibujar
        </button>
        <button
          onClick={handleStopDrawing}
          disabled={!isDrawingMode}
          className={`button button--secondary`}
        >
          Detener
        </button>
        <button
          onClick={handleClearDrawing}
          disabled={isDrawingMode}
          className={`button button--secondary`}
        >
          Limpiar
        </button>
      </div>
      <InteractivePolylineMap
        isDrawingMode={isDrawingMode}
        polylines={polylines}
        currentPolyline={currentPolyline}
        tooltipContent={tooltipContent}
        tooltipPosition={tooltipPosition}
        handleMapLoad={handleMapLoad}
        handleMapClick={handleMapClick}
        handlePolylineLoad={handlePolylineLoad}
        handleCurrentPolylineLoad={handleCurrentPolylineLoad}
        handleCurrentPolylineClick={handleCurrentPolylineClick}
        handleCurrentPolylineMouseOver={handleCurrentPolylineMouseOver}
        handleCurrentPolylineMouseOut={handleCurrentPolylineMouseOut}
      />
      <div className="mt-4 rounded bg-gray-100 p-4 shadow-lg">
        <div>Distancia total: {(totalDistance / 1000).toFixed(2)} km</div>
      </div>
    </div>
  );
};

export default PolylineMap;
