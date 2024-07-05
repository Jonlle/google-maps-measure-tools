import Result from "./Result";
import { radiusOptions, RadiusOption } from "../utils/circleUtils";
import InteractiveCircleMap from "./InteractiveCircleMap";
import useCircleMap from "../hooks/useCircleMap";

const CircleMap = () => {
  const {
    drawMode,
    circle,
    radiusSelected,
    radius,
    area,
    perimeter,
    waitingForCenter,
    handleSelectRadiusChange,
    handleDrawClick,
    handleCancelDrawClick,
    handleClearCircleClick,
    handleCircleComplete,
    handleCircleEdit,
  } = useCircleMap({ initialRadiusSelected: 0 });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex justify-start space-x-2">
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
          disabled={drawMode || !!circle || waitingForCenter}
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

      <InteractiveCircleMap
        drawMode={drawMode}
        radiusSelected={radiusSelected}
        waitingForCenter={waitingForCenter}
        onCircleComplete={handleCircleComplete}
        onCircleEdit={handleCircleEdit}
      />
      <Result area={area} perimeter={perimeter} radius={radius} />
    </div>
  );
};

export default CircleMap;
