/** holds all geometry parameters.
 */
export class DPLMovieGeometryConfig {
  constructor(factor, xRef, yRef) {
    this._zoomFactor = factor; /*zoom factor */
    this._xRef = xRef; /*reference of the X coordinates*/
    this._yRef = yRef; /*reference of the Y coordinates*/
  }

  // simple setters and getters
  set zoomFactor(factor) {
    this._zoomFactor = factor;
  }
  set xRef(xRef) {
    this._xRef = xRef;
  }
  set yRef(yRef) {
    this._yRef = yRef;
  }
  get zoomFactor() {
    return this._zoomFactor;
  }
  get xRef() {
    return this._xRef;
  }
  get yRef() {
    return this._yRef;
  }
}
