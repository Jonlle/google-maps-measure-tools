import React from 'react';

interface ResultProps {
  area: string | null;
  perimeter: string | null;
  radius: string | null;
}

const Result: React.FC<ResultProps> = ({ area, perimeter, radius }) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow-lg">
      {area && (
        <div className="mb-2">
          <h2 className="text-xl font-semibold">Área:</h2>
          <p>{area}</p>
        </div>
      )}
      {perimeter && (
        <div className="mb-2">
          <h2 className="text-xl font-semibold">Perímetro:</h2>
          <p>{perimeter}</p>
        </div>
      )}
      {radius && (
        <div className="mb-2">
          <h2 className="text-xl font-semibold">Radio:</h2>
          <p>{radius}</p>
        </div>
      )}
      {!area && !perimeter && !radius && (
        <div className="text-gray-600">
          <p>No hay datos de medición disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default Result;
