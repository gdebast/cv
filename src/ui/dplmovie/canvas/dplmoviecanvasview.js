"use strict";

import { ASSERT_EXIST } from "../../../model/utility/assert/assert";
import { DPLMovieAllocableLinkRenderer } from "./src/renderer/dplmovieallocablelinkrenderer";
import { DPLMovieAllocableRenderer } from "./src/renderer/dplmovieallocablerenderer";
import { DPLMovieBucketRenderer } from "./src/renderer/dplmoviebucketrenderer";
import { DPLMovieProductLocationRenderer } from "./src/renderer/dplmovieproductlocationrenderer";
import { DPLMovieGeometryConfig } from "./src/renderer/src/dplmoviegeometryconfig";

const CLASS_DPLMOVIECANVAS = "dplmovie-canvas";
const CLASS_GRABBEDDPLMOVIECANVAS = "grabbed-dplmovie-canvas";

/** handles the html canvas displaying the DPL movie
 * @param dplMovieRuntimeView the side view which controls which DPLMovie runtime to display.
 * @param dplMoviePlayerView the player view which plays the movie forward, backward and .
 */
export class DPLMovieCanvasView {
  constructor(dplMovieRuntimeView, dplMoviePlayerView) {
    ASSERT_EXIST(dplMovieRuntimeView);
    ASSERT_EXIST(dplMoviePlayerView);
    this._dplMovieRuntimeToPlay = null;
    dplMovieRuntimeView.registerObserver(this);
    this._inializeCanvas();
    this._createRenderers();
    dplMoviePlayerView.registerObserver(this);
  }

  // implement observer pattern with DPLMovieRuntimeView
  notifyDeletePoolObject(poolObject) {
    if (poolObject === this._dplMovieRuntimeToPlay) {
      this._dplMovieRuntimeToPlay = null;
      this._eraseCanvas();
    }
  }
  notifySelectedPoolObject(poolObject) {
    ASSERT_EXIST(poolObject);
    if (poolObject === this._dplMovieRuntimeToPlay) return;
    this._dplMovieRuntimeToPlay = poolObject;
    this._eraseCanvas();
    this._displayOnCanvas();
  }

  // implement observer pattern with DPLMoviePlayerView (forward, backward, reset)
  notifyOnPlayerPressed() {
    this._eraseCanvas();
    this._displayOnCanvas();
  }

  // -------
  // PRIVATE
  // -------
  /** initialize the canvas.
   */
  _inializeCanvas() {
    const canvas = document.querySelector(`.${CLASS_DPLMOVIECANVAS}`);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this._canvasContext = canvas.getContext("2d");

    this._geometryConfig = new DPLMovieGeometryConfig(1, 0, 0);

    const self = this;
    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      self._eraseCanvas();
      self._displayOnCanvas();
    });

    // zoom
    canvas.addEventListener("wheel", function (event) {
      if (!event.shiftKey) return;
      self._eraseCanvas();
      self._geometryConfig.zoomFactor = self._computeNewZoomFactor(self._geometryConfig.zoomFactor, event.wheelDeltaY);
      self._displayOnCanvas();
    });

    // Drag logic
    this._mouseKeyDown = false;
    canvas.addEventListener("mousedown", function () {
      self._mouseKeyDown = true;
      // add a grabbing mousse
      canvas.classList.add(CLASS_GRABBEDDPLMOVIECANVAS);
    });
    canvas.addEventListener("mousemove", function (event) {
      if (!self._mouseKeyDown) return;
      self._eraseCanvas();
      self._geometryConfig.xRef = self._geometryConfig.xRef - event.movementX;
      self._geometryConfig.yRef = self._geometryConfig.yRef - event.movementY;
      self._displayOnCanvas();
    });
    canvas.addEventListener("mouseup", function () {
      self._mouseKeyDown = false;
      // remove the grabbing mouse
      canvas.classList.remove(CLASS_GRABBEDDPLMOVIECANVAS);
    });
  }

  /** erase the entire canvas.
   */
  _eraseCanvas() {
    this._renderers.forEach(function (renderer) {
      renderer.reset();
    });
  }

  /** display the DPLMovie state on the canvas.
   */
  _displayOnCanvas() {
    ASSERT_EXIST(this._canvasContext);
    /*no rendering if there are no runtime to display */
    if (!this._dplMovieRuntimeToPlay) return;
    const self = this;
    this._renderers.forEach(function (renderer) {
      renderer.render(self._dplMovieRuntimeToPlay);
    });
  }

  /** create all renders for each tracked object type to display
   */
  _createRenderers() {
    this._renderers = [];
    const productLocationRenderer = new DPLMovieProductLocationRenderer(this._canvasContext, this._geometryConfig);
    const bucketRenderer = new DPLMovieBucketRenderer(this._canvasContext, productLocationRenderer, this._geometryConfig);
    const icdRenderer = new DPLMovieAllocableRenderer(
      this._canvasContext,
      productLocationRenderer,
      bucketRenderer,
      this._geometryConfig,
      "InventoryConsumerDetail",
      "ICD"
    );
    const ipdRenderer = new DPLMovieAllocableRenderer(
      this._canvasContext,
      productLocationRenderer,
      bucketRenderer,
      this._geometryConfig,
      "InventoryProducerDetail",
      "IPD"
    );
    const openAllocationRenderer = new DPLMovieAllocableRenderer(
      this._canvasContext,
      productLocationRenderer,
      bucketRenderer,
      this._geometryConfig,
      "DPLOpenInternalAllocation",
      "Opened"
    );
    const internalAllocationRenderer = new DPLMovieAllocableLinkRenderer(
      this._canvasContext,
      ipdRenderer,
      icdRenderer,
      this._geometryConfig,
      "DPLInternalAllocation",
      "InventoryProducerDetailId",
      "InventoryConsumerDetailId",
      "Quantity"
    );
    this._renderers.push(productLocationRenderer);
    this._renderers.push(bucketRenderer);
    this._renderers.push(icdRenderer);
    this._renderers.push(ipdRenderer);
    this._renderers.push(openAllocationRenderer);
    this._renderers.push(internalAllocationRenderer);

    /*TODO: this system of renderer registered linerly will not work 
      because if the line header grow, the second productlocation 
      cell is already drawn. A better architecture is to chain the renderer:
      when a productlocation is done, we can draw it buckets.
      when the bucket are done, we can draw its lines.
      the productlocation renderer should have a registerAfterProductLocationDrawnObserver,
      which is the bucket, and the allocable headers
     */
  }

  /** given a previous factor and an input (a positive or negative value),
   *  this method computes the new zomm factor.
   *  @param {Integer} previousFactor previous zoom factor.
   *  @param {Integer} input negative (zoom out) or positive (zoom in) number
   *  @returns {Float} new zoom factor.
   */
  _computeNewZoomFactor(previousFactor, input) {
    if (input === 0) return previousFactor;
    const result = previousFactor + (input > 0 ? 0.05 : -0.05);
    if (result <= 0.2) return 0.2; /*min reach */
    if (result >= 2) return 2; /*max reach */
    return result;
  }
}
