import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Range from "@/components/Range";
import "@testing-library/jest-dom";

describe("NormalRange component", () => {
  const initialMin = 10; // Valor fijo para el mínimo
  const initialMax = 90; // Valor fijo para el máximo

  // Verifica que esten bien con valores iniciales dados
  test("renders with correct initial values", () => {
    render(<Range values={[initialMin, initialMax]} />);

    expect(screen.getByTestId("min-label")).toHaveTextContent(
      `${initialMin} €`
    );
    expect(screen.getByTestId("max-label")).toHaveTextContent(
      `${initialMax} €`
    );
  });

  // Verifica la modificación a partir de los inputs
  test("allows editing of min and max values", () => {
    render(<Range values={[initialMin, initialMax]} />);

    // Editar el valor mínimo
    fireEvent.click(screen.getByTestId("min-label"));
    fireEvent.change(screen.getByTestId("min-input"), {
      target: { value: 20 },
    });
    fireEvent.blur(screen.getByTestId("min-input"));

    expect(screen.getByTestId("min-label")).toHaveTextContent("20 €");

    // Editar el valor máximo
    fireEvent.click(screen.getByTestId("max-label"));
    fireEvent.change(screen.getByTestId("max-input"), {
      target: { value: 80 },
    });
    fireEvent.blur(screen.getByTestId("max-input"));

    expect(screen.getByTestId("max-label")).toHaveTextContent("80 €");
  });

  // No funciona debido al getBoundingClientRect que se hace para calcular el percent con el .width del
  // elemento
  // Caso de prueba 2: Simula arrastre de los manejadores y verifica el cambio de valores
  test("allows dragging min and max handles to update values", () => {
    render(<Range values={[initialMin, initialMax]} />);

    const minHandle = screen.getByTestId("min-handle");
    const maxHandle = screen.getByTestId("max-handle");

    // Simula el arrastre del manejador mínimo (min handle)
    fireEvent.mouseDown(minHandle);
    fireEvent.mouseMove(document, { clientX: 10 }); // Mueve el ratón
    fireEvent.mouseUp(document);

    // Verifica que el valor mínimo haya cambiado
    const minLabel = screen.getByTestId("min-label");
    expect(minLabel).not.toHaveTextContent(`${initialMin} €`); // Ya no debería ser el valor mínimo original

    // Simula el arrastre del manejador máximo (max handle)
    fireEvent.mouseDown(maxHandle);
    fireEvent.mouseMove(document, { clientX: 400 });
    fireEvent.mouseUp(document);

    // Verifica que el valor máximo haya cambiado
    const maxLabel = screen.getByTestId("max-label");
    expect(maxLabel).not.toHaveTextContent(`${initialMax} €`); // Ya no debería ser el valor máximo original
  });

  // No funciona debido al getBoundingClientRect que se hace para calcular el percent con el .width del
  // elemento
  // Caso de prueba 3: Verifica que los límites no se crucen
  test("prevents handles from crossing each other", () => {
    render(<Range values={[initialMin, initialMax]} />);

    const minHandle = screen.getByTestId("min-handle");
    const maxHandle = screen.getByTestId("max-handle");

    // Intenta arrastrar un poco a la derecha
    fireEvent.mouseDown(minHandle);
    fireEvent.mouseMove(document, { clientX: 500 }); // Mueve el mínimo un poco
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
