import { useState, useCallback, useEffect, useRef } from "react";
import {
  calculateCircleArea,
  calculateCirclePerimeter,
  circleOptions,
} from "../utils/circleUtils";
import { InteractiveCircleMapProps } from "../components/InteractiveCircleMap";
import {
  TMap,
  TCircle,
  TLatLng,
  TDrawingManager,
} from "../types/googleMapsTypes";
import useMapFitBounds from "./useMapFitBounds";

export const useCircleMap = ({
  setCircleState,
  useMapDrawing,
  radiusSelected,
  setRadiusSelected,
}: InteractiveCircleMapProps) => {
  const [center, setCenter] = useState<TLatLng | undefined>(undefined);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [waitingForCenter, setWaitingForCenter] = useState<boolean>(false);

  const { drawingState, setIsDrawing, setHasDrawing, setCallbacks } =
    useMapDrawing;

  const { isDrawing, hasDrawing } = drawingState;

  const mapRef = useRef<TMap | null>(null);
  const drawingManagerRef = useRef<TDrawingManager | null>(null);
  const circleRef = useRef<TCircle | null>(null);

  const handleMapLoad = useCallback((map: TMap) => {
    mapRef.current = map;
  }, []);

  const handleDrawingManagerLoad = (drawingManager: TDrawingManager) => {
    drawingManagerRef.current = drawingManager;
  };

  const updateMapCursor = useCallback((newCursor: string | null) => {
    if (mapRef.current) {
      mapRef.current.setOptions({ draggableCursor: newCursor });
    }
  }, []);

  const onCircleEdit = useCallback((editedCircle: google.maps.Circle) => {
    if (!editedCircle) return;

    const newCenter = editedCircle.getCenter();
    const newRadius = editedCircle.getRadius();

    if (newCenter && newRadius) {
      setCenter(newCenter);
      setRadius(newRadius);
    }
  }, []);

  const handleCircleComplete = useCallback(
    (circle: google.maps.Circle) => {
      if (!circle) return;

      const newCenter = circle.getCenter();
      const newRadius = circle.getRadius();

      circleRef.current = circle;
      circleRef.current.setEditable(true);
      setHasDrawing(true);

      if (newCenter && newRadius) {
        setCenter(newCenter);
        setRadius(newRadius);
      }

      circleRef.current.addListener("radius_changed", () =>
        onCircleEdit(circleRef.current!),
      );
      circleRef.current.addListener("center_changed", () =>
        onCircleEdit(circleRef.current!),
      );
    },
    [onCircleEdit, setHasDrawing],
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const { latLng } = event;

      if (!mapRef.current || !latLng || !waitingForCenter) {
        return;
      }

      setWaitingForCenter(false);

      const circle = new google.maps.Circle({
        ...circleOptions,
        center: latLng,
        radius: radiusSelected,
      });

      circle.setMap(mapRef.current);
      handleCircleComplete(circle);
    },
    [handleCircleComplete, radiusSelected, waitingForCenter],
  );

  useEffect(() => {
    return () => {
      if (circleRef.current) {
        google.maps.event.clearInstanceListeners(circleRef.current);
      }
    };
  }, []);

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
    setWaitingForCenter(false);
    if (circleRef.current) {
      circleRef.current.setEditable(true);
    }
  }, [setIsDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    updateMapCursor(null);
    setWaitingForCenter(false);
    if (circleRef.current) {
      circleRef.current.setEditable(false);
    }
  }, [setIsDrawing, updateMapCursor]);

  const clearDrawing = useCallback(() => {
    setWaitingForCenter(false);
    setRadiusSelected(0);
    setRadius(undefined);
    setCenter(undefined);
    setCircleState({
      radius: null,
      area: null,
      perimeter: null,
    });

    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
  }, [setCircleState, setRadiusSelected]);

  useEffect(() => {
    setCallbacks({
      startDrawingCallback: startDrawing,
      stopDrawingCallback: stopDrawing,
      clearDrawingCallback: clearDrawing,
    });
  }, [clearDrawing, setCallbacks, startDrawing, stopDrawing]);

  useEffect(() => {
    if (!mapRef.current || !center || !radius) {
      setHasDrawing(false);
      return;
    }

    updateMapCursor(null);

    const area = calculateCircleArea(radius);
    const perimeter = calculateCirclePerimeter(radius);

    setCircleState({
      radius,
      area,
      perimeter,
    });

    setHasDrawing(true);
  }, [center, radius, setCircleState, setHasDrawing, updateMapCursor]);

  useEffect(() => {
    if (radiusSelected === 0) {
      setWaitingForCenter(false);
      return;
    }

    if (!circleRef.current) {
      updateMapCursor("crosshair");
      setIsDrawing(true);
      setWaitingForCenter(true);
      return;
    }

    circleRef.current.setRadius(radiusSelected);
    setRadius(radiusSelected);
  }, [radiusSelected, setIsDrawing, updateMapCursor]);

  useEffect(() => {
    return () => {
      if (circleRef.current) {
        google.maps.event.clearInstanceListeners(circleRef.current);
      }
    };
  }, []);

  useMapFitBounds(mapRef.current, center, radius);

  return {
    isDrawing,
    mapRef,
    hasDrawing,
    waitingForCenter,
    handleMapLoad,
    handleDrawingManagerLoad,
    handleCircleComplete,
    handleMapClick,
  };
};
