import GoogleMapContainer from "./GoogleMapContainer";
import Result from "./Result";
import useMapControls from "../hooks/useMapControls";
import { radiusOptions, RadiusOption } from "../utils/circleUtils";

const MainPage = () => {
  const {
    mode,
    drawMode,
    circle,
    polygon,
    radiusSelected,
    radius,
    area,
    perimeter,
    handleModeChange,
    handleSelectRadiusChange,
    handleDrawClick,
    handleCancelDrawClick,
    handleClearCircleClick,
    handleClearLastPointClick,
    handleClearPolygonClick,
    handleCircleComplete,
    handlePolygonComplete,
  } = useMapControls({ initialMode: null, initialRadiusSelected: 0 });

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Map Measurement Tool</h1>
      <p className="mb-4 text-lg">Selecciona una opción para calcular:</p>
      <div className="mb-4 flex justify-start space-x-2">
        <button
          className={`button button--primary ${
            mode === "area" ? "button--active" : ""
          }`}
          onClick={() => handleModeChange("area")}
          disabled={mode === "area"}
        >
          Área
        </button>
        <button
          className={`button button--primary ${
            mode === "radius" ? "button--active" : ""
          }`}
          onClick={() => handleModeChange("radius")}
          disabled={mode === "radius"}
        >
          Radio
        </button>
      </div>

      {mode === "area" && (
        <div className="mb-4 flex justify-start space-x-2">
          <button
            className="button button--secondary"
            onClick={handleDrawClick}
            disabled={drawMode || !!polygon}
          >
            Dibujar un polígono
          </button>
          {drawMode && (
            <button
              className="button button--secondary"
              onClick={handleCancelDrawClick}
            >
              Cancelar dibujo
            </button>
          )}
          {polygon && (
            <>
              <button
                className="button button--secondary"
                onClick={handleClearLastPointClick}
                disabled={
                  !polygon.getPath() || polygon.getPath().getLength() === 0
                }
              >
                Limpiar último punto
              </button>
              <button
                className="button button--secondary"
                onClick={handleClearPolygonClick}
                disabled={!polygon}
              >
                Limpiar todo
              </button>
            </>
          )}
        </div>
      )}

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
              Cancelar dibujo
            </button>
          )}
          {circle && (
            <button
              className="button button--secondary"
              onClick={handleClearCircleClick}
            >
              Limpiar círculo
            </button>
          )}
        </div>
      )}

      <GoogleMapContainer
        mode={mode}
        drawMode={drawMode}
        radiusSelected={radiusSelected}
        onCircleComplete={handleCircleComplete}
        onPolygonComplete={handlePolygonComplete}
      />
      <Result area={area} perimeter={perimeter} radius={radius} />
    </div>
  );
};

export default MainPage;
