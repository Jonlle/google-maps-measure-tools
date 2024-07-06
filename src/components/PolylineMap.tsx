import React, { useState, useCallback } from "react";
import InteractivePolylineMap from "./InteractivePolylineMap";
import Result from "./Result";

type CallbackFunction = () => void;

const PolylineMap: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [area, setArea] = useState<number>(0);
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
          Cancelar
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
        setArea={setArea}
        setStartDrawingCallback={setStartDrawingCallback}
        setStopDrawingCallback={setStopDrawingCallback}
        setClearDrawingCallback={setClearDrawingCallback}
      />
      <Result area={area} totalDistance={totalDistance} />
    </div>
  );
};

export default PolylineMap;
