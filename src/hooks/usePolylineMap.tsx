import { useState, useRef, useCallback, useEffect } from "react";
import { placeMarkersOnPolylineSegments } from "../utils/polygonUtils";

export const usePolylineMap = () => {
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [polylines, setPolylines] = useState<google.maps.LatLng[][]>([]);
  const [currentPolyline, setCurrentPolyline] = useState<google.maps.LatLng[]>(
    [],
  );
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

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

  const handlePolylineClick = useCallback(
    (
      event: google.maps.MapMouseEvent,
      polylinePath: google.maps.LatLng[],
      polylineIndex: number,
    ) => {
      console.log("Polyline Clicked", polylinePath, polylineIndex, event);
    },
    [],
  );

  const handlePolylineMouseOver = useCallback(
    (
      event: google.maps.MapMouseEvent,
      polylinePath: google.maps.LatLng[],
      polylineIndex: number,
    ) => {
      console.log("Polyline MouseOver", polylinePath, polylineIndex, event);
    },
    [],
  );

  const handleCurrentPolylineLoad = useCallback(
    (polyline: google.maps.Polyline) => {
      console.log("Current Polyline Loaded", polyline);
    },
    [],
  );

  const handleCurrentPolylineClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      console.log("Current Polyline Loaded", event);
    },
    [],
  );

  const handleCurrentPolylineMouseOver = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const { clientX, clientY } = event.domEvent as MouseEvent;

      setTooltipPosition({ x: clientX, y: clientY });
      setTooltipContent("Arrastra para cambiar, haz clic para eliminar");
    },
    [],
  );

  const handleCurrentPolylineMouseOut = useCallback(() => {
    setTooltipContent("");
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const updateMarkers = () => {
        markerRefs.current.forEach((marker) => marker.setMap(null)); // Limpiar marcadores existentes
        markerRefs.current = placeMarkersOnPolylineSegments(
          currentPolyline,
          mapRef.current!,
        );
      };
      if (isDrawingMode) {
        updateMarkers();
      }
    }
  }, [currentPolyline, isDrawingMode]);

  return {
    isDrawingMode,
    polylines,
    currentPolyline,
    totalDistance,
    tooltipContent,
    tooltipPosition,
    setIsDrawingMode,
    setTotalDistance,
    handleMapLoad,
    handleMapClick,
    handlePolylineLoad,
    handleStartDrawing,
    handleStopDrawing,
    handleClearDrawing,
    handlePolylineClick,
    handlePolylineMouseOver,
    handleCurrentPolylineLoad,
    handleCurrentPolylineClick,
    handleCurrentPolylineMouseOver,
    handleCurrentPolylineMouseOut,
  };
};
