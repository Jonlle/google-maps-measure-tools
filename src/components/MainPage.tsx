// src/components/MainPage.tsx
import { useState, useEffect, useRef } from "react";
import GoogleMapContainer from "./GoogleMapContainer";
import CircleMap from "./CircleMap";
import Result from "./Result";

type Mode = "area" | "radius" | null;

const MainPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>(null);
  const [radius, setRadius] = useState<number>(0);
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [formattedRadius, setFormattedRadius] = useState<string | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null,
  );

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setRadius(0);
    setDrawMode(false);
    setCenter(null);
    setArea(null);
    setFormattedRadius(null);
    if (circle) {
      circle.setMap(null);
      setCircle(null);
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRadius = Number(e.target.value);
    setRadius(newRadius);
    if (map) {
      const center = {
        lat: map.getCenter()!.lat(),
        lng: map.getCenter()!.lng(),
      };
      setCenter(center);
      calculateAreaAndRadius(newRadius);
      fitMapToCircle(center, newRadius);
      if (!circle) {
        drawCircle(center, newRadius);
      }
    }
  };

  const handleDrawClick = () => {
    if (mode === "radius" && !circle) {
      setDrawMode(true);
      if (drawingManagerRef.current && map) {
        drawingManagerRef.current.setDrawingMode(
          google.maps.drawing.OverlayType.CIRCLE,
        );
      }
    }
  };

  const handleCancelDrawClick = () => {
    setDrawMode(false);
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  const handleClearCircleClick = () => {
    if (circle) {
      circle.setMap(null);
      setCircle(null);
      setDrawMode(false);
      setRadius(0);
      setCenter(null);
      setArea(null);
      setFormattedRadius(null);
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      circleOptions: {
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    google.maps.event.addListener(
      drawingManager,
      "circlecomplete",
      (circle: google.maps.Circle) => {
        setDrawMode(false);
        drawingManager.setDrawingMode(null);

        setCircle(circle);
        const radius = circle.getRadius();
        const center = circle.getCenter();

        setRadius(radius);
        setCenter({ lat: center!.lat(), lng: center!.lng() });
        calculateAreaAndRadius(radius);

        google.maps.event.addListener(circle, "radius_changed", () => {
          const newRadius = circle.getRadius();
          setRadius(newRadius);
          calculateAreaAndRadius(newRadius);
        });

        google.maps.event.addListener(circle, "center_changed", () => {
          const newCenter = circle.getCenter();
          setCenter({ lat: newCenter!.lat(), lng: newCenter!.lng() });
        });
      },
    );
  };

  const calculateAreaAndRadius = (radius: number) => {
    const areaInSquareMeters = Math.PI * Math.pow(radius, 2);
    const areaInSquareKilometers = areaInSquareMeters / 1e6;
    setArea(
      `${areaInSquareMeters.toFixed(0)} m² | ${areaInSquareKilometers.toFixed(2)} km²`,
    );

    const radiusInKilometers = radius / 1000;
    setFormattedRadius(
      `${radius.toFixed(0)} m | ${radiusInKilometers.toFixed(2)} km`,
    );
  };

  const fitMapToCircle = (
    center: google.maps.LatLngLiteral,
    radius: number,
  ) => {
    if (map) {
      const bounds = new google.maps.LatLngBounds();
      const start = google.maps.geometry.spherical.computeOffset(
        center,
        radius * 1.1,
        225,
      );
      const end = google.maps.geometry.spherical.computeOffset(
        center,
        radius * 1.1,
        45,
      );
      bounds.extend(start);
      bounds.extend(end);
      map.fitBounds(bounds);
    }
  };

  const drawCircle = (
    center: google.maps.LatLngLiteral,
    radius: number,
  ) => {
    const circleOptions: google.maps.CircleOptions = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center,
      radius,
    };

    const newCircle = new google.maps.Circle(circleOptions);
    setCircle(newCircle);
  };

  useEffect(() => {
    if (radius > 0 && map) {
      calculateAreaAndRadius(radius);
    }
  }, [radius, map]);

  useEffect(() => {
    if (circle) {
      setDrawMode(false);
    }
  }, [circle]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Map Measurement Tool</h1>
      <p className="mb-4 text-lg">Selecciona una opción para calcular:</p>
      <div className="mb-4 flex justify-start space-x-2">
        <button
          className={`button button--primary ${mode === "area" ? "button--active" : ""}`}
          onClick={() => handleModeChange("area")}
          disabled={mode === "area"}
        >
          Área
        </button>
        <button
          className={`button button--primary ${mode === "radius" ? "button--active" : ""}`}
          onClick={() => handleModeChange("radius")}
          disabled={mode === "radius"}
        >
          Radio
        </button>
      </div>

      {mode === "radius" && (
        <div className="mb-4 flex space-x-2">
          <div className="select">
            <select
              className="select__field"
              value={radius}
              onChange={handleRadiusChange}
              disabled={drawMode || !!circle}
            >
              <option value="0" className="select__option">
                Selecciona un radio
              </option>
              <option value="50">50 m</option>
              <option value="100">100 m</option>
              <option value="200">200 m</option>
              <option value="300">300 m</option>
              <option value="400">400 m</option>
              <option value="500">500 m</option>
              <option value="1000">1 km</option>
              <option value="2000">2 km</option>
              <option value="3000">3 km</option>
              <option value="4000">4 km</option>
              <option value="5000">5 km</option>
              <option value="6000">6 km</option>
              <option value="7000">7 km</option>
              <option value="8000">8 km</option>
              <option value="9000">9 km</option>
              <option value="10000">10 km</option>
              <option value="15000">15 km</option>
              <option value="20000">20 km</option>
              <option value="25000">25 km</option>
              <option value="30000">30 km</option>
              <option value="35000">35 km</option>
              <option value="40000">40 km</option>
              <option value="45000">45 km</option>
              <option value="50000">50 km</option>
              <option value="100000">100 km</option>
            </select>
          </div>
          <button
            className={`button button--secondary`}
            onClick={handleDrawClick}
            disabled={drawMode || !!circle}
          >
            Dibujar un círculo
          </button>
          {drawMode && (
            <button
              className="button button--secondary"
              onClick={handleCancelDrawClick}
            >
              Cancelar Dibujo
            </button>
          )}
          {circle && (
            <button
              className="button button--secondary"
              onClick={handleClearCircleClick}
            >
              Limpiar Círculo
            </button>
          )}
        </div>
      )}

      <GoogleMapContainer mode={mode} onMapLoad={handleMapLoad}>
        {mode === "radius" && !circle && map && (
          <CircleMap center={center} radius={radius} />
        )}
        {mode === "radius" && circle && (
          <CircleMap center={center} radius={radius} />
        )}
      </GoogleMapContainer>
      <Result area={area} perimeter={null} radius={formattedRadius} />
    </div>
  );
};

export default MainPage;
