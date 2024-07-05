import { useState, useRef, useCallback, useEffect } from "react";

export const usePolylineMap = () => {
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [polylines, setPolylines] = useState<google.maps.LatLng[][]>([]);
  const [currentPolyline, setCurrentPolyline] = useState<google.maps.LatLng[]>(
    [],
  );
  const [totalDistance, setTotalDistance] = useState<number>(0);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<google.maps.Marker[]>([]);
  const polylineRefs = useRef<google.maps.Polyline[]>([]);
  const controlPointsRefs = useRef<HTMLDivElement[]>([]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const updateMapCursor = useCallback((newCursor: string | null) => {
    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: newCursor });
    }
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!isDrawingMode || !event.latLng) {
        return;
      }

      const newPath = [...currentPolyline, event.latLng];
      setCurrentPolyline(newPath);

      const marker = new google.maps.Marker({
        position: event.latLng,
        map: mapRef.current,
      });
      markerRefs.current.push(marker);

      if (newPath.length > 1) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          newPath[newPath.length - 2],
          event.latLng,
        );
        setTotalDistance((prevDistance) => prevDistance + distance);
      }
    },
    [currentPolyline, isDrawingMode],
  );

  const handlePolylineLoad = useCallback((polyline: google.maps.Polyline) => {
    polylineRefs.current.push(polyline);
    const controlPointElements = Array.from(
      document.querySelectorAll<HTMLDivElement>(
        'div[style*="cursor: pointer;"]',
      ),
    );
    controlPointsRefs.current.push(...controlPointElements);
  }, []);

  const handleStartDrawing = useCallback(() => {
    setIsDrawingMode(true);
    setCurrentPolyline([]);
    updateMapCursor("crosshair");
  }, [updateMapCursor]);

  const handleStopDrawing = useCallback(() => {
    setIsDrawingMode(false);
    updateMapCursor(null);

    if (currentPolyline.length > 1) {
      setPolylines((previousPolylines) => [
        ...previousPolylines,
        currentPolyline,
      ]);
      setCurrentPolyline([]);
    } else if (currentPolyline.length === 1) {
      setCurrentPolyline([]);
      const controlPointElements = Array.from(
        document.querySelectorAll<HTMLDivElement>(
          'div[style*="cursor: pointer;"]',
        ),
      );
      controlPointsRefs.current.push(...controlPointElements);
    }
  }, [currentPolyline, updateMapCursor]);

  const handleClearDrawing = useCallback(() => {
    polylineRefs.current.forEach((polyline) => polyline.setMap(null));
    markerRefs.current.forEach((marker) => marker.setMap(null));
    controlPointsRefs.current.forEach((controlPoint) => controlPoint.remove());

    polylineRefs.current = [];
    markerRefs.current = [];
    controlPointsRefs.current = [];

    setPolylines([]);
    setCurrentPolyline([]);
    setTotalDistance(0);
  }, []);

  useEffect(() => {
    const updateMarkers = () => {
      markerRefs.current.forEach((marker) => marker.setMap(null));
      markerRefs.current = currentPolyline.map((latLng) => {
        return new google.maps.Marker({
          position: latLng,
          map: mapRef.current,
        });
      });
    };

    if (isDrawingMode) {
      updateMarkers();
    }
  }, [currentPolyline, isDrawingMode]);

  return {
    isDrawingMode,
    setIsDrawingMode,
    polylines,
    currentPolyline,
    totalDistance,
    setTotalDistance,
    handleMapLoad,
    handleMapClick,
    handlePolylineLoad,
    handleStartDrawing,
    handleStopDrawing,
    handleClearDrawing,
  };
};
