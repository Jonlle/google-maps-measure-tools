import { useState, useRef, useCallback, useEffect } from "react";
import { InteractivePolylineMapProps } from "../components/InteractivePolylineMap";
import {
  calculatePolygonArea,
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

export const usePolylineMap = ({
  setPolylineState,
  useMapDrawing,
}: InteractivePolylineMapProps) => {
  const [polylinePath, setPolylinePath] = useState<TLatLng[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [clickStartPosition, setClickStartPosition] =
    useState<google.maps.LatLng | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const { drawingState, setIsDrawing, setHasDrawing, setCallbacks } =
    useMapDrawing;

  const { isDrawing } = drawingState;

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
      if (!isDrawing || !latLng) {
        return;
      }
      setPolylinePath((previousPath) => [...previousPath, latLng]);
    },
    [isDrawing],
  );

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    updateMapCursor("crosshair");
  }, [setIsDrawing, updateMapCursor]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    updateMapCursor(null);
  }, [setIsDrawing, updateMapCursor]);

  const clearDrawing = useCallback(() => {
    setPolylinePath([]);
    setPolylineState({
      totalDistance: null,
      area: null,
    });
  }, [setPolylineState]);

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
        stopDrawing();
      } else if (clickedIndex > 0) {
        const updatedPath = polylinePath.filter(
          (_, index) => index !== clickedIndex,
        );
        setPolylinePath(updatedPath);
      }
    },
    [polylinePath, stopDrawing],
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
          handlePolylineClick(event);
        } else {
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
    setCallbacks({
      startDrawingCallback: startDrawing,
      stopDrawingCallback: stopDrawing,
      clearDrawingCallback: clearDrawing,
    });
  }, [clearDrawing, setCallbacks, startDrawing, stopDrawing]);

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

    const totalDistance = calculateTotalDistance(polylinePath);
    const area = calculatePolygonArea(polylinePath);

    setPolylineState({
      totalDistance,
      area,
    });

    setHasDrawing(polylinePath.length > 0);
  }, [polylinePath, setHasDrawing, setPolylineState]);

  return {
    isDrawing,
    mapRef,
    polylinePath,
    tooltipContent,
    tooltipPosition,
    setIsDrawing,
    handleMapLoad,
    handleMapClick,
    handlePolylineLoad,
    handlePolylineClick,
    handlePolylineMouseOver,
    handlePolylineMouseOut,
    handlePolylineMouseUp,
    handlePolylineMouseDown,
  };
};
