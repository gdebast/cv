import { ASSERT, ASSERT_TYPE } from "../../../../../../model/utility/assert/assert";

export class DPLMovieRectangle {
  /**
   * this class represents a rectangle drawn for the DPLMovie.
   * @param {Integer} x x position
   * @param {Integer} y y position
   * @param {Integer} width
   * @param {Integer} heigth
   * @param {Integer} lineWidth width of the line bordering the rectangle.
   */
  constructor(x, y, width, heigth, lineWidth) {
    ASSERT(width > 0, `width must be positive : ${width}`);
    ASSERT(heigth > 0, `heigth must be positive : ${heigth}`);
    ASSERT(lineWidth > 0, `lineWidth must be positive : ${lineWidth}`);
    this._x = x;
    this._y = y;
    this._width = width;
    this._heigth = heigth;
    this._lineWidth = lineWidth;
  }

  // simple getters
  get X() {
    return this._x;
  }
  get Y() {
    return this._y;
  }
  get Width() {
    return this._width;
  }
  get Heigth() {
    return this._heigth;
  }
  get LineWidth() {
    return this._lineWidth;
  }
}

/** merge two rectangle and return the merged one.
 * @param {DPLMovieRectangle} rect1
 * @param {DPLMovieRectangle} rect2
 * @returns {DPLMovieRectangle} merged rectangle
 */
export const mergeRectangles = function (rect1, rect2) {
  ASSERT_TYPE(rect1, DPLMovieRectangle);
  ASSERT_TYPE(rect2, DPLMovieRectangle);

  // X positions
  const xStart = Math.min(rect1.X, rect2.X);
  const xEnd = Math.max(rect1.X + rect1.Width, rect2.X + rect2.Width);
  ASSERT(xStart < xEnd, `making a rectangle is impossible because the computed X's are wrong : xStart = ${xStart} - xEnd = ${xEnd}`);

  // Y positions
  const yStart = Math.min(rect1.Y, rect2.Y);
  const yEnd = Math.max(rect1.Y + rect1.Heigth, rect2.Y + rect2.Heigth);
  ASSERT(yStart < yEnd, `making a rectangle is impossible because the computed Y's are wrong : yStart = ${yStart} - yEnd = ${yEnd}`);

  return new DPLMovieRectangle(xStart, yStart, xEnd - xStart, yEnd - yStart, Math.max(rect1.LineWidth, rect2.LineWidth));
};
