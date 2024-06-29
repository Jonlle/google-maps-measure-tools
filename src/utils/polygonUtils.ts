export const polygonOptions = {
  strokeColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#0000FF",
  fillOpacity: 0.35,
};

const getPolygonPointsFromPaths = (
  paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>,
): google.maps.LatLng[] => {
  const polygonPoints: google.maps.LatLng[] = [];
  paths.forEach((path) => {
    path.forEach((latLng) => {
      polygonPoints.push(latLng);
    });
  });
  return polygonPoints;
};

export const calculatePolygonArea = (
  paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>,
): number => {
  const polygonPoints = getPolygonPointsFromPaths(paths);
  const area = google.maps.geometry.spherical.computeArea(polygonPoints);
  return area;
};

export const calculatePolygonPerimeter = (
  paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>,
): number => {
  const polygonPoints = getPolygonPointsFromPaths(paths);
  const perimeter =
    google.maps.geometry.spherical.computeLength(polygonPoints) +
    google.maps.geometry.spherical.computeDistanceBetween(
      polygonPoints[polygonPoints.length - 1],
      polygonPoints[0],
    );
  return perimeter;
};
