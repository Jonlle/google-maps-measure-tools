import { TLatLng, TLatLngLiteral, TMap, TMarker, TMVCArray, TPolylineOptions } from "../types/googleMapsTypes";

export const polygonOptions: TPolylineOptions = {
  strokeColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
};

function convertLatLngToLatLngLiteral(latLang: TLatLng): TLatLngLiteral {
  return { lat: latLang.lat(), lng: latLang.lng() };
}

const getPolygonPointsFromPaths = (
  paths: google.maps.MVCArray<TMVCArray>,
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
  paths: google.maps.MVCArray<TMVCArray>,
): number => {
  const polygonPoints = getPolygonPointsFromPaths(paths);
  const area = google.maps.geometry.spherical.computeArea(polygonPoints);
  return area;
};

export const calculatePolygonPerimeter = (
  paths: google.maps.MVCArray<TMVCArray>,
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

export function computeSegmentDistance(startLatLng: TLatLngLiteral, endLatLng: TLatLngLiteral): number {
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(startLatLng.lat, startLatLng.lng),
    new google.maps.LatLng(endLatLng.lat, endLatLng.lng)
  );
  return distance;
}

export const calculateTotalDistance = (path: TLatLng[]) => {
  const totalDistance = google.maps.geometry.spherical.computeLength(path);
  return totalDistance;
};

export function placeMarkersOnPolylineSegments(polyline: TLatLng[], map: TMap): TMarker[] {
  const markerLabel = {
    color: 'black',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    className: 'marker-label-shadow',
  };

  let totalDistance = 0;
  const markers: TMarker[] = [];

  for (let i = 1; i < polyline.length; i++) {
    const startLatLng = convertLatLngToLatLngLiteral(polyline[i - 1]);
    const endLatLng = convertLatLngToLatLngLiteral(polyline[i]);

    // Calculate distance between two consecutive points
    const segmentDistance = computeSegmentDistance(startLatLng, endLatLng);
    totalDistance += segmentDistance;

    // Calculate midpoint
    const midPoint = google.maps.geometry.spherical.interpolate(
      new google.maps.LatLng(startLatLng.lat, startLatLng.lng),
      new google.maps.LatLng(endLatLng.lat, endLatLng.lng),
      0.5
    );

    // Create marker for midpoint showing segment distance
    const segmentDistanceMarker = new google.maps.Marker({
      position: midPoint,
      map: map,
      label: {
        ...markerLabel,
        text: `${(segmentDistance / 1000).toFixed(2)} km`,
      },
      icon:'.'
    });

    // Create marker for node showing total distance accumulated
    const totalDistanceMarker = new google.maps.Marker({
      position: endLatLng,
      map: map,
      label: {
        ...markerLabel,
        text: `${(totalDistance / 1000).toFixed(2)} km`,
      },
      icon:'.'
    });


    markers.push(segmentDistanceMarker);
    markers.push(totalDistanceMarker);
  }

  return markers;
}
