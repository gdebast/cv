"use strict";

import {
  ASSERT_EXIST,
  ASSERT_ISSTRING,
} from "../../../../../model/utility/assert/assert";
import {
  drawHeaderCell,
  getHeaderCellHeigth,
} from "./src/dplmovierendererhelper";

const ALLOCABLE_BASE_LINE_INCREMENT = 10;

/*color*/
const ALLOCABLE_CELL_BACKGROUNDCOLOR = "#1864ab";

export class DPLMovieAllocableRenderer {
  /** class responsible for displaying the object that can be allocated.
   * @param canvasContext canvas on which to draw.
   * @param dplMovieProductLocationRenderer renderer of the Product-Locations
   * @param geometryConfig configuration of the geometry.
   * @param {String} objectClassId object class to display
   * @param {String} lineCellText text to display line header cell
   */
  constructor(
    canvasContext,
    dplMovieProductLocationRenderer,
    geometryConfig,
    objectClassId,
    lineCellText
  ) {
    ASSERT_EXIST(canvasContext);
    ASSERT_EXIST(dplMovieProductLocationRenderer);
    ASSERT_EXIST(geometryConfig);
    ASSERT_ISSTRING(objectClassId);
    ASSERT_ISSTRING(lineCellText);
    this._canvasContext = canvasContext;
    this._productLocationRenderer = dplMovieProductLocationRenderer;
    this._geometryConfig = geometryConfig;
    this._objectClassId = objectClassId;
    this._lineCellText = lineCellText;
    this._yIncrement =
      this._productLocationRenderer.getTotalVerticalReservedSpace();
    this._productLocationRenderer.reserveVerticalSpace(
      getHeaderCellHeigth(1) + ALLOCABLE_BASE_LINE_INCREMENT
    );
    this._lineHeaderRect = [];
  }

  /** render the allocable object of the given DPLMovieRuntime.
   *  @param dplMovieRuntime DPLMovie runtime.
   */
  render(dplMovieRuntime) {
    ASSERT_EXIST(this._canvasContext);
    ASSERT_EXIST(dplMovieRuntime);

    const productLocationId_Rect =
      this._productLocationRenderer.getProductLocationPositions();
    for (const [_, rect] of productLocationId_Rect) {
      /*draw the line header */
      const lineYStart =
        rect.Y +
        rect.Height +
        this._yIncrement * this._geometryConfig.zoomFactor +
        ALLOCABLE_BASE_LINE_INCREMENT * this._geometryConfig.zoomFactor;
      const lineRect = drawHeaderCell(
        this._canvasContext,
        this._lineCellText,
        ALLOCABLE_CELL_BACKGROUNDCOLOR,
        rect.X,
        lineYStart,
        this._geometryConfig.zoomFactor
      );
      this._lineHeaderRect.push(lineRect);
    }
  }

  /** reset the renderer by erasing all its creation.
   */
  reset() {
    for (const rect of this._lineHeaderRect) {
      this._canvasContext.clearRect(
        rect.X - rect.LineWidth,
        rect.Y - rect.LineWidth,
        rect.Width + 2 * rect.LineWidth,
        rect.Height + 2 * rect.LineWidth
      );
    }
  }
}
