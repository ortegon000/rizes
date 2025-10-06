/**
 * Funciones helper para el manejo de canvas y secuencias
 */

/**
 * Rellena un número con ceros a la izquierda
 * @param n - Número a rellenar
 * @param len - Longitud total deseada
 * @returns String con el número rellenado
 */
export const padNumber = (n: number, len: number): string => {
  return n.toString().padStart(len, "0");
};

/**
 * Genera la URL de un frame específico de una secuencia
 * @param manifest - Configuración de la secuencia
 * @param index - Índice del frame
 * @returns URL completa del frame
 */
export const getFrameUrl = (
  manifest: { baseUrl: string; ext: string; pad: number },
  index: number
): string => {
  return `${manifest.baseUrl}${padNumber(index, manifest.pad)}${manifest.ext}`;
};

/**
 * Calcula las dimensiones para renderizar con object-fit: cover
 * @param canvasWidth - Ancho del canvas
 * @param canvasHeight - Alto del canvas
 * @param imgWidth - Ancho de la imagen
 * @param imgHeight - Alto de la imagen
 * @returns Objeto con dimensiones y offsets para dibujar
 */
export const calculateCoverDimensions = (
  canvasWidth: number,
  canvasHeight: number,
  imgWidth: number,
  imgHeight: number
): { drawWidth: number; drawHeight: number; offsetX: number; offsetY: number } => {
  const canvasRatio = canvasWidth / canvasHeight;
  const imgRatio = imgWidth / imgHeight;

  let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

  if (imgRatio > canvasRatio) {
    // Imagen más ancha que el canvas - ajustar por altura
    drawHeight = canvasHeight;
    drawWidth = drawHeight * imgRatio;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    // Imagen más alta que el canvas - ajustar por anchura
    drawWidth = canvasWidth;
    drawHeight = drawWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  return { drawWidth, drawHeight, offsetX, offsetY };
};
