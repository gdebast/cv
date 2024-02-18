import { ASSERT, ASSERT_EXIST } from "../../../../../model/utility/assert/assert";
import { drawHeaderCell, eraseRectangle, getHeaderCellHeigth, getLineWidth } from "./src/dplmovierendererhelper";

const OBJECTLASS_HANDLEDTYPE = "ProductLocation";

/* values are in pixels */
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X = 30;
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y = 40;
const PRODUCTLOCATION_CELL_BASE_Y_INCREMENT = 5;

/*color*/
const PRODUCTLOCATION_CELL_BACKGROUNDCOLOR = "#228be6";

/** class responsible for rendering ProductLocation of a DPL Movie as cell header.
 * @param canvasContext canvas on which to draw.
 * @param geometryConfig configuration of the geometry.
 */
export class DPLMovieProductLocationRenderer {
  constructor(canvasContext, geometryConfig) {
    ASSERT_EXIST(canvasContext);
    ASSERT_EXIST(geometryConfig);
    this._canvasContext = canvasContext;
    this._geometryConfig = geometryConfig;
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
    const productLocationTrackedObjects = dplMovieRuntime.getTrackedObjects(OBJECTLASS_HANDLEDTYPE);
    for (const productLocation of productLocationTrackedObjects) {
      this._drawOneProductLocation(productLocation);
      this._incrementPosition(productLocation.Id);
    }
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const [_, rect] of this._productLocationPositions) {
      eraseRectangle(this._canvasContext, rect);
    }
    this._productLocationPositions = new Map();
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X - this._geometryConfig.xRef;
    this._currentY = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y - this._geometryConfig.yRef;
    this._reservedVerticalSpaces = new Map();
  }

  /** return the positions of the ProductLocations
   * @returns map of productLocationId and rectangle of those ProductLocation
   */
  getProductLocationPositions() {
    return this._productLocationPositions;
  }

  /** get the reserved space for this product-location id up to now.
   *  The returned value is without zooming factor.
   * @param {String} productLocationId
   */
  getReservedSpace(productLocationId) {
    if (!this._reservedVerticalSpaces.has(productLocationId)) return 0;
    return this._reservedVerticalSpaces.get(productLocationId);
  }

  /** reserve space for this product-location id.
   *  The given value is without zooming factor.
   * @param {String} productLocationId
   * @param {Integer} heigthToReserve
   */
  reserveSpace(productLocationId, heigthToReserve) {
    if (!this._reservedVerticalSpaces.has(productLocationId)) {
      this._reservedVerticalSpaces.set(productLocationId, heigthToReserve);
      return;
    }
    const spaceUpTonow = this._reservedVerticalSpaces.get(productLocationId);
    this._reservedVerticalSpaces.set(productLocationId, spaceUpTonow + heigthToReserve);
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
    this._reservedVerticalSpaces = new Map(); /* ProductLocationId->integer map, containing vertical spaces registered by other components */
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
      this._geometryConfig.zoomFactor,
      this._geometryConfig
    );

    this._productLocationPositions.set(ProductLocattionTrackedObject.Id, createdRect);
  }

  /** increment the positionning to render the next Product-Location
   *  @param {String} productLocationId previous product-Location Id
   */
  _incrementPosition(productLocationId) {
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY +=
      PRODUCTLOCATION_CELL_BASE_Y_INCREMENT * this._geometryConfig.zoomFactor +
      this.getReservedSpace(productLocationId) * this._geometryConfig.zoomFactor +
      getLineWidth(this._geometryConfig.zoomFactor) +
      getHeaderCellHeigth(this._geometryConfig.zoomFactor);
  }
}
