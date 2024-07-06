import React, { useState, useCallback } from "react";
import InteractivePolylineMap from "./InteractivePolylineMap";

type CallbackFunction = () => void;

const PolylineMap: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startDrawingCallback, setStartDrawingCallback] =
    useState<CallbackFunction | null>(null);
  const [stopDrawingCallback, setStopDrawingCallback] =
    useState<CallbackFunction | null>(null);
  const [clearDrawingCallback, setClearDrawingCallback] =
    useState<CallbackFunction | null>(null);

  const onStartDrawing = useCallback(() => {
    if (startDrawingCallback) {
      startDrawingCallback();
    }
  }, [startDrawingCallback]);

  const onStopDrawing = useCallback(() => {
    if (stopDrawingCallback) {
      stopDrawingCallback();
    }
  }, [stopDrawingCallback]);

  const onClearDrawing = useCallback(() => {
    if (clearDrawingCallback) {
      clearDrawingCallback();
    }
  }, [clearDrawingCallback]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex justify-start space-x-2">
        <button
          onClick={onStartDrawing}
          disabled={isDrawing}
          className="button button--secondary"
        >
          Dibujar
        </button>
        <button
          onClick={onStopDrawing}
          disabled={!isDrawing}
          className="button button--secondary"
        >
          Detener
        </button>
        <button
          onClick={onClearDrawing}
          disabled={!hasDrawing}
          className="button button--secondary"
        >
          Limpiar
        </button>
      </div>
      <InteractivePolylineMap
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        setHasDrawing={setHasDrawing}
        setTotalDistance={setTotalDistance}
        setStartDrawingCallback={setStartDrawingCallback}
        setStopDrawingCallback={setStopDrawingCallback}
        setClearDrawingCallback={setClearDrawingCallback}
      />
      <div className="mt-4 rounded bg-gray-100 p-4 shadow-lg">
        <div>Total distance: {(totalDistance / 1000).toFixed(2)} km</div>
      </div>
    </div>
  );
};

export default PolylineMap;
