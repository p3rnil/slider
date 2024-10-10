// Función para generar un array ordenado de valores aleatorios
export function generateSortedRandomValues(
  length: number,
  min: number,
  max: number
) {
  const values = Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

  return values.sort((a, b) => a - b); // Ordena el array de menor a mayor
}
