import { useState, useCallback, useEffect } from "react";
import {
  calculateCircleArea,
  calculateCirclePerimeter,
} from "../utils/circleUtils";
import {
  calculatePolygonPerimeter,
  calculatePolygonArea,
} from "../utils/polygonUtils";

type Mode = "area" | "radius" | null;

interface UseMapControlsProps {
  initialMode: Mode;
  initialRadiusSelected: number;
}

const useMapControls = ({
  initialMode,
  initialRadiusSelected,
}: UseMapControlsProps) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const [radiusSelected, setRadiusSelected] = useState<number>(
    initialRadiusSelected,
  );
  const [radius, setRadius] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
    setRadiusSelected(0);
    setCircle(null);
    setPolygon(null);
    setRadius(null);
    setDrawMode(false);
  }, []);

  const handleSelectRadiusChange = useCallback(
    ({
      target: { value: newRadius },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      setRadiusSelected(Number(newRadius));
      setDrawMode(false);
    },
    [],
  );

  const handleDrawClick = useCallback(() => {
    setDrawMode(true);
  }, []);

  const handleCancelDrawClick = useCallback(() => {
    setDrawMode(false);
  }, []);

  const handleClearCircleClick = useCallback(() => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
      setDrawMode(false);
      setRadiusSelected(0);
      setRadius(0);
    }
  }, [circle]);

  const handleClearPolygonClick = useCallback(() => {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
      setDrawMode(false);
    }
  }, [polygon]);

  const handleCircleComplete = useCallback(
    (newCircle: google.maps.Circle | null) => {
      setCircle(newCircle);
      setDrawMode(false);
    },
    [],
  );

  const handlePolygonComplete = useCallback(
    (newPolygon: google.maps.Polygon | null) => {
      setPolygon(newPolygon);
      setDrawMode(false);
    },
    [],
  );

  useEffect(() => {
    if (circle) {
      const circleRadius = circle.getRadius();
      setRadius(circleRadius);
      setArea(calculateCircleArea(circleRadius));
      setPerimeter(calculateCirclePerimeter(circleRadius));
    } else if (polygon) {
      const path = polygon.getPaths();
      setArea(calculatePolygonArea(path));
      setPerimeter(calculatePolygonPerimeter(path));
    } else {
      setArea(null);
      setPerimeter(null);
    }
  }, [circle, polygon]);

  return {
    mode,
    drawMode,
    circle,
    polygon,
    radiusSelected,
    radius,
    area,
    perimeter,
    handleModeChange,
    handleSelectRadiusChange,
    handleDrawClick,
    handleCancelDrawClick,
    handleClearCircleClick,
    handleClearPolygonClick,
    handleCircleComplete,
    handlePolygonComplete,
  };
};

export default useMapControls;
