// Initialize the canvas and context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define the Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Define the Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, size, color) {
    super(x, y, velX, velY);
    this.size = size;
    this.color = color;
    this.exists = true; // Tracks if the ball is still in the game
  }

  // Draw the ball
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  // Update the ball's position
  update() {
    this.x += this.velX;
    this.y += this.velY;

    // Bounce the ball off the edges
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.velY = -this.velY;
    }
  }

  // Detect collision with other balls
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB(); // Change color on collision
        }
      }
    }
  }
}

// Define the EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 0, 0); // No velocity since we control it with the mouse
    this.size = 10;
    this.color = "white";
  }

  // Draw the evil circle
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.stroke();
    context.closePath();
  }

  // Ensure the evil circle doesn't go off the screen
  checkBounds() {
    if (this.x + this.size > canvas.width) {
      this.x = canvas.width - this.size;
    }
    if (this.x - this.size < 0) {
      this.x = this.size;
    }
    if (this.y + this.size > canvas.height) {
      this.y = canvas.height - this.size;
    }
    if (this.y - this.size < 0) {
      this.y = this.size;
    }
  }

  // Detect collision with the evil circle
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // Ball is eaten
          score--; // Decrease score
          updateScore(); // Update score on screen
          createNewBall(); // Generate new ball to replace the eaten one
        }
      }
    }
  }
}

// Random color generator for the balls
function randomRGB() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

// Score tracking
let score = 0;
function updateScore() {
  document.getElementById("score").textContent = `Ball count: ${score}`;
}

// Create a new ball with random properties
function createNewBall() {
  const size = Math.random() * 20 + 10; // Random size
  const color = randomRGB(); // Random color
  const velX = Math.random() * 4 + 1; // Random horizontal velocity
  const velY = Math.random() * 4 + 1; // Random vertical velocity
  const ball = new Ball(Math.random() * canvas.width, Math.random() * canvas.height, velX, velY, size, color);
  balls.push(ball);
  score++; // Increment score
  updateScore(); // Update score on screen
}

// Create an array of balls
let balls = [];
for (let i = 0; i < 5; i++) {
  createNewBall(); // Create new balls initially
}

let evilCircle = new EvilCircle(100, 100); // Evil circle starting position

// Main game loop
function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw and update all balls
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  // Draw and check bounds of the evil circle
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop); // Call loop again for next frame
}

loop(); // Start the game loop

// Track the mouse movement to control the evil circle
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  evilCircle.x = e.clientX - rect.left;
  evilCircle.y = e.clientY - rect.top;
});
