"use client";
import React, { useState, useEffect, useRef } from "react";

interface SliderProps {
  values: number[]; // Array de valores fijos
}

export default function FixedRange({ values }: SliderProps) {
  const [minIndex, setMinIndex] = useState<number>(0);
  const [maxIndex, setMaxIndex] = useState<number>(values.length - 1);
  const [isDraggingMin, setIsDraggingMin] = useState<boolean>(false);
  const [isDraggingMax, setIsDraggingMax] = useState<boolean>(false);

  // Crear una referencia para el slider
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Función que maneja el movimiento de los puntos draggeables
  const handleMouseMove = (e: MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;

    // El getBoundingClientRect es un problema con el jest-dom
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left; // Posición del ratón relativa al slider
    const percent = Math.min(Math.max(0, x / rect.width), 1); // Limita entre 0 y 1
    const newIndex = Math.round(percent * (values.length - 1)); // Calcula el nuevo índice

    // Actualiza los índices solo si están dentro de los límites
    if (isDraggingMin && newIndex < maxIndex) {
      setMinIndex(newIndex);
    } else if (isDraggingMax && newIndex > minIndex) {
      setMaxIndex(newIndex);
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
      handleMouseMove(e);
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
  }, [isDraggingMin, isDraggingMax]);

  return (
    <div
      className="w-3/6 flex flex-col items-center space-y-4"
      data-testid="fixed-range-slider"
    >
      <div className="w-full flex justify-between ">
        {/* Label para el valor mínimo */}
        <span data-testid="min-label">{values[minIndex]} €</span>

        {/* Label para el valor máximo */}
        <span data-testid="max-label">{values[maxIndex]} €</span>
      </div>

      {/* Slider */}
      <div className="relative w-full flex items-center space-x-">
        {/* Slider visual */}
        <div
          className="w-full bg-gray-300 h-2 rounded-lg relative"
          ref={sliderRef} // Asignar la referencia aquí
          data-testid="slider"
        >
          {/* Barra que representa el rango seleccionado */}
          <div
            className="bg-blue-500 h-2 rounded-lg absolute"
            data-testid="selected-range"
            style={{
              left: `${(minIndex / (values.length - 1)) * 100}%`,
              width: `${((maxIndex - minIndex) / (values.length - 1)) * 100}%`,
            }}
          />

          {/* Círculo draggeable para el valor mínimo */}
          <div
            data-testid="min-handle"
            className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full cursor-grabbing transition-transform duration-300 hover:scale-150"
            style={{
              left: `${(minIndex / (values.length - 1)) * 100}%`,
            }}
            onMouseDown={() => handleMouseDown(true)}
          />

          {/* Círculo draggeable para el valor máximo */}
          <div
            data-testid="max-handle"
            className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full cursor-grabbing transition-transform duration-300 hover:scale-150"
            style={{
              left: `${(maxIndex / (values.length - 1)) * 100}%`,
            }}
            onMouseDown={() => handleMouseDown(false)}
          />
        </div>
      </div>
    </div>
  );
}
