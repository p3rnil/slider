"use client";
import React, { useState, useEffect, useRef } from "react";

interface SliderProps {
  initialMin: number;
  initialMax: number;
  step?: number;
}

export default function NormalRange({
  initialMin,
  initialMax,
  step = 1,
}: SliderProps) {
  const [minValue, setMinValue] = useState<number>(initialMin);
  const [maxValue, setMaxValue] = useState<number>(initialMax);
  const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
  const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);
  const [isEditingMin, setIsEditingMin] = useState<boolean>(false);
  const [isEditingMax, setIsEditingMax] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement | null>(null); // Usamos useRef para el slider

  // Función que maneja el movimiento de los puntos draggeables
  const handleMouseMove = (e: MouseEvent, isMin: boolean) => {
    const slider = sliderRef.current; // Obtenemos el elemento del slider desde la referencia
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left; // Posición del ratón relativa al slider
    const percent = Math.min(Math.max(0, x / rect.width), 1); // Limita entre 0 y 1
    const newValue = initialMin + percent * (initialMax - initialMin);
    const clampedValue = Math.min(
      initialMax,
      Math.max(initialMin, Math.round(newValue / step) * step)
    );

    if (isMin) {
      setMinValue(Math.min(clampedValue, maxValue - step * 10)); // El mínimo no puede ser mayor que el máximo menos diez pasos
    } else {
      setMaxValue(Math.max(clampedValue, minValue + step * 10)); // El máximo no puede ser menor que el mínimo más diez pasos
    }
  };

  const handleMouseDown = (isMin: boolean) => {
    if (isMin) {
      setIsDraggingMin(true);
    } else {
      setIsDraggingMax(true);
    }
  };

  useEffect(() => {
    const handleMouseMoveDocument = (e: MouseEvent) => {
      if (isDraggingMin) {
        handleMouseMove(e, true);
      } else if (isDraggingMax) {
        handleMouseMove(e, false);
      }
    };

    const handleMouseUpDocument = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      // Escuchar el movimiento del mouse y el mouseup en todo el documento
      document.addEventListener("mousemove", handleMouseMoveDocument);
      document.addEventListener("mouseup", handleMouseUpDocument);

      // Limpieza de eventos al desmontar o cuando se deja de arrastrar
      return () => {
        document.removeEventListener("mousemove", handleMouseMoveDocument);
        document.removeEventListener("mouseup", handleMouseUpDocument);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingMin, isDraggingMax]);

  // Maneja el cambio de valor a través del input editable
  const handleMinValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber;
      console.log('entro', value)
    if (!isNaN(value) && value >= initialMin && value <= maxValue - step * 10) {
        console.log('cambiamos!')
      setMinValue(value);
    }
  };

  const handleMaxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    if (!isNaN(value) && value <= initialMax && value >= minValue + step * 10) {
      setMaxValue(value);
    }
  };

  return (
    <div className="w-3/6 flex flex-col items-center space-y-4">
      <div className="w-full flex justify-between ">
        {/* Label editable para el valor mínimo */}
        {isEditingMin ? (
          <input
            data-testid="min-input" // Añadido data-testid
            type="number"
            value={minValue}
            onChange={handleMinValueChange}
            onBlur={() => setIsEditingMin(false)}
            className="w-16 border border-gray-300 rounded-md p-1"
            min={initialMin}
            max={maxValue - step}
            autoFocus
          />
        ) : (
          <span
            data-testid="min-label" // Añadido data-testid
            className="cursor-pointer"
            onClick={() => setIsEditingMin(true)}
          >
            {minValue} €
          </span>
        )}

        {/* Label editable para el valor máximo */}
        {isEditingMax ? (
          <input
            data-testid="max-input" // Añadido data-testid
            type="number"
            value={maxValue}
            onChange={handleMaxValueChange}
            onBlur={() => setIsEditingMax(false)}
            className="w-16 border border-gray-300 rounded-md p-1"
            min={minValue + step}
            max={initialMax}
            autoFocus
          />
        ) : (
          <span
            data-testid="max-label" // Añadido data-testid
            className="cursor-pointer"
            onClick={() => setIsEditingMax(true)}
          >
            {maxValue} €
          </span>
        )}
      </div>

      {/* Slider */}
      <div className="relative w-full flex items-center space-x-">
        {/* Slider visual */}
        <div
          className="w-full bg-gray-300 h-2 rounded-lg relative"
          ref={sliderRef} // Usamos useRef aquí
          data-testid="slider" // Añadido data-testid
        >
          {/* Barra que representa el rango seleccionado */}
          <div
            className="bg-blue-500 h-2 rounded-lg absolute"
            style={{
              left: `${
                ((minValue - initialMin) / (initialMax - initialMin)) * 100
              }%`,
              width: `${
                ((maxValue - minValue) / (initialMax - initialMin)) * 100
              }%`,
            }}
          />

          {/* Círculo draggeable para el valor mínimo */}
          <div
            data-testid="min-handle" // Añadido data-testid
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full cursor-grabbing transition-transform duration-300 hover:scale-150"
            style={{
              left: `${
                ((minValue - initialMin) / (initialMax - initialMin)) * 100
              }%`,
            }}
            onMouseDown={() => handleMouseDown(true)}
          />

          {/* Círculo draggeable para el valor máximo */}
          <div
            data-testid="max-handle" // Añadido data-testid
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full cursor-grabbing transition-transform duration-300 hover:scale-150"
            style={{
              left: `${
                ((maxValue - initialMin) / (initialMax - initialMin)) * 100
              }%`,
            }}
            onMouseDown={() => handleMouseDown(false)}
          />
        </div>
      </div>
    </div>
  );
}
