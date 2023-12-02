class Circle {
  constructor(canvasContext, canvas, xCenter, yCenter, radius, xSpeed, ySpeed) {
    this._canvasContext = canvasContext;
    this._canvas = canvas;
    this._xCenter = Math.max(
      Math.min(xCenter, this._canvas.width - radius),
      radius
    );
    this._yCenter = Math.max(
      Math.min(yCenter, this._canvas.height - radius),
      radius
    );
    this._radius = radius;
    this._xSpeed = xSpeed;
    this._ySpeed = ySpeed;
  }

  draw() {
    this._canvasContext.beginPath();
    this._canvasContext.arc(
      this._xCenter,
      this._yCenter,
      this._radius,
      0,
      Math.PI * 2,
      false
    );
    this._canvasContext.strokeStyle = "blue";
    this._canvasContext.stroke();
  }

  move() {
    this._xCenter += this._xSpeed;
    this._yCenter += this._ySpeed;
    if (
      this._xCenter + this._radius > this._canvas.width ||
      this._xCenter - this._radius < 0
    )
      this._xSpeed = -this._xSpeed;

    if (
      this._yCenter + this._radius > this._canvas.height ||
      this._yCenter - this._radius < 0
    )
      this._ySpeed = -this._ySpeed;
  }
}

const makecircle = function (
  canvasContext,
  canvas,
  maxSpeed,
  minSpeed,
  xStart,
  yStart
) {
  const newCircle = new Circle(
    canvasContext,
    canvas,
    xStart,
    yStart,
    30,
    Math.max(maxSpeed * 2 * Math.random() - maxSpeed, minSpeed),
    Math.max(maxSpeed * 2 * Math.random() - maxSpeed, minSpeed)
  );
  return newCircle;
};

export const createBouncingCircles = function (
  numberOfCircles,
  minSpeed,
  maxSpeed
) {
  const canvas = document.querySelector(".dplmovie-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const canvasContext = canvas.getContext("2d");

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const circles = [];
  canvas.addEventListener("mousedown", function (event) {
    const rect = canvas.getBoundingClientRect();
    /*conversion to get to the scale in the canvas. 
    It looks like the number of pixels in the canvas, is higher than in the document.
    therefore, the transformation involves a zoom */
    const correctionFactorX = canvas.width / rect.width;
    const correctionFactorY = canvas.height / rect.height;

    circles.push(
      makecircle(
        canvasContext,
        canvas,
        maxSpeed,
        minSpeed,
        (event.clientX - rect.left) * correctionFactorX,
        (event.clientY - rect.top) * correctionFactorY
      )
    );
  });

  for (let i = 0; i < numberOfCircles; i++) {
    circles.push(
      makecircle(
        canvasContext,
        canvas,
        maxSpeed,
        minSpeed,
        canvas.width * Math.random() + 1,
        canvas.height * Math.random() + 1
      )
    );
  }

  const animate = function () {
    requestAnimationFrame(animate);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function (circle) {
      circle.draw();
      circle.move();
    });
  };
  animate();
};
