import React, { useState, useCallback } from "react";
import Result from "./Result";
import { radiusOptions, RadiusOption } from "../utils/circleUtils";
import InteractiveCircleMap from "./InteractiveCircleMap";
import { useMapDrawing } from "../hooks/useMapDrawing";

export interface CircleState {
  radius: number | null;
  area: number | null;
  perimeter: number | null;
}

const CircleMap: React.FC = () => {
  const [radiusSelected, setRadiusSelected] = useState<number>(0);
  const [circleState, setCircleState] = useState<CircleState>({
    radius: null,
    area: null,
    perimeter: null,
  });

  const handleSelectRadiusChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRadius = Number(event.target.value);
      setRadiusSelected(newRadius);
    },
    [],
  );

  const mapDrawing = useMapDrawing();
  const { isDrawing, hasDrawing } = mapDrawing.drawingState;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="select w-full sm:w-auto">
          <select
            className="select__field w-full sm:w-auto"
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
          className="button button--secondary w-full sm:w-auto"
          onClick={mapDrawing.handleStartDrawing}
          disabled={isDrawing}
        >
          {circleState.radius ? "Editar" : "Dibujar"}
        </button>
        <button
          className="button button--secondary w-full sm:w-auto"
          onClick={mapDrawing.handleStopDrawing}
          disabled={!isDrawing}
        >
          Cancelar
        </button>
        <button
          className="button button--secondary w-full sm:w-auto"
          onClick={mapDrawing.handleClearDrawing}
          disabled={!hasDrawing}
        >
          Limpiar
        </button>
      </div>

      <InteractiveCircleMap
        setCircleState={setCircleState}
        useMapDrawing={mapDrawing}
        radiusSelected={radiusSelected}
        setRadiusSelected={setRadiusSelected}
      />
      <Result circleState={circleState} />
    </div>
  );
};

export default CircleMap;
