export const canvasTest = function () {
  const canvas = document.querySelector(".dplmovie-canvas");
  canvas.width = 0.95 * window.innerWidth;
  canvas.height = 900;
  const canvasContext = canvas.getContext("2d");
  canvasContext.fillRect(20, 20, 50, 10);
};
