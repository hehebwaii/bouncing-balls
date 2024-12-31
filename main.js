class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, size, color) {
    super(x, y, velX, velY);
    this.size = size;
    this.color = color;
    this.exists = true; // Tracks whether the ball is still in the game
  }

  // Collision detection between balls
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB(); // Change color on collision
        }
      }
    }
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

    // If the ball hits the boundaries, reverse its direction
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.velY = -this.velY;
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 0, 0); // Set velocity to 0 for mouse-controlled movement
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

  // Ensure the evil circle doesn't go off screen
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

  // Collision detection between the evil circle and balls
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // Ball is eaten by the evil circle
          score--; // Decrease score
          updateScore(); // Update score on screen
        }
      }
    }
  }
}

// Generate a random RGB color for balls
function randomRGB() {
  return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

// Initialize canvas and context
let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");

let balls = [];
let evilCircle = new EvilCircle(100, 100); // Example starting position
let score = 0; // Track the score

// Update the score display
function updateScore() {
  document.getElementById("score").textContent = `Ball count: ${score}`;
}

// Create balls (for example, 5 balls) with random velocities
for (let i = 0; i < 5; i++) {
  let size = Math.random() * 20 + 10; // Random size
  let color = randomRGB(); // Random color
  let velX = Math.random() * 4 + 1; // Random horizontal velocity
  let velY = Math.random() * 4 + 1; // Random vertical velocity
  let ball = new Ball(Math.random() * canvas.width, Math.random() * canvas.height, velX, velY, size, color);
  balls.push(ball);
  score++; // Increment score for each new ball
}

function loop() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop); // Call loop again for next frame
}

loop(); // Start the game loop

// Update the evil circle's position based on mouse movement
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  evilCircle.x = e.clientX - rect.left;
  evilCircle.y = e.clientY - rect.top;
});
