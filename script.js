const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 10;
let ballSpeedY = 4;

const paddleHeight = 100;
const paddleWidth = 10;
let playerY = (canvas.height - paddleHeight) / 2;

let computerPaddleY = (canvas.height - paddleHeight) / 2;

let playerScore = 0;
let computerScore = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

// Game loop
function gameLoop() {
    moveEverything();
    drawEverything();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Mouse movement
canvas.addEventListener('mousemove', (evt) => {
    if (showingWinScreen) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = evt.clientY - rect.top - root.scrollTop;
    playerY = mouseY - (paddleHeight / 2);
});

// Click to restart
canvas.addEventListener('mousedown', (evt) => {
    if (showingWinScreen) {
        playerScore = 0;
        computerScore = 0;
        showingWinScreen = false;
        resetBall();
    }
});

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY < 0 && ballSpeedY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height && ballSpeedY > 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX < paddleWidth) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.05; // Increase speed
            let deltaY = ballY - (playerY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            computerScore++; // must be BEFORE ballReset()
            resetBall();
        }
    } else if (ballX > canvas.width - paddleWidth) {
        if (ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.05; // Increase speed
            let deltaY = ballY - (computerPaddleY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            playerScore++; // must be BEFORE ballReset()
            resetBall();
        }
    }
    
    computerAI();
}

function computerAI() {
    const computerPaddleCenter = computerPaddleY + (paddleHeight / 2);
    if (computerPaddleCenter < ballY - 35) {
        computerPaddleY += 6;
    } else if (computerPaddleCenter > ballY + 35) {
        computerPaddleY -= 6;
    }
}

function resetBall() {
    if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX = 10 * (ballSpeedX > 0 ? -1 : 1);
    ballSpeedY = 4;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function drawEverything() {
    // Clear screen
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";


    if (showingWinScreen) {
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";

        if (playerScore >= WINNING_SCORE) {
            ctx.fillText("You Won!", canvas.width/2, 200);
        } else if (computerScore >= WINNING_SCORE) {
            ctx.fillText("Computer Won!", canvas.width/2, 200);
        }

        ctx.fillText("Click to Continue", canvas.width/2, 500);
        return;
    }

    // Draw player paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);

    // Draw computer paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw scores
    ctx.textAlign = "center";
    ctx.fillText(playerScore, 100, 100);
    ctx.fillText(computerScore, canvas.width - 100, 100);
}