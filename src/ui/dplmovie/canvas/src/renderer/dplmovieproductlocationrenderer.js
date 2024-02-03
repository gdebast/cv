import {
  ASSERT,
  ASSERT_EXIST,
} from "../../../../../model/utility/assert/assert";
import {
  drawHeaderCell,
  getHeaderCellHeigth,
  getLineWidth,
} from "./src/dplmovierendererhelper";

const OBJECTLASS_HANDLEDTYPE = "ProductLocation";

/* values are in pixels */
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X = 30;
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y = 40;
const PRODUCTLOCATION_CELL_BASE_Y_INCREMENT = 5;

/*color*/
const PRODUCTLOCATION_CELL_BACKGROUNDCOLOR = "#1864ab";

/** class responsible for rendering ProductLocation of a DPL Movie as cell header.
 * @param canvasContext canvas on which to draw.
 */
export class DPLMovieProductLocationRenderer {
  constructor(canvasContext) {
    ASSERT_EXIST(canvasContext);
    this._canvasContext = canvasContext;
    this._intialize();
  }

  // ------
  // PUBLIC
  // ------

  /** render the ProductLocations of the given DPLMovieRuntime.
   *  @param dplMovieRuntime DPLMovie runtime.
   */
  render(dplMovieRuntime) {
    ASSERT_EXIST(this._canvasContext);
    ASSERT_EXIST(dplMovieRuntime);
    const productLocationTrackedObjects = dplMovieRuntime.getTrackedObjects(
      OBJECTLASS_HANDLEDTYPE
    );
    for (const productLocation of productLocationTrackedObjects) {
      this._drawOneProductLocation(productLocation);
      this._incrementPosition();
    }
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const [_, rect] of this._productLocationPositions) {
      this._canvasContext.clearRect(
        rect.X - rect.LineWidth,
        rect.Y - rect.LineWidth,
        rect.Width + 2 * rect.LineWidth,
        rect.Height + 2 * rect.LineWidth
      );
    }
    this._productLocationPositions = new Map();
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y;
  }

  /** return the positions of the ProductLocations
   * @returns map of productLocationId and rectangle of those ProductLocation
   */
  getProductLocationPositions() {
    return this._productLocationPositions;
  }

  // -------
  // PRIVATE
  // -------

  /** intialize the renderer.
   */
  _intialize() {
    this._productLocationPositions = new Map();
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y;
  }

  /** draw one product-location cell.
   * @param {DPLMovieTrackedObject} ProductLocattionTrackedObject
   */
  _drawOneProductLocation(ProductLocattionTrackedObject) {
    ASSERT(
      ProductLocattionTrackedObject.Type === OBJECTLASS_HANDLEDTYPE,
      `Tracked object with type '${ProductLocattionTrackedObject.Type}' and id '${ProductLocattionTrackedObject.Id}' is not expected type '${OBJECTLASS_HANDLEDTYPE}'`
    );
    const context = this._canvasContext;

    const createdRect = drawHeaderCell(
      context,
      ProductLocattionTrackedObject.Id,
      PRODUCTLOCATION_CELL_BACKGROUNDCOLOR,
      this._currentX,
      this._currentY,
      1 /*zoomFactor*/
    );

    this._productLocationPositions.set(
      ProductLocattionTrackedObject.Id,
      createdRect
    );
  }

  /** increment the positionning to render the next Product-Location
   */
  _incrementPosition() {
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY +=
      PRODUCTLOCATION_CELL_BASE_Y_INCREMENT +
      getLineWidth(1 /*zoomFactor*/) +
      getHeaderCellHeigth(1 /*zoomFactor*/);
  }
}
