import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FixedRange from "@/components/FixedRange";
import "@testing-library/jest-dom";

describe("FixedRange component with random values", () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  // Verifica que esten bien con valores iniciales dados
  test("renders correct initial min and max values", () => {
    render(<FixedRange values={values} />);

    // Verifica que el valor mínimo inicial sea el primer valor del array
    expect(screen.getByTestId("min-label")).toHaveTextContent(
      `${Math.min(...values)} €`
    );

    // Verifica que el valor máximo inicial sea el último valor del array
    expect(screen.getByTestId("max-label")).toHaveTextContent(
      `${Math.max(...values)} €`
    );
  });

  // No funciona debido al getBoundingClientRect que se hace para calcular el percent con el .width del
  // elemento
  // Simula arrastre de los manejadores y verifica el cambio de valores
  test("allows dragging min and max handles to update values", () => {
    render(<FixedRange values={values} />);

    const minHandle = screen.getByTestId("min-handle");
    const maxHandle = screen.getByTestId("max-handle");

    // Simula el arrastre del manejador mínimo (min handle)
    fireEvent.mouseDown(minHandle);
    fireEvent.mouseMove(document, { clientX: 10 }); // Mueve el ratón
    fireEvent.mouseUp(document);

    // Verifica que el valor mínimo haya cambiado
    const minLabel = screen.getByTestId("min-label");
    expect(minLabel).not.toHaveTextContent(`${Math.min(...values)} €`); // Ya no debería ser el valor mínimo original

    // Simula el arrastre del manejador máximo (max handle)
    fireEvent.mouseDown(maxHandle);
    fireEvent.mouseMove(document, { clientX: 400 });
    fireEvent.mouseUp(document);

    // Verifica que el valor máximo haya cambiado
    const maxLabel = screen.getByTestId("max-label");
    expect(maxLabel).not.toHaveTextContent(`${Math.max(...values)} €`); // Ya no debería ser el valor máximo original
  });

  // No funciona debido al getBoundingClientRect que se hace para calcular el percent con el .width del
  // elemento
  // Verifica que los límites no se crucen
  test("prevents handles from crossing each other", () => {
    render(<FixedRange values={values} />);

    const minHandle = screen.getByTestId("min-handle");
    const maxHandle = screen.getByTestId("max-handle");

    // Intenta arrastrar un poco a la derecha
    fireEvent.mouseDown(minHandle);
    fireEvent.mouseMove(document, { clientX: 150 }); // Mueve el mínimo un poco
    fireEvent.mouseUp(document);

    // Intenta arrastrar al maximo a la izquierda
    fireEvent.mouseDown(maxHandle);
    fireEvent.mouseMove(document, { clientX: -2150 }); // Mueve al extremo del mínimo
    fireEvent.mouseUp(document);

    // Verifica que los valores no se hayan cruzado
    const minLabel = screen.getByTestId("min-label");
    const maxLabel = screen.getByTestId("max-label");

    expect(parseInt(minLabel.textContent as string)).toBeLessThan(
      parseInt(maxLabel.textContent as string)
    );
  });
});
