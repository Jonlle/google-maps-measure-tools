import React, { useState, useCallback } from "react";
import Result from "./Result";
import { radiusOptions, RadiusOption } from "../utils/circleUtils";
import InteractiveCircleMap from "./InteractiveCircleMap";

export type CallbackFunction = () => void;

export interface CircleState {
  radius: number | null;
  area: number | null;
  perimeter: number | null;
}

const CircleMap: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [radiusSelected, setRadiusSelected] = useState<number>(0);
  const [circleState, setCircleState] = useState<CircleState>({
    radius: null,
    area: null,
    perimeter: null,
  });

  const [selectRadiusCallback, setSelectRadiusCallback] =
    useState<CallbackFunction | null>(null);
  const [drawCircleCallback, setDrawCircleCallback] =
    useState<CallbackFunction | null>(null);
  const [cancelDrawCallback, setCancelDrawCallback] =
    useState<CallbackFunction | null>(null);
  const [clearCircleCallback, setClearCircleCallback] =
    useState<CallbackFunction | null>(null);

  const handleSelectRadiusChange = useCallback(() => {
    if (selectRadiusCallback) {
      selectRadiusCallback();
    }
  }, [selectRadiusCallback]);

  const onDrawCircle = useCallback(() => {
    if (drawCircleCallback) {
      drawCircleCallback();
    }
  }, [drawCircleCallback]);

  const onCancelDraw = useCallback(() => {
    if (cancelDrawCallback) {
      cancelDrawCallback();
    }
  }, [cancelDrawCallback]);

  const onClearCircle = useCallback(() => {
    if (clearCircleCallback) {
      clearCircleCallback();
    }
  }, [clearCircleCallback]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex justify-start space-x-2">
        <div className="select">
          <select
            className="select__field"
            value={radiusSelected}
            onChange={handleSelectRadiusChange}
            disabled={hasDrawing && !isDrawing}
          >
            <option value="0" className="select__option" disabled>
              Selecciona un radio
            </option>
            {radiusOptions.map((option: RadiusOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          className="button button--secondary"
          onClick={onDrawCircle}
          disabled={isDrawing}
        >
          Dibujar un círculo
        </button>
        <button
          className="button button--secondary"
          disabled={isDrawing}
          onClick={onCancelDraw}
        >
          Cancelar
        </button>
        <button
          className="button button--secondary"
          disabled={!hasDrawing}
          onClick={onClearCircle}
        >
          Limpiar
        </button>
      </div>

      <InteractiveCircleMap
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        setHasDrawing={setHasDrawing}
        radiusSelected={radiusSelected}
        setRadiusSelected={setRadiusSelected}
        setCircleState={setCircleState}
        setSelectRadiusCallback={setSelectRadiusCallback}
        setDrawCircleCallback={setDrawCircleCallback}
        setCancelDrawCallback={setCancelDrawCallback}
        setClearCircleCallback={setClearCircleCallback}
      />
      <Result circleState={circleState} />
    </div>
  );
};

export default CircleMap;
