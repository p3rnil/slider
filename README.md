Este componente es un slider que tiene dos modos de uso: el normal, con mínimo/máximo, y el que tiene valores fijados entre estos. Cada modo se puede encontrar en las rutas localhost:8080/exercise1 y localhost:8080/exercise2.

La separación de estos modos está hecha de manera que el componente Range renderiza el componente A o B según el modo que se le indique. Esto está así para no tener un solo componente que tuviera que hacer la distinción con condicionales.

El comando para lanzarlo es:

```bash
yarn dev
```

Para los tests

```bash
yarn test
```


Mejoras:

- Encontrar una solución para el getBoundingClientRect, ya que el DOM de JavaScript no lo soporta y hace que los tests de arrastre no funcionen.
No usar el document para añadir el listener del evento. Esto lo he dejado así en vez de usar ref, ya que solo aplicaba al entorno del slider y, al salir, se interrumpía.
- Darle una vuelta al código compartido entre ambos modos para ver si se puede extraer lógica en hooks.