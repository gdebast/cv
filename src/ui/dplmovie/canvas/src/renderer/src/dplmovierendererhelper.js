/* values are in pixels */
const CELL_BASE_HEIGHT = 75;
const CELL_BASE_WIDTH = 200;
const CELL_BASE_ROUNDNESS = 10;
const CELL_BASE_PREFEREDFONTSIZE = 20;
const CELL_BASE_LINEWIDTH = 4;

/*color*/
const CELL_STROKECOLOR = "black";
const CELL_TEXTFILLCOLOR = "white";

/**
 * @param {Integer} zoomFactor zoom factor.
 * @returns header cell line width
 */
export const getLineWidth = function (zoomFactor) {
  return CELL_BASE_LINEWIDTH * zoomFactor;
};

/**
 * @param {Integer} zoomFactor zoom factor.
 * @returns header cell width
 */
export const getHeaderCellWith = function (zoomFactor) {
  return CELL_BASE_WIDTH * zoomFactor;
};

/**
 * @param {Integer} zoomFactor zoom factor.
 * @returns header cell heigth
 */
export const getHeaderCellHeigth = function (zoomFactor) {
  return CELL_BASE_HEIGHT * zoomFactor;
};

/** draw a cell with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} x top-left corner x (without zoom factor)
 * @param {Integer} y top-left corner y (without zoom factor)
 * @param {Integer} zoomFactor zoom factor.
 * @returns a rectangle object with X, Y, Width and Heigth properties.
 */
export const drawHeaderCell = function (
  canvasContext,
  text,
  backgroundColor,
  x,
  y,
  zoomFactor
) {
  const finalX = zoomFactor * x;
  const finalY = zoomFactor * y;
  const finalHeight = getHeaderCellHeigth(zoomFactor);
  const finalWidth = getHeaderCellWith(zoomFactor);
  const finalLineWidth = getLineWidth(zoomFactor);
  const finalRoundness = zoomFactor * CELL_BASE_ROUNDNESS;

  // draw the rectangle
  canvasContext.beginPath();
  canvasContext.roundRect(finalX, finalY, finalWidth, finalHeight, [
    finalRoundness,
  ]);
  canvasContext.fillStyle = backgroundColor;
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.roundRect(finalX, finalY, finalWidth, finalHeight, [
    finalRoundness,
  ]);
  canvasContext.lineWidth = finalLineWidth;
  canvasContext.strokeStyle = CELL_STROKECOLOR;
  canvasContext.stroke();

  // draw the text
  canvasContext.font = `${Math.floor(
    CELL_BASE_PREFEREDFONTSIZE * zoomFactor
  )}px sans-serif`;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.lineWidth = 1;
  canvasContext.fillStyle = CELL_TEXTFILLCOLOR;
  canvasContext.fillText(
    text,
    finalX + finalWidth / 2,
    finalY + finalHeight / 2
  );

  // return the positions.
  return {
    X: finalX,
    Y: finalY,
    Width: finalWidth,
    Height: finalHeight,
    LineWidth: finalLineWidth,
  };
};
