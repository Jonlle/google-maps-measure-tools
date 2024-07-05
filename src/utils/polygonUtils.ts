export const polygonOptions = {
  strokeColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#0000FF",
  fillOpacity: 0.35,
};

function convertLatLngToLatLngLiteral(latLang: google.maps.LatLng): google.maps.LatLngLiteral {
  return { lat: latLang.lat(), lng: latLang.lng() };
}

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

export function computeSegmentDistance(startLatLng: google.maps.LatLngLiteral, endLatLng: google.maps.LatLngLiteral): number {
  // Using Google Maps geometry library to compute distance
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(startLatLng.lat, startLatLng.lng),
    new google.maps.LatLng(endLatLng.lat, endLatLng.lng)
  );
  return distance;
}

export function placeMarkersOnPolylineSegments(polyline: google.maps.LatLng[], map: google.maps.Map): google.maps.Marker[] {
  const markerLabel = {
    color: 'black',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    className: 'marker-label-shadow',
  };

  let totalDistance = 0;
  const markers: google.maps.Marker[] = [];

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

  console.log('Total distance:', totalDistance / 1000, 'km');
  return markers;
}
