// This is the main JavaScript code. I have coded this seperate from the html as it's neat and easy to work with.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');

// This will set canvas size to fit the whole screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// To make the canvas more responsive, I have called a function to resize the canvas when the window is resized. 
// So that the game can adapt on various screens.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Calling another function to center the canvas 
function centerCanvas() {
  canvas.style.position = 'absolute';
  canvas.style.top = '50%';
  canvas.style.left = '50%';
  canvas.style.transform = 'translate(-50%, -50%)';
}

// These are the game variables.
// A bubble pop sound is added so the user can get a proper feel of the game as when he clicks on the bubble, the pop sound is played.
let score = 0;
let timeLeft = 15;
let isGameOver = false;
let isGameStarted = false;
const bubblePopSound = new Audio('bubble_pop_sound.mp3');

// This array will be used to store information about all the bubbles that will be created during the game. 
let bubbles = [];

// This function is used to generate random values for the position and size of the bubbles in the game. 
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create a bubble
function createBubble() {
  const x = canvas.width / 2;
  const y = canvas.height;
  const radius = getRandom(10, 25); 
  const color = { r: getRandom(240, 255), g: getRandom(180, 210), b: getRandom(220, 255) };
  const dx = getRandom(-2, 2); // Setting a random horizontal velocity to determines how fast the bubble will move left or right.
  const dy = -getRandom(0.5, 1.5); // Getting the bubbles to move upward by adding a negative value. This will give the bubbles a floating effect.

  bubbles.push({ x, y, radius, color, dx, dy, isPopped: false, opacity: 1 });
  //Creating a bubble with all the properties defined above. Adding isPopped and Opacity to show that the bubble hasn't been popped yet. 
}

// Function to draw bubbles on the canvas
function drawBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // This will clear the entire canvas before drawing the bubble.
  bubbles.forEach((bubble, index) => {
    if (bubble.isPopped) {
      // Chekcing if the bubble isPopped is true the the following applies.
      bubble.radius -= 0.5;
      bubble.opacity -= 0.03; //Reducing the bubble opacity to create a fading effect
      if (bubble.radius <= 0 || bubble.opacity <= 0) {
        // This will remove the popped bubble from the array
        bubbles.splice(index, 1);
        return;
      }
    } else {
      // Else is used so if the bubble is not popped then it keeps moving upward by updating it's position. 
      bubble.x += bubble.dx;
      bubble.y += bubble.dy;
    }

    // Drawing the bubble on the canvas and styling it as well. 
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${bubble.color.r}, ${bubble.color.g}, ${bubble.color.b}, ${bubble.opacity})`;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// This function is called when the timer runs out and the final score is displayed
function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);
  canvas.removeEventListener('click', handleMouseClick);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGameOverScreen();
}

// Function to show the final screen to display the score once the game is over
function drawGameOverScreen() {
  ctx.font = '36px Arial';
  ctx.fillStyle = '#f7b5d1'; 
  ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 50, 300, 100);

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

// Function to handle mouse click events during the game. 
function handleMouseClick(event) {
    if (isGameStarted && !isGameOver) {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;
  
      bubbles.forEach((bubble, index) => {
        const distance = Math.sqrt((bubble.x - clickX) ** 2 + (bubble.y - clickY) ** 2);
        if (distance < bubble.radius && !bubble.isPopped) {
          // Checking if the bubble is popped or no, if it is popped = true, the pop sound is heard and the score is updated. 
          bubble.isPopped = true;
          // This will keep increasing the score by 10 everytime a bubble is popped.
          score += 10;
          scoreDisplay.textContent = `${score}`;
          // This will play the bubble pop sound everytime a bubble is clicked on.
          bubblePopSound.currentTime = 0;
          bubblePopSound.play();
        }
      });
    }
  }

// Function to start the game
function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    startButton.style.display = 'none'; // Hiding the start button if the game has started
    gameInterval = setInterval(function () { //Setting and updating the game timer.
      timeLeft--;
      timerDisplay.textContent = timeLeft <= 0 ? 0 : timeLeft;
      if (timeLeft <= 0) {
        gameOver();
      }
    }, 1000);

    canvas.addEventListener('click', handleMouseClick);

    // This will continuously update the game state and adding the canvas with new bubbles. 
    gameLoop();
  }
}

// Event listener
startButton.addEventListener('click', startGame); // When the button is clicked, the startGame function is called to start the game.

// Resize and center the canvas according to the screen size.
resizeCanvas();
centerCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  centerCanvas();
});

// Updating the game and rendering the canvas
function gameLoop() {
    if (isGameStarted && !isGameOver) {
      // Generating new bubbles at a fixed interval
      if (Math.random() < 0.3) { 
        createBubble();
      }
  
      drawBubbles();
      requestAnimationFrame(gameLoop); // Updating the game and redrawing the canvas creating a continuous loop.
    }
  }
