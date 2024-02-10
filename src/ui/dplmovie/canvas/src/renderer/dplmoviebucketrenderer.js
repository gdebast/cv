import {
  drawHeaderCell,
  getHeaderCellWith,
} from "./src/dplmovierendererhelper";
import { ASSERT_EXIST } from "../../../../../model/utility/assert/assert";

const OBJECTLASS_HANDLEDTYPE = "Bucket";

const BUCKET_CELL_BASE_X_INCREMENT = 10;

/*color*/
const BUCKET_CELL_BACKGROUNDCOLOR = "#228be6";

/** class responsible for rendering ProductLocation of a DPL Movie as cell header.
 * @param canvasContext canvas on which to draw.
 * @param dplMovieProductLocationRenderer renderer of the Product-Locations
 * @param geometryConfig configuration of the geometry.
 */
export class DPLMovieBucketRenderer {
  constructor(canvasContext, dplMovieProductLocationRenderer, geometryConfig) {
    ASSERT_EXIST(canvasContext);
    ASSERT_EXIST(dplMovieProductLocationRenderer);
    ASSERT_EXIST(geometryConfig);
    this._canvasContext = canvasContext;
    this._productLocationRenderer = dplMovieProductLocationRenderer;
    this._geometryConfig = geometryConfig;
    this._intialize();
  }

  // ------
  // PUBLIC
  // ------

  /** render the Bukets of the given DPLMovieRuntime.
   *  @param dplMovieRuntime DPLMovie runtime.
   */
  render(dplMovieRuntime) {
    ASSERT_EXIST(this._canvasContext);
    ASSERT_EXIST(dplMovieRuntime);
    const BucketTrackedObjects = dplMovieRuntime.getTrackedObjects(
      OBJECTLASS_HANDLEDTYPE
    );

    // sort the buckets based on their Number
    BucketTrackedObjects.sort(function (bucket1, bucket2) {
      return bucket1.Number < bucket2.Number ? -1 : 1;
    });

    for (const [
      _,
      productLocationRect,
    ] of this._productLocationRenderer.getProductLocationPositions()) {
      for (const bucket of BucketTrackedObjects) {
        this._drawOneBucket(bucket, productLocationRect);
      }
    }
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const [_, rect] of this._bucketPositions) {
      this._canvasContext.clearRect(
        rect.X - rect.LineWidth,
        rect.Y - rect.LineWidth,
        rect.Width + 2 * rect.LineWidth,
        rect.Height + 2 * rect.LineWidth
      );
    }
    this._bucketPositions = new Map();
  }

  // -------
  // PRIVATE
  // -------

  /** draw one bucket next to the product-location rectangle
   * @param {DPLMovieTrackedObject} bucket bucket to render
   * @param {Object} productLocationRect rectangle object.
   */
  _drawOneBucket(bucket, productLocationRect) {
    const x =
      productLocationRect.X +
      productLocationRect.Width +
      BUCKET_CELL_BASE_X_INCREMENT * this._geometryConfig.zoomFactor +
      (BUCKET_CELL_BASE_X_INCREMENT * this._geometryConfig.zoomFactor +
        getHeaderCellWith(this._geometryConfig.zoomFactor)) *
        (bucket.Number - 1);
    const y = productLocationRect.Y;

    const rect = drawHeaderCell(
      this._canvasContext,
      bucket.Id,
      BUCKET_CELL_BACKGROUNDCOLOR,
      x,
      y,
      this._geometryConfig.zoomFactor
    );
    this._bucketPositions.set(bucket.Id, rect);
  }

  /** intialize the renderer.
   */
  _intialize() {
    this._bucketPositions = new Map();
  }
}
