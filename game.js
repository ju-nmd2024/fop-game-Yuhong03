let rocketX = 350; // X position of the rocket (can only move horizontally)
let rocketY = 300; // Fixed Y position of the rocket (initial center)
let speedX = 10; // Horizontal speed
let stars = [];
let asteroids = [];
let asteroidSpeed = 2; // Asteroid speed
let gameState = 'start'; // 'start', 'play', 'end', 'landed'
let survivalTime = 0;
let landed = false;
let rocketAngle = PI; // Initial rocket angle (pointing down)
let showGround = false; // Ground visibility flag

function setup() {
  createCanvas(650, 700);
  // Create stars
  for (let i = 0; i < 100; i++) {
    stars.push({ x: random(width), y: random(-height, height) });
  }
  // Initialize asteroids
  for (let i = 0; i < 10; i++) {
    asteroids.push({
      x: random(width),
      y: height + i * 100, // Stagger the initial positions of asteroids
      size: random(20, 50),
    });
  }
}

function draw() {
  background(0);

  // Draw stars
  for (let i = 0; i < stars.length; i++) {
    fill(255);
    ellipse(stars[i].x, stars[i].y, 2, 2); // Draw stars
    stars[i].y += 2; // Move stars downward

    // Reset star position when it moves off the canvas
    if (stars[i].y > height) {
      stars[i].y = -random(height);
    }
  }

  if (gameState === 'start') {
    displayStartScreen();
  } else if (gameState === 'play') {
    playGame();
  } else if (gameState === 'end') {
    displayEndScreen();
  } else if (gameState === 'landed') {
    displayLandingScreen();
  }

  // Ensure ground is drawn after 30 seconds or in landed state
  if (showGround || gameState === 'landed') {
    drawGround();
  }
}

function displayStartScreen() {
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text('Press SPACE to Start', width / 2, height / 2);
}

function playGame() {
  survivalTime += deltaTime / 1000; // Track survival time
  moveRocket();
  displayRocket();
  handleAsteroids();
  checkCollisions();

  // Check for victory (survival for 30 seconds)
  if (survivalTime >= 30 && !landed) {
    gameState = 'landed'; // Change game state to "landed"
    landed = true;
    showGround = true; // Show ground once 30 seconds are reached
  }

  // Display survival time
  fill(255);
  textSize(24);
  text('Survival Time: ' + nf(survivalTime, 0, 2) + 's', 20, 40);
}

function displayEndScreen() {
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text('Game Over! Press R to Restart', width / 2, height / 2);
}

function displayLandingScreen() {
  if (rocketAngle > 0) {
    rocketAngle -= 0.05; // Slowly rotate the rocket 180 degrees to land
  }

  // Lower the rocket gradually until it touches the ground
  let groundLevel = height - 20; // Ground top position
  if (rocketY < groundLevel - 40) { // Ensure rocket bottom aligns with ground
    rocketY += 2; // Gradually move the rocket downward
  } else {
    rocketY = groundLevel - 40; // Stop rocket at ground level
  }

  displayRocket();

  textAlign(CENTER);
  fill(0, 255, 0);
  textSize(32);
  text('You have safely landed!', width / 2, height / 2);
}

function drawGround() {
  fill(100, 200, 100); // Greenish ground
  rect(0, height - 20, width, 20); // Draw a rectangle at the bottom of the canvas for the ground
}

function moveRocket() {
  // Control rocket movement with left and right arrow keys
  if (keyIsDown(LEFT_ARROW)) {
    rocketX -= speedX; // Move left
  }

  if (keyIsDown(RIGHT_ARROW)) {
    rocketX += speedX; // Move right
  }

  // Keep the rocket within screen bounds horizontally
  rocketX = constrain(rocketX, 40, width - 40);
}

function displayRocket() {
  drawTransformerShip(rocketX, rocketY, keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)); // Add flame if moving
}

function drawTransformerShip(x, y, isMoving) {
  push();
  translate(x, y);
  rotate(rocketAngle); // Adjust rocket angle for landing

  // Main part of rocket
  fill(150);
  rectMode(CENTER);
  rect(0, 0, 50, 80);

  // Top of rocket (now the bottom due to rotation)
  fill(200);
  triangle(-25, -40, 0, -80, 25, -40);

  // Window of rocket
  fill(255);
  ellipse(0, -20, 20, 20);

  // Thrusters
  fill(255, 100, 0);
  rect(-15, 40, 10, 20);
  rect(15, 40, 10, 20);

  // Fire for propulsion
  if (isMoving) {
    fill(random(200, 255), random(50, 150), 0);
    triangle(-20, 50, 0, 70 + random(10), 20, 50);
  }

  pop();
}           

// Handle asteroids logic
function handleAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];
    fill(100); // Gray color for asteroids
    ellipse(a.x, a.y, a.size);
    a.y -= asteroidSpeed; // Asteroids move upward

    // Reset asteroid position when it goes off screen
    if (a.y < -a.size) {
      a.y = height + random(50, 100); // Ensure asteroid spawns at the bottom
      a.x = random(width);
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];
    let d = dist(rocketX, rocketY, a.x, a.y);

    if (d < (a.size / 2) + 40) {
      gameState = 'end'; // Collision detected
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    if (gameState === 'start') {
      gameState = 'play'; // Start the game
    }
  }

  if (key === 'r' || key === 'R') {
    if (gameState === 'end') {
      resetGame(); // Reset after game over
    }
  }
}

function resetGame() {
  rocketX = 350; // Reset rocket to the center
  rocketY = 300; // Reset Y position
  rocketAngle = PI; // Reset angle for next playthrough
  survivalTime = 0;
  gameState = 'start';
  showGround = false; // Hide ground again
  landed = false; // Reset landing flag
  asteroids = []; // Reset asteroids

  // Reinitialize asteroids
  for (let i = 0; i < 10; i++) {
    asteroids.push({
      x: random(width),
      y: height + i * 100, // Stagger positions
      size: random(20, 50),
    });
  }
}
