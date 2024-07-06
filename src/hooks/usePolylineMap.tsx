import { useState, useRef, useCallback, useEffect } from "react";
import {
  calculateTotalDistance,
  placeMarkersOnPolylineSegments,
} from "../utils/polylineUtils";
import {
  TLatLng,
  TMap,
  TMapMouseEvent,
  TMarker,
  TPolyline,
} from "../types/googleMapsTypes";

const MIN_MOVE_DISTANCE = 10;
const MIN_CLICK_DISTANCE = 10;
const MIN_HOVER_DISTANCE = 8;

export const usePolylineMap = () => {
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [polylinePath, setPolylinePath] = useState<TLatLng[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [clickStartPosition, setClickStartPosition] =
    useState<google.maps.LatLng | null>(null);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const mapRef = useRef<TMap | null>(null);
  const polylineRef = useRef<TPolyline | null>(null);
  const markerRefs = useRef<TMarker[]>([]);

  const handleMapLoad = useCallback((map: TMap) => {
    mapRef.current = map;
  }, []);

  const handlePolylineLoad = useCallback((polyline: TPolyline) => {
    polylineRef.current = polyline;
    const polylinePath = polyline.getPath().getArray();
    setPolylinePath(polylinePath);
  }, []);

  const updateMapCursor = useCallback((newCursor: string | null) => {
    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: newCursor });
    }
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const { latLng } = event;
      if (!isDrawingMode || !latLng) {
        return;
      }
      setPolylinePath((previousPath) => [...previousPath, latLng]);
    },
    [isDrawingMode],
  );

  const startDrawing = useCallback(() => {
    setIsDrawingMode(true);
    updateMapCursor("crosshair");
  }, [updateMapCursor]);

  const stopDrawing = useCallback(() => {
    setIsDrawingMode(false);
    updateMapCursor(null);
  }, [updateMapCursor]);

  const clearDrawing = useCallback(() => {
    setPolylinePath([]);
    setTotalDistance(0);
  }, []);

  const handlePolylineClick = useCallback(
    (event: TMapMouseEvent) => {
      const { latLng } = event;
      const closestDistance = MIN_CLICK_DISTANCE;
      setTooltipContent("");

      if (!latLng) return;

      const clickedIndex = polylinePath.findIndex((vertex) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          latLng,
          vertex,
        );
        return distance < closestDistance;
      });

      if (clickedIndex === -1) return;

      if (clickedIndex === 0 && polylinePath.length > 2) {
        const closedPath = [...polylinePath, polylinePath[0]];
        setPolylinePath(closedPath);
        setIsDrawingMode(false);
      } else if (clickedIndex > 0) {
        const updatedPath = polylinePath.filter(
          (_, index) => index !== clickedIndex,
        );
        setPolylinePath(updatedPath);
      }
    },
    [polylinePath],
  );

  const handlePolylineMouseOver = useCallback(
    (event: TMapMouseEvent) => {
      const { latLng } = event;
      const { clientX, clientY } = event.domEvent as MouseEvent;

      if (!latLng) {
        return;
      }

      const minDistance = MIN_HOVER_DISTANCE;
      let tooltip = "";

      const nearestIndex = polylinePath.findIndex((point) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          latLng,
          point,
        );
        return distance < minDistance;
      });

      if (nearestIndex !== -1) {
        if (nearestIndex > 0) {
          tooltip = "Arrastra para cambiar, Click para eliminar";
        } else {
          tooltip =
            polylinePath.length > 2
              ? "Click para encerrar, arrastra para cambiar"
              : "Arrastra para cambiar";
        }
      } else {
        polylinePath.some((point, index) => {
          if (index === 0) return false;

          const previousPoint = polylinePath[index - 1];
          const midpoint = new google.maps.LatLng(
            (point.lat() + previousPoint.lat()) / 2,
            (point.lng() + previousPoint.lng()) / 2,
          );

          const distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              latLng,
              midpoint,
            );

          if (distance < minDistance) {
            tooltip = "Arrastra para cambiar";
            return true;
          }
          return false;
        });
      }

      setTooltipPosition({ x: clientX, y: clientY });
      setTooltipContent(tooltip);
    },
    [polylinePath],
  );

  const handlePolylineMouseOut = useCallback(() => {
    setTooltipContent("");
  }, []);

  const handlePolylineMouseDown = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const { latLng } = event;
      if (latLng) {
        setIsMouseDown(true);
        setClickStartPosition(latLng);
      }
    },
    [],
  );

  const handlePolylineMouseUp = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!polylineRef.current || !event.latLng) {
        setIsMouseDown(false);
        setClickStartPosition(null);
        return;
      }

      if (isMouseDown && clickStartPosition) {
        const moveDistance =
          google.maps.geometry.spherical.computeDistanceBetween(
            clickStartPosition,
            event.latLng,
          );

        if (moveDistance <= MIN_MOVE_DISTANCE) {
          // Si el movimiento fue menor que el umbral, lo tratamos como un clic
          handlePolylineClick(event);
        } else {
          // Si fue un arrastre, actualizamos el path
          const newPath = polylineRef.current.getPath().getArray();
          setPolylinePath([...newPath]);
        }
      }

      setIsMouseDown(false);
      setClickStartPosition(null);
    },
    [clickStartPosition, isMouseDown, handlePolylineClick],
  );

  useEffect(() => {
    if (!mapRef.current || !polylinePath) return;

    const updatePolylineMarkers = () => {
      markerRefs.current.forEach((marker) => marker.setMap(null));
      const markers = placeMarkersOnPolylineSegments(
        polylinePath,
        mapRef.current!,
      );
      markerRefs.current = markers;
    };

    updatePolylineMarkers();

    const distance = calculateTotalDistance(polylinePath);
    setTotalDistance(distance);
  }, [polylinePath]);

  return {
    isDrawingMode,
    mapRef,
    polylinePath,
    totalDistance,
    tooltipContent,
    tooltipPosition,
    setIsDrawingMode,
    setTotalDistance,
    handleMapLoad,
    handleMapClick,
    handlePolylineLoad,
    startDrawing,
    stopDrawing,
    clearDrawing,
    handlePolylineClick,
    handlePolylineMouseOver,
    handlePolylineMouseOut,
    handlePolylineMouseUp,
    handlePolylineMouseDown,
  };
};
