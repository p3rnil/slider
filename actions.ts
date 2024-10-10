"use server";
import { generateSortedRandomValues } from "@/utils";

// Aquí podría ir una llamada utilizando el fetch de next.
// El beneficio de hacer esto es que el fetch de next es un wrapper
// al fetch de js que permite cachear las llamadas.
// De utilizar el fetch seria conveniente gestionar el retorno y los
// códigos de error.
export async function getRandomArray() {
  return generateSortedRandomValues(5, 1, 100);
}
