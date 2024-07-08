import React from "react";
import { formatAreaMeasure, formatLinearMeasure } from "../utils/formatters";
import { PolylineState } from "./PolylineMap";
import { CircleState } from "./CircleMap";

interface ResultProps {
  circleState?: CircleState;
  polylineState?: PolylineState;
}

const Result: React.FC<ResultProps> = ({ circleState, polylineState }) => {
  if (circleState) {
    const { radius, area, perimeter } = circleState;
    return (
      <div className="mt-4 rounded bg-gray-100 p-4 shadow-lg">
        <p className="mb-2">Radio: {formatLinearMeasure(radius)}</p>
        <p className="mb-2">Área: {formatAreaMeasure(area)}</p>
        <p className="mb-2">Perímetro: {formatLinearMeasure(perimeter)}</p>
      </div>
    );
  }

  if (polylineState) {
    const { totalDistance, area } = polylineState;
    return (
      <div className="mt-4 rounded bg-gray-100 p-4 shadow-lg">
        <p className="mb-2">
          Distancia total: {formatLinearMeasure(totalDistance)}
        </p>
        <p className="mb-2">Área: {formatAreaMeasure(area)}</p>
      </div>
    );
  }

  return null;
};

export default Result;
