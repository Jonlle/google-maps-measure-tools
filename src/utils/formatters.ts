/**
 * Formatea una medida lineal (metros) a una cadena legible.
 * @param meters Número de metros a formatear
 * @returns Cadena formateada con la medida en metros o kilómetros
 */
export const formatLinearMeasure = (meters: number | null): string => {
  if (meters === null) return "N/A";

  if (meters < 1000) {
    return `${meters.toFixed(2)} m`;
  } else {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(2)} km`;
  }
};

/**
 * Formatea una medida de área (metros cuadrados) a una cadena legible.
 * @param squareMeters Número de metros cuadrados a formatear
 * @returns Cadena formateada con la medida en metros cuadrados o kilómetros cuadrados
 */
export const formatAreaMeasure = (squareMeters: number | null): string => {
  if (squareMeters === null) return "N/A";

  if (squareMeters < 1000000) {
    return `${squareMeters.toFixed(2)} m²`;
  } else {
    const squareKilometers = squareMeters / 1000000;
    return `${squareKilometers.toFixed(2)} km²`;
  }
};
