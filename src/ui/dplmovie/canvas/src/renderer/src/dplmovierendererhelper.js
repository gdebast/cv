"use strict";

import { ASSERT, ASSERT_TYPE } from "../../../../../../model/utility/assert/assert";
import { DPLMovieRectangle } from "./dplmovierectangle";

/* values are in pixels  */
/* --------------------- */
/*Cell headers */
const CELL_BASE_HEIGHT = 75;
const CELL_BASE_WIDTH = 200;
const CELL_BASE_ROUNDNESS = 10;
const CELL_BASE_LINEWIDTH = 4;

/*Line header */
const LINEHEADER_BASE_HEIGHT = 75;
const LINEHEADER_BASE_ADDITIONAL_HEIGHT = 25;
const LINEELT_BASE_DIMENSION = 50; /*an element is a square, there is no width and no heigth but a single dimension */
const LINEELT_BASE_MINSPACING = 8; /*an element is a square, the spacing between them extends in both direction */

/* Arrow */
const ARROW_BASE_LINEWIDTH = 4;
const ARROW_BASE_ENDLINE = 10;

/*color*/
const CELL_STROKECOLOR = "black";

/*font */
const PREFEREDFONTSIZE = 20;
const FONT = "sans-serif";
const TEXTCOLOR = "black";

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

export const getAllocaleDimension = function (zoomFactor) {
  return LINEELT_BASE_DIMENSION * zoomFactor;
};

/** erase this rectangle from the canvas.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to erase.
 * @param {DPLMovieRectangle} rectangle
 */
export const eraseRectangle = function (canvasContext, rectangle) {
  ASSERT_TYPE(rectangle, DPLMovieRectangle);
  canvasContext.clearRect(
    rectangle.X - rectangle.LineWidth,
    rectangle.Y - rectangle.LineWidth,
    rectangle.Width + 4 * rectangle.LineWidth,
    rectangle.Heigth + 4 * rectangle.LineWidth
  );
};

/** draw a column header as a cell, with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} x top-left corner x (without zoom factor)
 * @param {Integer} y top-left corner y (without zoom factor)
 * @param {Integer} zoomFactor zoom factor.
 * @param {Object} coordReference optional object giving the x-y reference
 * @returns {DPLMovieRectangle} a rectangle object with X, Y, Width, LineWidth and Heigth properties.
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
  _drawText(canvasContext, text, finalX + finalWidth / 2, finalY + finalHeight / 2, zoomFactor);

  // return the positions.
  return new DPLMovieRectangle(finalX, finalY, finalWidth, finalHeight, finalLineWidth);
};

/** draw a line header with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} x top-left corner x (without zoom factor)
 * @param {Integer} y top-left corner y (without zoom factor)
 * @param {Integer} zoomFactor zoom factor.
 * @param {Integer} maxNumberOfElt max number of elements in the line
 * @returns {DPLMovieRectangle} the rectangle of this line header
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
  _drawText(canvasContext, text, x + finalWidth / 2, y + finalHeight / 2, zoomFactor);

  // return the positions.
  return new DPLMovieRectangle(x, y, finalWidth, finalHeight, finalLineWidth);
};

/** draw an allocable with a text inside.
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} backgroundColor background color of the cell
 * @param {Integer} xStart top-left corner x (relative)
 * @param {Integer} xEnd top-left corner x (relative)
 * @param {Integer} y top-left corner y (relative)
 * @param {Integer} zoomFactor zoom factor.
 * @returns {DPLMovieRectangle} the rectangle drawn for this allocable
 */
export const drawAllocable = function (canvasContext, text, backgroundColor, xStart, xEnd, y, zoomFactor) {
  ASSERT(xStart < xEnd, `the x positions are not respected : xStart:${xStart} - xEnd:${xEnd}`);

  const finalHeight = getAllocaleDimension(zoomFactor);
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
  _drawText(canvasContext, text, xStart + finalWidth / 2, y + finalHeight / 2, zoomFactor);

  // return the positions.
  return new DPLMovieRectangle(xStart, y, finalWidth, finalHeight, finalLineWidth);
};

/** draw an arrow with a text aside, from (xStart;yStart) to (xEnd;yEnd).
 * @param {CanvasRenderingContext2D} canvasContext canvas context on which to draw.
 * @param {String} text text to write
 * @param {String} color color of the arrow
 * @param {Integer} xStart start X position (relative)
 * @param {Integer} yStart start Y position (relative)
 * @param {Integer} xEnd end X position (relative)
 * @param {Integer} yEnd end Y position (relative)
 * @param {Integer} zoomFactor zoom factor.
 * @returns an Arrow object with pointerLength, thickness, xStart, yStart, xEnd, and yEnd properties.
 */
export const drawArrow = function (canvasContext, text, color, xStart, yStart, xEnd, yEnd, zoomFactor) {
  const arrowThickness = ARROW_BASE_LINEWIDTH * zoomFactor;
  const pointingEndLineLength = ARROW_BASE_ENDLINE * zoomFactor;
  canvasContext.lineWidth = arrowThickness;
  canvasContext.lineJoin = "round";
  canvasContext.fillStyle = color;
  canvasContext.strokeStyle = color;
  canvasContext.beginPath();
  canvasContext.moveTo(xStart, yStart);
  canvasContext.lineTo(xEnd, yEnd);
  canvasContext.stroke();

  // draw the pointing head
  const dx = xEnd - xStart;
  const dy = yEnd - yStart;
  const angle = Math.atan2(dy, dx);
  canvasContext.lineTo(xEnd - pointingEndLineLength * Math.cos(angle - Math.PI / 6), yEnd - pointingEndLineLength * Math.sin(angle - Math.PI / 6));
  canvasContext.moveTo(xEnd, yEnd);
  canvasContext.lineTo(xEnd - pointingEndLineLength * Math.cos(angle + Math.PI / 6), yEnd - pointingEndLineLength * Math.sin(angle + Math.PI / 6));
  canvasContext.stroke();

  // draw the text
  const textXcenter = xStart + (xEnd - xStart) / 2;
  const textYcenter = yStart + (yEnd - yStart) / 2;
  const radius = PREFEREDFONTSIZE * zoomFactor;
  canvasContext.fillStyle = "white";
  canvasContext.strokeStyle = "white";
  canvasContext.beginPath();
  canvasContext.ellipse(textXcenter, textYcenter, radius, radius, 0, 0, Math.PI * 2);
  canvasContext.fill();
  _drawText(canvasContext, text, textXcenter, textYcenter, zoomFactor);

  return { pointerLength: pointingEndLineLength, thickness: arrowThickness, xStart: xStart, yStart: yStart, xEnd: xEnd, yEnd: yEnd };
};

const _drawText = function (canvasContext, text, x, y, zoomFactor) {
  canvasContext.font = `${Math.floor(PREFEREDFONTSIZE * zoomFactor)}px ${FONT}`;
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.lineWidth = 1;
  canvasContext.fillStyle = TEXTCOLOR;
  canvasContext.fillText(text, x, y);
  canvasContext.stroke();
};
