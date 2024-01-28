import { ASSERT, ASSERT_EXIST } from "../../../../model/utility/assert/assert";

const OBJECTLASS_HANDLEDTYPE = "ProductLocation";

/* values are in pixels */
const PRODUCTLOCATION_CELL_BASE_HEIGHT = 75;
const PRODUCTLOCATION_CELL_BASE_WIDTH = 200;
const PRODUCTLOCATION_CELL_BASE_ROUNDNESS = 10;
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X = 30;
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y = 40;
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y_INCREMENT = 5;
const PRODUCTLOCATION_BASE_PREFEREDFONTSIZE = 20;

export class DPLMovieProductLocationRenderer {
  constructor(canvasContext) {
    ASSERT_EXIST(canvasContext);
    this._canvasContext = canvasContext;
    this._intialize();
  }

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

  /** reset the renderer.
   */
  reset() {
    for (const [_, rect] of this._productLocationPositions) {
      this._canvasContext.clearRect(rect.X, rect.Y, rect.Width, rect.Height);
    }
    this._productLocationPositions = new Map();
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y;
  }

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

    // draw the rectangle
    context.beginPath();
    context.roundRect(
      this._currentX,
      this._currentY,
      PRODUCTLOCATION_CELL_BASE_WIDTH,
      PRODUCTLOCATION_CELL_BASE_HEIGHT,
      [PRODUCTLOCATION_CELL_BASE_ROUNDNESS]
    );
    context.stroke();

    // draw the text
    context.font = `${PRODUCTLOCATION_BASE_PREFEREDFONTSIZE}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeText(
      ProductLocattionTrackedObject.Id,
      this._currentX + PRODUCTLOCATION_CELL_BASE_WIDTH / 2,
      this._currentY + PRODUCTLOCATION_CELL_BASE_HEIGHT / 2
    );

    // remember the positions.
    const lineSize = 1;
    this._productLocationPositions.set(ProductLocattionTrackedObject.Id, {
      X: this._currentX - lineSize,
      Y: this._currentY - lineSize,
      Width: PRODUCTLOCATION_CELL_BASE_WIDTH + 2 * lineSize,
      Height: PRODUCTLOCATION_CELL_BASE_HEIGHT + 2 * lineSize,
    });
  }

  /** increment the positionning to render the next Product-Location
   */
  _incrementPosition() {
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY += PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y_INCREMENT;
  }
}
