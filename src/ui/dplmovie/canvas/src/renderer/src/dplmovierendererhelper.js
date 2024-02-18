"use strict";

import { ASSERT } from "../../../../../../model/utility/assert/assert";

/* values are in pixels  */
/* --------------------- */
/*Cell headers */
const CELL_BASE_HEIGHT = 75;
const CELL_BASE_WIDTH = 200;
const CELL_BASE_ROUNDNESS = 10;
const CELL_BASE_PREFEREDFONTSIZE = 20;
const CELL_BASE_LINEWIDTH = 4;

/*Line */
const LINEHEADER_BASE_HEIGHT = 75;
const LINEHEADER_BASE_ADDITIONAL_HEIGHT = 25;
const LINEELT_BASE_DIMENSION = 50; /*an element is a square, there is no width and no heigth but a single dimension */
const LINEELT_BASE_MINSPACING = 8; /*an element is a square, the spacing between them extends in both direction */

/*color*/
const CELL_STROKECOLOR = "black";
const CELL_TEXTFILLCOLOR = "black";

/**
 * @param {Integer} zoomFactor zoom factor.
 * @returns header cell border line width
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

/**
 * @param {Integer} maxNumberOfElt max number of elements in the line
 * @param {Integer} zoomFactor zoom factor.
 * @returns line header heigth
 */
export const getLineHeaderHeight = function (maxNumberOfElt, zoomFactor) {
  return (
    Math.max(
      /*line header heigth is the space taken by allocable + the some space to stand out.  */
      maxNumberOfElt * (LINEELT_BASE_DIMENSION + LINEELT_BASE_MINSPACING) + LINEHEADER_BASE_ADDITIONAL_HEIGHT,
      LINEHEADER_BASE_HEIGHT
    ) * zoomFactor
  );
};

export const getAllocableMinimalXSpacing = function (zoomFactor) {
  return LINEELT_BASE_MINSPACING * zoomFactor;
};

/** erase this rectangle from the canvas.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to erase.
 * @param {Object} rectangle object having a X, Y, Width, Height and LineWidth property.
 */
export const eraseRectangle = function (canvasContext, rectangle) {
  canvasContext.clearRect(
    rectangle.X - rectangle.LineWidth,
    rectangle.Y - rectangle.LineWidth,
    rectangle.Width + 4 * rectangle.LineWidth,
    rectangle.Height + 4 * rectangle.LineWidth
  );
};

/** draw a cell with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} x top-left corner x (without zoom factor)
 * @param {Integer} y top-left corner y (without zoom factor)
 * @param {Integer} zoomFactor zoom factor.
 * @param {Object} coordReference optional object giving the x-y reference
 * @returns a rectangle object with X, Y, Width, LineWidth and Heigth properties.
 */
export const drawHeaderCell = function (canvasContext, text, backgroundColor, x, y, zoomFactor, coordReference = null) {
  const finalX = coordReference === null ? x : x - coordReference.xRef;
  const finalY = coordReference === null ? y : y - coordReference.yRef;
  const finalHeight = getHeaderCellHeigth(zoomFactor);
  const finalWidth = getHeaderCellWith(zoomFactor);
  const finalLineWidth = getLineWidth(zoomFactor);
  const finalRoundness = zoomFactor * CELL_BASE_ROUNDNESS;

  // draw the rectangle
  canvasContext.beginPath();
  canvasContext.roundRect(finalX, finalY, finalWidth, finalHeight, [finalRoundness]);
  canvasContext.fillStyle = backgroundColor;
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.roundRect(finalX, finalY, finalWidth, finalHeight, [finalRoundness]);
  canvasContext.lineWidth = finalLineWidth;
  canvasContext.strokeStyle = CELL_STROKECOLOR;
  canvasContext.stroke();

  // draw the text
  canvasContext.font = `${Math.floor(CELL_BASE_PREFEREDFONTSIZE * zoomFactor)}px sans-serif`;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.lineWidth = 1;
  canvasContext.fillStyle = CELL_TEXTFILLCOLOR;
  canvasContext.fillText(text, finalX + finalWidth / 2, finalY + finalHeight / 2);

  // return the positions.
  return {
    X: finalX,
    Y: finalY,
    Width: finalWidth,
    Height: finalHeight,
    LineWidth: finalLineWidth,
  };
};

/** draw a line header with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} x top-left corner x (without zoom factor)
 * @param {Integer} y top-left corner y (without zoom factor)
 * @param {Integer} zoomFactor zoom factor.
 * @param {Integer} maxNumberOfElt max number of elements in the line
 * @returns a rectangle object with X, Y, Width, LineWidth and Heigth properties.
 */
export const drawLineHeader = function (canvasContext, text, backgroundColor, x, y, zoomFactor, maxNumberOfElt) {
  const finalHeight = getLineHeaderHeight(maxNumberOfElt, zoomFactor);
  const finalWidth = getHeaderCellWith(zoomFactor);
  const finalLineWidth = getLineWidth(zoomFactor);
  const finalRoundness = zoomFactor * CELL_BASE_ROUNDNESS;

  // draw the rectangle
  canvasContext.beginPath();
  canvasContext.roundRect(x, y, finalWidth, finalHeight, [finalRoundness]);
  canvasContext.fillStyle = backgroundColor;
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.roundRect(x, y, finalWidth, finalHeight, [finalRoundness]);
  canvasContext.lineWidth = finalLineWidth;
  canvasContext.strokeStyle = CELL_STROKECOLOR;
  canvasContext.stroke();

  // draw the text
  canvasContext.font = `${Math.floor(CELL_BASE_PREFEREDFONTSIZE * zoomFactor)}px sans-serif`;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.lineWidth = 1;
  canvasContext.fillStyle = CELL_TEXTFILLCOLOR;
  canvasContext.fillText(text, x + finalWidth / 2, y + finalHeight / 2);

  // return the positions.
  return {
    X: x,
    Y: y,
    Width: finalWidth,
    Height: finalHeight,
    LineWidth: finalLineWidth,
  };
};

/** draw an allocable with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} xStart top-left corner x (relative)
 * @param {Integer} xEnd top-left corner x (relative)
 * @param {Integer} y top-left corner y (relative)
 * @param {Integer} zoomFactor zoom factor.
 * @returns a rectangle object with X, Y, Width, LineWidth and Heigth properties.
 */
export const drawAllocable = function (canvasContext, text, backgroundColor, xStart, xEnd, y, zoomFactor) {
  ASSERT(xStart < xEnd, `the x positions are not respected : xStart:${xStart} - xEnd:${xEnd}`);

  const finalHeight = LINEELT_BASE_DIMENSION * zoomFactor;
  const finalWidth = xEnd - xStart;
  const finalLineWidth = getLineWidth(zoomFactor);
  const finalRoundness = zoomFactor * CELL_BASE_ROUNDNESS;

  // draw the rectangle
  canvasContext.beginPath();
  canvasContext.roundRect(xStart, y, finalWidth, finalHeight, [finalRoundness]);
  canvasContext.fillStyle = backgroundColor;
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.roundRect(xStart, y, finalWidth, finalHeight, [finalRoundness]);
  canvasContext.lineWidth = finalLineWidth;
  canvasContext.strokeStyle = CELL_STROKECOLOR;
  canvasContext.stroke();

  // draw the text
  canvasContext.font = `${Math.floor(CELL_BASE_PREFEREDFONTSIZE * zoomFactor)}px sans-serif`;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.lineWidth = 1;
  canvasContext.fillStyle = CELL_TEXTFILLCOLOR;
  canvasContext.fillText(text, xStart + finalWidth / 2, y + finalHeight / 2);

  // return the positions.
  return {
    X: xStart,
    Y: y,
    Width: finalWidth,
    Height: finalHeight,
    LineWidth: finalLineWidth,
  };
};
