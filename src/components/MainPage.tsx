// src/components/MainPage.tsx
import { ChangeEvent, useCallback, useState } from "react";
import GoogleMapContainer from "./GoogleMapContainer";
import Result from "./Result";
import { radiusOptions, RadiusOption } from "../utils/radiusOptions";

type Mode = "area" | "radius" | null;

const MainPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>(null);
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(0);
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [radiusSelected, setRadiusSelected] = useState<number>(0);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setRadiusSelected(0);
    setCircle(null);
    setRadius(null);
  };

  const handleSelectRadiusChange = useCallback(
    ({ target: { value: newRadius } }: ChangeEvent<HTMLSelectElement>) => {
      setRadius(Number(newRadius));
      setRadiusSelected(Number(newRadius));
      setDrawMode(false); // Se desactiva el modo de dibujo
    },
    [],
  );

  const handleDrawClick = () => setDrawMode(true);

  const handleCancelDrawClick = () => setDrawMode(false);

  const handleClearCircleClick = useCallback(() => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
      setDrawMode(false);
      setRadiusSelected(0);
      setRadius(0);
    }
  }, [circle]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Map Measurement Tool</h1>
      <p className="mb-4 text-lg">Selecciona una opción para calcular:</p>
      <div className="mb-4 flex justify-start space-x-2">
        <button
          className={`button button--primary ${mode === "area" ? "button--active" : ""}`}
          onClick={() => handleModeChange("area")}
          disabled={mode === "area"}
        >
          Área
        </button>
        <button
          className={`button button--primary ${mode === "radius" ? "button--active" : ""}`}
          onClick={() => handleModeChange("radius")}
          disabled={mode === "radius"}
        >
          Radio
        </button>
      </div>

      {mode === "radius" && (
        <div className="mb-4 flex space-x-2">
          <div className="select">
            <select
              className="select__field"
              value={radiusSelected}
              onChange={handleSelectRadiusChange}
              disabled={drawMode || !!circle}
            >
              <option value="0" className="select__option" disabled>
                Selecciona un radio
              </option>
              {radiusOptions.map((option: RadiusOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              )
            </select>
          </div>
          <button
            className={`button button--secondary`}
            onClick={handleDrawClick}
            disabled={drawMode || !!circle}
          >
            Dibujar un círculo
          </button>
          {drawMode && (
            <button
              className="button button--secondary"
              onClick={handleCancelDrawClick}
            >
              Cancelar Dibujo
            </button>
          )}
          {circle && (
            <button
              className="button button--secondary"
              onClick={handleClearCircleClick}
            >
              Limpiar Círculo
            </button>
          )}
        </div>
      )}

      <GoogleMapContainer
        mode={mode}
        drawMode={drawMode}
        radiusSelected={radiusSelected}
        onCircleComplete={setCircle}
      />
      <Result area={area} perimeter={perimeter} radius={radius} />
    </div>
  );
};

export default MainPage;
