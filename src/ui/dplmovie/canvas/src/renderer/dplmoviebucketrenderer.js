import { drawHeaderCell, eraseRectangle, getHeaderCellWith } from "./src/dplmovierendererhelper";
import { ASSERT, ASSERT_EXIST, ASSERT_ISSTRING } from "../../../../../model/utility/assert/assert";

const OBJECTLASS_HANDLEDTYPE = "Bucket";

const BUCKET_CELL_BASE_X_INCREMENT = 10;

/*color*/
const BUCKET_CELL_BACKGROUNDCOLOR = "#a7d1f5";

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

  /**
   * @param {String} productLocationId
   * @param {String} bucketId
   * @returns the rectangle drawn for this bucket and this product-location.
   */
  getProductLocationBucketPosition(productLocationId, bucketId) {
    ASSERT_ISSTRING(productLocationId);
    ASSERT_ISSTRING(bucketId);
    return this._bucketPositions.get(productLocationId).get(bucketId);
  }

  /** render the Bukets of the given DPLMovieRuntime.
   *  @param dplMovieRuntime DPLMovie runtime.
   */
  render(dplMovieRuntime) {
    ASSERT_EXIST(this._canvasContext);
    ASSERT_EXIST(dplMovieRuntime);
    const BucketTrackedObjects = dplMovieRuntime.getTrackedObjects(OBJECTLASS_HANDLEDTYPE);

    // sort the buckets based on their Number
    BucketTrackedObjects.sort(function (bucket1, bucket2) {
      return bucket1.Number < bucket2.Number ? -1 : 1;
    });

    for (const [prodLocId, productLocationRect] of this._productLocationRenderer.getProductLocationPositions()) {
      let bucketPosition = 0;
      for (const bucket of BucketTrackedObjects) {
        this._drawOneBucket(prodLocId, bucket, productLocationRect, bucketPosition);
        bucketPosition++;
      }
    }
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const [_, bucketRectMap] of this._bucketPositions) {
      for (const [_, rect] of bucketRectMap) {
        eraseRectangle(this._canvasContext, rect);
      }
    }
    this._bucketPositions = new Map();
  }

  // -------
  // PRIVATE
  // -------

  /** draw one bucket next to the product-location rectangle
   * @param {String} productLocationId id of the product-location for which we are drawing this bucket.
   * @param {DPLMovieTrackedObject} bucket bucket to render
   * @param {Object} productLocationRect rectangle object.
   * @param {Integer} bucketPosition position of the bucket (0 = first)
   */
  _drawOneBucket(productLocationId, bucket, productLocationRect, bucketPosition) {
    const x =
      productLocationRect.X +
      productLocationRect.Width +
      BUCKET_CELL_BASE_X_INCREMENT * this._geometryConfig.zoomFactor +
      (BUCKET_CELL_BASE_X_INCREMENT * this._geometryConfig.zoomFactor + getHeaderCellWith(this._geometryConfig.zoomFactor)) * bucketPosition;
    const y = productLocationRect.Y;

    const rect = drawHeaderCell(this._canvasContext, bucket.Id, BUCKET_CELL_BACKGROUNDCOLOR, x, y, this._geometryConfig.zoomFactor);
    this._addRectangle(rect, productLocationId, bucket.Id);
  }

  /** add a rectangle where a bucket has been drawn, to the map.
   * @param {Object} rectangle
   * @param {String} productLocationId first index
   * @param {String} bucketId second index
   */
  _addRectangle(rectangle, productLocationId, bucketId) {
    const existingBucketMap = this._bucketPositions.get(productLocationId);
    if (!existingBucketMap) {
      const newBucketMap = new Map();
      newBucketMap.set(bucketId, rectangle);
      this._bucketPositions.set(productLocationId, newBucketMap);
      return;
    }
    ASSERT(!existingBucketMap.get(bucketId), `the rectangle at '${productLocationId}-${bucketId}' has already be made`);
    existingBucketMap.set(bucketId, rectangle);
  }

  /** intialize the renderer.
   */
  _intialize() {
    this._bucketPositions = new Map();
  }
}
