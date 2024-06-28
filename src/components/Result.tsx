interface ResultProps {
  area: number | null;
  perimeter: number | null;
  radius: number | null;
}

const Result = ({ radius, area, perimeter }: ResultProps) => {
  const formatRadius = (radius: number) => {
    const radiusInKilometers = (radius / 1000).toFixed(2);
    return `${radius.toFixed(0)} m | ${radiusInKilometers} km`;
  };

  const formatArea = (area: number) => {
    const areaInSquareKilometers = (area / 1e6).toFixed(2);
    return `${area.toFixed(0)} m² | ${areaInSquareKilometers} km²`;
  };

  const formatPerimeter = (perimeter: number) => {
    const perimeterInKilometers = (perimeter / 1000).toFixed(2);
    return `${perimeter.toFixed(0)} m | ${perimeterInKilometers} km`;
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow-lg">
      {radius ? (
        <p className="mb-2">
          <span className="font-semibold">Radio:</span> {formatRadius(radius)}
        </p>
      ) : null}
      {area ? (
        <p className="mb-2">
          <span className="font-semibold">Área:</span> {formatArea(area)}
        </p>
      ) : null}
      {perimeter ? (
        <p className="mb-2">
          <span className="font-semibold">Perímetro:</span> {formatPerimeter(perimeter)}
        </p>
      ) : null}
      {!area && !perimeter && !radius ? (
        <div className="text-gray-600">
          <p>No hay datos de medición disponibles.</p>
        </div>
      ) : null}
    </div>
  );
};

export default Result;
