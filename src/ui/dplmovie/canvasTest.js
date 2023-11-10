export const canvasTest = function () {
  const canvas = document.querySelector(".dplmovie-canvas");
  canvas.width = window.innerWidth;
  canvas.height = 0.9 * window.innerHeight;
  const canvasContext = canvas.getContext("2d");

  canvasContext.fillRect(10, 10, 100, 100);

  class Circle {
    constructor(xCenter, yCenter, radius) {
      this._xCenter = xCenter;
      this._yCenter = yCenter;
      this._radius = radius;
    }
  }
};
