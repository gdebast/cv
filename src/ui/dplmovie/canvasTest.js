export const canvasTest = function () {
  const canvas = document.querySelector(".dplmovie-canvas");
  canvas.width = 0.95 * window.innerWidth;
  canvas.height = 400;
  const canvasContext = canvas.getContext("2d");

  class Circle {
    constructor(xCenter, yCenter, radius) {
      this._xCenter = xCenter;
      this._yCenter = yCenter;
      this._radius = radius;
    }
  }
};
