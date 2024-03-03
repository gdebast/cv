"use strict";

import { ASSERT, ASSERT_EXIST, ASSERT_ISSTRING } from "../../../../../model/utility/assert/assert";
import { DPLMovieAllocableLinkRenderer } from "./dplmovieallocablelinkrenderer";
import { DPLMovieAllocableRenderer } from "./dplmovieallocablerenderer";
import { DPLMovieBucketRenderer } from "./dplmoviebucketrenderer";
import { mergeRectangles } from "./src/dplmovierectangle";
import { drawHeaderCell, eraseRectangle } from "./src/dplmovierendererhelper";

const OBJECTLASS_HANDLEDTYPE = "ProductLocation";

/* values are in pixels */
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X = 30;
const PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y = 40;
const PRODUCTLOCATION_CELL_BASE_Y_INCREMENT = 80;

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
    this._productLocationTotalRects = new Map(); /*holds a productLocationId->Rectangle map which gives the total rectangle for this id */
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X;
    this._currentY = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y;
    this._bucketRenderer = new DPLMovieBucketRenderer(this._canvasContext, this, this._geometryConfig);
    this._icdRenderer = new DPLMovieAllocableRenderer(
      this._canvasContext,
      this,
      this._bucketRenderer,
      this._geometryConfig,
      "InventoryConsumerDetail",
      "ICD"
    );
    this._ipdRenderer = new DPLMovieAllocableRenderer(
      this._canvasContext,
      this,
      this._bucketRenderer,
      this._geometryConfig,
      "InventoryProducerDetail",
      "IPD"
    );
    this._openInternalAllocationRenderer = new DPLMovieAllocableRenderer(
      this._canvasContext,
      this,
      this._bucketRenderer,
      this._geometryConfig,
      "DPLOpenInternalAllocation",
      "opened"
    );
    this._internalAllocationRenderer = new DPLMovieAllocableLinkRenderer(
      this._canvasContext,
      this._ipdRenderer,
      this._icdRenderer,
      this._geometryConfig,
      "DPLInternalAllocation",
      "InventoryProducerDetailId",
      "InventoryConsumerDetailId",
      "Quantity"
    );
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
      this._drawOneProductLocation(productLocation, dplMovieRuntime);
      this._incrementPosition(productLocation.Id);
    }

    /*draw the allocations*/
    // these are drawn once all allocables have been drawn.
    this._internalAllocationRenderer.render(dplMovieRuntime);
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const [productLocationId, rect] of this._productLocationTotalRects) {
      eraseRectangle(this._canvasContext, rect);
      this._bucketRenderer.reset(productLocationId);
    }
    this._icdRenderer.reset();
    this._productLocationTotalRects = new Map();
    this._currentX = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_X - this._geometryConfig.xRef;
    this._currentY = PRODUCTLOCATION_CELL_BASE_STARTPOSITION_Y - this._geometryConfig.yRef;
  }

  /** returns the rectangle that this productLocation is currently occupying in total.
   * @param {String} productLocationId id of the ProductLocation
   * @returns {DPLMovieRectangle} rectangle occupied by this ProductLocation
   */
  getProductLocationCurrentTotalRectangle(productLocationId) {
    ASSERT_ISSTRING(productLocationId);
    ASSERT(this._productLocationTotalRects.has(productLocationId), `unknown '${productLocationId}' ProductLocation`);
    return this._productLocationTotalRects.get(productLocationId);
  }

  // -------
  // PRIVATE
  // -------

  /** draw one product-location cell.
   * @param {DPLMovieTrackedObject} ProductLocationTrackedObject
   */
  _drawOneProductLocation(ProductLocationTrackedObject, dplMovieRuntime) {
    ASSERT(
      ProductLocationTrackedObject.Type === OBJECTLASS_HANDLEDTYPE,
      `Tracked object with type '${ProductLocationTrackedObject.Type}' and id '${ProductLocationTrackedObject.Id}' is not expected type '${OBJECTLASS_HANDLEDTYPE}'`
    );
    const context = this._canvasContext;

    /*draw the product-location header cell*/
    const productLocationRect = drawHeaderCell(
      context,
      ProductLocationTrackedObject.Id,
      PRODUCTLOCATION_CELL_BACKGROUNDCOLOR,
      this._currentX,
      this._currentY,
      this._geometryConfig.zoomFactor,
      this._geometryConfig
    );

    /*draw the Buckets*/
    const globalBucketRect = this._bucketRenderer.render(dplMovieRuntime, ProductLocationTrackedObject, productLocationRect);
    const totalAfterBucketDrawingRect = mergeRectangles(productLocationRect, globalBucketRect);
    this._productLocationTotalRects.set(ProductLocationTrackedObject.Id, totalAfterBucketDrawingRect);

    /*draw the inventory consumer details*/
    const globalICDRect = this._icdRenderer.render(dplMovieRuntime, ProductLocationTrackedObject, productLocationRect);
    const totalAfterICDDrawingRect = mergeRectangles(totalAfterBucketDrawingRect, globalICDRect);
    this._productLocationTotalRects.set(ProductLocationTrackedObject.Id, totalAfterICDDrawingRect);

    /*draw the inventory producer details*/
    const globalIPDRect = this._ipdRenderer.render(dplMovieRuntime, ProductLocationTrackedObject, productLocationRect);
    const totalAfterIPDDrawingRect = mergeRectangles(totalAfterICDDrawingRect, globalIPDRect);
    this._productLocationTotalRects.set(ProductLocationTrackedObject.Id, totalAfterIPDDrawingRect);

    /*draw the open allocations*/
    const globalOpenAllocationRect = this._openInternalAllocationRenderer.render(dplMovieRuntime, ProductLocationTrackedObject, productLocationRect);
    const totalAfterOpenDrawingRect = mergeRectangles(totalAfterIPDDrawingRect, globalOpenAllocationRect);
    this._productLocationTotalRects.set(ProductLocationTrackedObject.Id, totalAfterOpenDrawingRect);
  }

  /** increment the positionning to render the next Product-Location
   *  @param {String} productLocationId previous product-Location Id
   */
  _incrementPosition(productLocationId) {
    this._currentY +=
      PRODUCTLOCATION_CELL_BASE_Y_INCREMENT * this._geometryConfig.zoomFactor + this._productLocationTotalRects.get(productLocationId).Heigth;
  }
}
