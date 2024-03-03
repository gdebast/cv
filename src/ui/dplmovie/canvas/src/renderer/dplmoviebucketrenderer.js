"use strict";

import { drawHeaderCell, getHeaderCellWith } from "./src/dplmovierendererhelper";
import { ASSERT, ASSERT_EXIST, ASSERT_ISSTRING } from "../../../../../model/utility/assert/assert";
import { mergeRectangles } from "./src/dplmovierectangle";

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
    this._bucketPositions = new Map(); /*productLocationId->BucketId->rectangle map */
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

  /** render the Bukets for the product-location using the data in the dpl movie.
   *  @param {DPLMovieRuntime} dplMovieRuntime DPLMovie runtime.
   *  @param {DPLMovieTrackedObject} productLocationTrackedObject the product-location for which to render the buckets
   *  @param {DPLMovieRectangle} productLocationRectangle rectangle giving the position of the header of this Product-Location
   *  @returns {DPLMovieRectangle} extended rectangle of all drawn buckets
   */
  render(dplMovieRuntime, productLocationTrackedObject, productLocationRectangle) {
    ASSERT_EXIST(this._canvasContext);
    ASSERT_EXIST(dplMovieRuntime);
    ASSERT_EXIST(productLocationTrackedObject);
    ASSERT_EXIST(productLocationRectangle);
    const BucketTrackedObjects = dplMovieRuntime.getTrackedObjects(OBJECTLASS_HANDLEDTYPE);

    // sort the buckets based on their Number
    BucketTrackedObjects.sort(function (bucket1, bucket2) {
      return bucket1.Number < bucket2.Number ? -1 : 1;
    });

    let bucketPosition = 0;
    let totalRect = null;
    for (const bucket of BucketTrackedObjects) {
      const newRect = this._drawOneBucket(productLocationTrackedObject.Id, bucket, productLocationRectangle, bucketPosition);
      bucketPosition++;
      if (totalRect === null) totalRect = newRect;
      else totalRect = mergeRectangles(totalRect, newRect);
    }
    return totalRect;
  }

  /** reset for this product-location.
   * @param {String} productLocationId
   */
  reset(productLocationId) {
    ASSERT_ISSTRING(productLocationId);
    ASSERT(this._bucketPositions.has(productLocationId), `unknown product-location id ${productLocationId}`);
    this._bucketPositions.delete(productLocationId);
  }

  // -------
  // PRIVATE
  // -------

  /** draw one bucket next to the product-location rectangle
   * @param {String} productLocationId id of the product-location for which we are drawing this bucket.
   * @param {DPLMovieTrackedObject} bucket bucket to render
   * @param {DPLMovieRectangle} productLocationRect rectangle object.
   * @param {Integer} bucketPosition position of the bucket (0 = first)
   * @returns {DPLMovieRectangle} the drawn rectangle
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
    return rect;
  }

  /** add a rectangle where a bucket has been drawn, to the map.
   * @param {DPLMovieRectangle} rectangle
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
}
