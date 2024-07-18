import { useState, useCallback } from "react";

export type CallbackFunction = () => void;

export interface MapDrawingState {
  isDrawing: boolean;
  hasDrawing: boolean;
}

export interface MapDrawingCallbacks {
  startDrawingCallback: CallbackFunction | null;
  stopDrawingCallback: CallbackFunction | null;
  clearDrawingCallback: CallbackFunction | null;
}

export interface UseMapDrawing {
  drawingState: MapDrawingState;
  setIsDrawing: (isDrawing: boolean) => void;
  setHasDrawing: (hasDrawing: boolean) => void;
  setCallbacks: React.Dispatch<React.SetStateAction<MapDrawingCallbacks>>;
  handleStartDrawing: () => void;
  handleStopDrawing: () => void;
  handleClearDrawing: () => void;
}

export const useMapDrawing = (): UseMapDrawing => {
  const [drawingState, setDrawingState] = useState<MapDrawingState>({
    isDrawing: false,
    hasDrawing: false,
  });

  const [callbacks, setCallbacks] = useState<MapDrawingCallbacks>({
    startDrawingCallback: null,
    stopDrawingCallback: null,
    clearDrawingCallback: null,
  });

  const setIsDrawing = useCallback((isDrawing: boolean) => {
    setDrawingState((prev) => ({ ...prev, isDrawing }));
  }, []);

  const setHasDrawing = useCallback((hasDrawing: boolean) => {
    setDrawingState((prev) => ({ ...prev, hasDrawing }));
  }, []);

  const handleStartDrawing = useCallback(() => {
    if (callbacks.startDrawingCallback) {
      callbacks.startDrawingCallback();
    }
  }, [callbacks]);

  const handleStopDrawing = useCallback(() => {
    if (callbacks.stopDrawingCallback) {
      callbacks.stopDrawingCallback();
    }
  }, [callbacks]);

  const handleClearDrawing = useCallback(() => {
    if (callbacks.clearDrawingCallback) {
      callbacks.clearDrawingCallback();
    }
  }, [callbacks]);

  return {
    drawingState,
    setIsDrawing,
    setHasDrawing,
    setCallbacks,
    handleStartDrawing,
    handleStopDrawing,
    handleClearDrawing,
  };
};
