class Circle {
  constructor(
    canvasContext,
    xBorder,
    yBorder,
    xCenter,
    yCenter,
    radius,
    xSpeed,
    ySpeed
  ) {
    this._canvasContext = canvasContext;
    this._xBorder = xBorder;
    this._yBorder = yBorder;
    this._xCenter = Math.max(Math.min(xCenter, xBorder - radius), radius);
    this._yCenter = Math.max(Math.min(yCenter, yBorder - radius), radius);
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
      this._xCenter + this._radius > this._xBorder ||
      this._xCenter - this._radius < 0
    )
      this._xSpeed = -this._xSpeed;

    if (
      this._yCenter + this._radius > this._yBorder ||
      this._yCenter - this._radius < 0
    )
      this._ySpeed = -this._ySpeed;
  }
}

export const createBouncingCircles = function (
  numberOfCircles,
  minSpeed,
  maxSpeed
) {
  const canvas = document.querySelector(".dplmovie-canvas");
  canvas.width = window.innerWidth;
  canvas.height = 0.9 * window.innerHeight;
  const canvasContext = canvas.getContext("2d");

  const circles = [];
  for (let i = 0; i < numberOfCircles; i++) {
    const newCircle = new Circle(
      canvasContext,
      canvas.width,
      canvas.height,
      canvas.width * Math.random() + 1,
      canvas.height * Math.random() + 1,
      30,
      Math.max(maxSpeed * 2 * Math.random() - maxSpeed, minSpeed),
      Math.max(maxSpeed * 2 * Math.random() - maxSpeed, minSpeed)
    );
    circles.push(newCircle);
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
