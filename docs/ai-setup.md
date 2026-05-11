# Configuración de herramientas de IA

Durante el desarrollo de Bookstand uso dos herramientas de IA: Gemini y Claude.
Para que las respuestas se ajusten al proyecto y no contradigan las decisiones de diseño, le doy un contexto inicial que describe el stack, las convenciones y las restricciones del proyecto.

## Herramientas configuradas

### Claude
Configuro las instrucciones de sistema en el chat de Claude.ai.

### Gemini
Igual que con Claude, pego el contexto al inicio del chat.

## Contexto que aplico en ambas

El contexto incluye:

- **Stack técnico**: React Native, Expo, TypeScript, Expo Router, Gluestack UI, FlashList, Zustand y AsyncStorage.
- **Concepto de la app**: estantería digital para lectores, con libros, reseñas y listas.
- **Convenciones de código**: TypeScript estricto, componentes funcionales con hooks, estilos a través de Gluestack UI, código y commits en español.
- **Restricciones**: nada de backend, nada de APIs externas, app offline, trabajo en rama main.

## Por qué esta configuración

Sin este contexto, las herramientas de IA tienden a sugerir librerías que no uso (otros sistemas de UI, fetchers, librerías de navegación distintas) o estructuras que no encajan con Expo Router. Al darles el stack y las restricciones desde el principio, las respuestas son más útiles y no me hacen perder tiempo descartando soluciones que no aplican.

## Cursor

No uso la IA de Cursor en este proyecto, por lo que no fue necesario crear un archivo `.cursorrules`.