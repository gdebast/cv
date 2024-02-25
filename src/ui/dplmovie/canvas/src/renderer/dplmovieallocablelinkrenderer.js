import { ASSERT, ASSERT_EXIST, ASSERT_ISSTRING } from "../../../../../model/utility/assert/assert";
import { drawArrow, eraseArrow } from "./src/dplmovierendererhelper";

export class DPLMovieAllocableLinkRenderer {
  /** class responsible for renderering any link/line from one allocable to another.
   * @param canvasContext canvas on which to draw.
   * @param fromAllocableRenderer renderer of the allocables from which start the links
   * @param toAllocableRenderer renderer of the allocables to which points the links
   * @param geometryConfig configuration of the geometry.
   * @param {String} objectClassId object class to display
   * @param {String} fromAllocableProperty property of the object class to display which holds the reference to the from allocable
   * @param {String} toAllocableProperty property of the object class to display which holds the reference to the to allocable
   * @param {String} linkTextProperty property of the object class to display which holds the text to write next to the link
   */
  constructor(
    canvasContext,
    fromAllocableRenderer,
    toAllocableRenderer,
    geometryConfig,
    objectClassId,
    fromAllocableProperty,
    toAllocableProperty,
    linkTextProperty
  ) {
    ASSERT_EXIST(canvasContext);
    ASSERT_EXIST(fromAllocableRenderer);
    ASSERT_EXIST(toAllocableRenderer);
    ASSERT_EXIST(geometryConfig);
    ASSERT_ISSTRING(objectClassId);
    ASSERT_ISSTRING(fromAllocableProperty);
    ASSERT_ISSTRING(toAllocableProperty);
    ASSERT_ISSTRING(linkTextProperty);
    this._canvasContext = canvasContext;
    this._geometryConfig = geometryConfig;
    this._fromAllocableRenderer = fromAllocableRenderer;
    this._toAllocableRenderer = toAllocableRenderer;
    this._objectClassId = objectClassId;
    this._fromAllocableProperty = fromAllocableProperty;
    this._toAllocableProperty = toAllocableProperty;
    this._linkTextProperty = linkTextProperty;
    this._linkIdToArrow = new Map();
  }

  /** render the link between allocable object of the given DPLMovieRuntime.
   *  @param {DPLMovieRuntime} dplMovieRuntime DPLMovie runtime.
   */
  render(dplMovieRuntime) {
    ASSERT_EXIST(dplMovieRuntime);
    for (const link of dplMovieRuntime.getTrackedObjects(this._objectClassId)) {
      const fromAllocable = link[this._fromAllocableProperty];
      const toAllocable = link[this._toAllocableProperty];
      const fromAllocableRect = this._fromAllocableRenderer.getAllocablePosition(fromAllocable.Id);
      const toAllocableRect = this._toAllocableRenderer.getAllocablePosition(toAllocable.Id);
      const linkPosition = this._findLinkPosition(fromAllocableRect, toAllocableRect);
      const line = drawArrow(
        this._canvasContext,
        new String(link[this._linkTextProperty]),
        "black",
        linkPosition.xStart,
        linkPosition.yStart,
        linkPosition.xEnd,
        linkPosition.yEnd,
        this._geometryConfig.zoomFactor
      );
      this._linkIdToArrow.set(link.Id, line);
    }
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const [_, arrow] of this._linkIdToArrow) {
      eraseArrow(this._canvasContext, arrow);
    }
    this._linkIdToArrow = new Map();
  }

  // -------
  // PRIVATE
  // -------
  /** from two rectagles of allocable, finds the best X-Y coordinates of the start and the end of the link.
   * @param {Object} fromAllocableRect rectangle of the allocable from which starts the link
   * @param {Object} toAllocableRect rectangle of the allocable at which ends the link
   * @returns {Object} coordinates of the start and end of the link.
   */
  _findLinkPosition(fromAllocableRect, toAllocableRect) {
    ASSERT(fromAllocableRect.Y > toAllocableRect.Y, `the links to draw should always point up`);
    // in case the from allocable is before the to-allocable, we simply points from the top-rigth to the bottom-left corners.
    if (fromAllocableRect.X + fromAllocableRect.Width <= toAllocableRect.X) {
      return {
        xStart: fromAllocableRect.X + fromAllocableRect.Width,
        yStart: fromAllocableRect.Y,
        xEnd: toAllocableRect.X,
        yEnd: toAllocableRect.Y + toAllocableRect.Height,
      };
    }

    // in case the from allocable is strictly after the to-allocable, we simply points from the top-left to the bottom-rigth corners.
    if (fromAllocableRect.X >= toAllocableRect.X + toAllocableRect.Width) {
      return {
        xStart: fromAllocableRect.X,
        yStart: fromAllocableRect.Y,
        xEnd: toAllocableRect.X + toAllocableRect.Width,
        yEnd: toAllocableRect.Y + toAllocableRect.Height,
      };
    }

    // otherwise, the two rectangles overlap along the X axis, so draw a straigth line at the middle of the overlap.
    const overlapStart = Math.max(
      Math.min(fromAllocableRect.X + fromAllocableRect.Width, toAllocableRect.X) /*from-allocable a bit before to-allocable */,
      Math.min(toAllocableRect.X + toAllocableRect.Width, fromAllocableRect.X) /*from-allocable a bit after to-allocable */
    );
    const overlapEnd = Math.min(
      Math.max(fromAllocableRect.X + fromAllocableRect.Width, toAllocableRect.X) /*from-allocable a bit before to-allocable */,
      Math.max(toAllocableRect.X + toAllocableRect.Width, fromAllocableRect.X) /*from-allocable a bit after to-allocable */
    );

    ASSERT(overlapStart < overlapEnd, `rectangles do not overlap`);
    const straigthLineX = overlapEnd - overlapStart;

    return {
      xStart: straigthLineX,
      yStart: fromAllocableRect.Y,
      xEnd: straigthLineX,
      yEnd: toAllocableRect.Y + toAllocableRect.Height,
    };
  }
}
