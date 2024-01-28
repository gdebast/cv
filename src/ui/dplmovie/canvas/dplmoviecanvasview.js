import { ASSERT_EXIST } from "../../../model/utility/assert/assert";
import { DPLMovieProductLocationRenderer } from "./src/dplmovieproductlocationrenderer";

const CLASS_DPLMOVIECANVAS = "dplmovie-canvas";

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
  }

  // implement observer pattern with DPLMovieRuntimeView
  notifyDeletePoolObject(poolObject) {
    if (poolObject === this._dplMovieRuntimeToPlay) {
      this._dplMovieRuntimeToPlay = null;
      this._eraseCanvas();
      this._createRenderers();
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
  // TODO

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

    window.addEventListener("resize", function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    canvas.addEventListener("wheel", function (event) {
      console.log(event);
      // TODO
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
    ASSERT_EXIST(this._dplMovieRuntimeToPlay);
    const self = this;
    this._renderers.forEach(function (renderer) {
      renderer.render(self._dplMovieRuntimeToPlay);
    });
  }

  /** create all renders for each tracked object type to display
   */
  _createRenderers() {
    this._renderers = [];
    const productLocationRenderer = new DPLMovieProductLocationRenderer(
      this._canvasContext
    );
    this._renderers.push(productLocationRenderer);
  }
}
