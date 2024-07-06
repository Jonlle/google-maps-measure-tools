import { useState, useCallback, useEffect } from "react";
import {
  calculateCircleArea,
  calculateCirclePerimeter,
} from "../utils/circleUtils";
import {
  calculatePolygonPerimeter,
  calculatePolygonArea,
} from "../utils/polylineUtils";
import { TCircle, TPolygon } from "../types/googleMapsTypes";

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
  const [circle, setCircle] = useState<TCircle | null>(null);
  const [polygon, setPolygon] = useState<TPolygon | null>(null);
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
    if (polygon) {
      const path = polygon.getPath();
      if (path.getLength() > 2) {
        path.push(path.getAt(0));
        polygon.setPath(path);
        setPolygon(polygon);
      }
    }
    setDrawMode(false);
  }, [polygon]);

  const handleClearCircleClick = useCallback(() => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
      setDrawMode(false);
      setRadiusSelected(0);
      setRadius(0);
    }
  }, [circle]);

  const handleClearLastPointClick = useCallback(() => {
    if (polygon) {
      const path = polygon.getPath();
      if (path.getLength() > 0) {
        path.pop();
        if (path.getLength() === 0) {
          polygon.setMap(null);
          setPolygon(null);
          setDrawMode(false);
        } else {
          polygon.setPath(path);
          setPolygon(polygon);
        }
      }
    }
  }, [polygon]);

  const handleClearPolygonClick = useCallback(() => {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
    }
  }, [polygon]);

  const handleCircleComplete = useCallback(
    (newCircle: TCircle | null) => {
      setCircle(newCircle);
      setDrawMode(false);
    },
    [],
  );

  const handlePolygonComplete = useCallback(
    (newPolygon: TPolygon | null) => {
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
      const paths = polygon.getPaths();
      let totalPoints = 0;
      paths.forEach((path) => (totalPoints += path.getLength()));
      if (totalPoints > 2) {
        setArea(calculatePolygonArea(paths));
        setPerimeter(calculatePolygonPerimeter(paths));
      } else if (totalPoints === 2) {
        const path = paths.getAt(0);
        const point1 = path.getAt(0);
        const point2 = path.getAt(1);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          point1,
          point2
        );
        setPerimeter(distance);
        setArea(null);
      } else {
        setArea(null);
        setPerimeter(null);
      }
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
    handleClearLastPointClick,
    handleClearPolygonClick,
    handleCircleComplete,
    handlePolygonComplete,
  };
};

export default useMapControls;
