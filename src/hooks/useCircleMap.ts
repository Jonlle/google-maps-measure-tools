import { useState, useCallback, useEffect } from "react";
import {
  calculateCircleArea,
  calculateCirclePerimeter,
} from "../utils/circleUtils";

type UseCircleMapProps = {
  initialRadiusSelected: number;
};

const useCircleMap = ({ initialRadiusSelected }: UseCircleMapProps) => {
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [radiusSelected, setRadiusSelected] = useState<number>(
    initialRadiusSelected,
  );
  const [radius, setRadius] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);

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

  const handleClearCircleClick = useCallback(() => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
      setDrawMode(false);
      setRadiusSelected(0);
      setRadius(0);
    }
  }, [circle]);

  const handleCancelDrawClick = useCallback(() => {
    setDrawMode(false);
  }, []);

  const handleCircleComplete = useCallback(
    (newCircle: google.maps.Circle | null) => {
      setCircle(newCircle);
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
    } else {
      setArea(null);
      setPerimeter(null);
    }
  }, [circle]);

  return {
    drawMode,
    circle,
    radiusSelected,
    radius,
    area,
    perimeter,
    handleSelectRadiusChange,
    handleDrawClick,
    handleCancelDrawClick,
    handleClearCircleClick,
    handleCircleComplete,
  };
};

export default useCircleMap;
