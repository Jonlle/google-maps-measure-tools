// src/components/Result.tsx
interface ResultProps {
  area: string | null;
  perimeter: string | null;
  radius: string | null;
}

const Result = ({ area, perimeter, radius }: ResultProps) => {
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow-lg">
      {radius && (
        <p className="mb-2">
          <span className="font-semibold">Radio:</span> {radius}
        </p>
      )}
      {area && (
        <p className="mb-2">
          <span className="font-semibold">Área:</span> {area}
        </p>
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
