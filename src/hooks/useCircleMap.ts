import { useState, useCallback, useEffect } from "react";
import {
  calculateCircleArea,
  calculateCirclePerimeter,
} from "../utils/circleUtils";

interface UseCircleMapProps {
  initialRadiusSelected: number;
}

const useCircleMap = ({ initialRadiusSelected }: UseCircleMapProps) => {
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [radiusSelected, setRadiusSelected] = useState<number>(
    initialRadiusSelected,
  );
  const [radius, setRadius] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [waitingForCenter, setWaitingForCenter] = useState<boolean>(false);

  const handleSelectRadiusChange = useCallback(
    ({
      target: { value: newRadius },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      setRadiusSelected(Number(newRadius));
      setDrawMode(false);
      setWaitingForCenter(true);
    },
    [],
  );

  const handleDrawClick = useCallback(() => {
    setDrawMode(true);
    setWaitingForCenter(false);
  }, []);

  const handleClearCircleClick = useCallback(() => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
      setDrawMode(false);
      setWaitingForCenter(false);
      setRadiusSelected(0);
      setRadius(null);
      setArea(null);
      setPerimeter(null);
    }
  }, [circle]);

  const handleCancelDrawClick = useCallback(() => {
    setDrawMode(false);
    setWaitingForCenter(false);
  }, []);

  const handleCircleComplete = useCallback(
    (newCircle: google.maps.Circle | null) => {
      setCircle(newCircle);
      setDrawMode(false);
      setWaitingForCenter(false);
      if (newCircle) {
        const circleRadius = newCircle.getRadius();
        setRadius(circleRadius);
        setArea(calculateCircleArea(circleRadius));
        setPerimeter(calculateCirclePerimeter(circleRadius));
      }
    },
    [],
  );

  const handleCircleEdit = useCallback((editedCircle: google.maps.Circle) => {
    const circleRadius = editedCircle.getRadius();
    setRadius(circleRadius);
    setArea(calculateCircleArea(circleRadius));
    setPerimeter(calculateCirclePerimeter(circleRadius));
  }, []);

  useEffect(() => {
    if (circle) {
      const circleRadius = circle.getRadius();
      setRadius(circleRadius);
      setArea(calculateCircleArea(circleRadius));
      setPerimeter(calculateCirclePerimeter(circleRadius));
    } else {
      setRadius(null);
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
    waitingForCenter,
    handleSelectRadiusChange,
    handleDrawClick,
    handleCancelDrawClick,
    handleClearCircleClick,
    handleCircleComplete,
    handleCircleEdit,
  };
};

export default useCircleMap;
