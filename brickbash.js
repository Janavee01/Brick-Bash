const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 1.3;

function ball() { 
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    const ballGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    ballGradient.addColorStop(0, "white");
    ballGradient.addColorStop(1, "gray");
    ctx.fillStyle = ballGradient;
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

let dx = 2; 
let dy = 2;

let lives = 3;
let score = 0;

function drawInitialState() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height); 
    ball();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
}

let ph = 10;
let pw = 150;
let paddleX = (canvas.width - pw) / 2;
let paddleDx = 6;

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - ph - 10, pw, ph);
    ctx.fillStyle = "#2F4F4F";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1E2A33";
    ctx.stroke();
    ctx.closePath();
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") rightPressed = true;
    if (event.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") rightPressed = false;
    if (event.key === "ArrowLeft") leftPressed = false;
});

function Paddlemovement(){
    if (rightPressed && paddleX < canvas.width - pw) {
        paddleX += paddleDx;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= paddleDx;
    }
}

let brickrc = 6;
let brickcc = 9;
let brickw = 100;
let brickh = 22;
let brickPadding = 10;
let brickOffsettop = 70;
let brickOffsetleft = 40;

const bricks = [];
for (let c = 0; c < brickcc; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickrc; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    for (let c = 0; c < brickcc; c++) {
        for (let r = 0; r < brickrc; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickw + brickPadding) + brickOffsetleft;
                const brickY = r * (brickh + brickPadding) + brickOffsettop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickw, brickh);
                ctx.fillStyle = "brown";
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#6A1F24";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Your score: " + score, 800, 42);
}

function drawLives() {
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, 80, 42);
}

function resetBall() {
    x = paddleX + pw / 2; 
    y = canvas.height - ph - 20; 
    dx = 2; 
    dy = -2; 
}

function startGame() {
    const canvas = document.getElementById("canvas");
    canvas.scrollIntoView({ behavior: "smooth" }); 

    intervalId = setInterval(draw, 10);
}


function showVictory() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const victoryGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#93C572";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "50px 'Arial', sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText("Congratulations!", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "30px 'Verdana', sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("You finished the level with a score of " + score, canvas.width / 2, canvas.height / 2 + 20);
  }

function draw() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball();
    drawPaddle();
    Paddlemovement();
    drawBricks();
    collision();
    drawScore();
    drawLives(); 

    if (x + dx > canvas.width || x + dx < 0){
        dx = -dx; 
    }
    if (y + dy < 0) {
        dy = -dy; 
    }
    if (y + dy > canvas.height - ph - 10 && x > paddleX && x < paddleX + pw) {
        dy = -dy; 
    }
    if (y + dy > canvas.height){
        lives--;
        if (lives <= 0) {
            showGameOver();
        } else {
            resetBall();
        }
    } 

    x += dx;
    y += dy;
}

function collision(){
    for (let c = 0; c < brickcc; c++) {
        for (let r = 0; r < brickrc; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                if (x > brick.x && x < brick.x + brickw && y > brick.y && y < brick.y + brickh) {
                    dy = -dy;
                    brick.status = 0;
                    score++;
                }
            }
        }
    }

    if (score === brickrc * brickcc){
        showVictory();
        clearInterval(intervalId);
    }
}

function showGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gameOverGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gameOverGradient.addColorStop(0, '#e74c3c');
    gameOverGradient.addColorStop(1, '#c0392b');
    ctx.fillStyle = gameOverGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "60px 'Arial', sans-serif";
    ctx.fillStyle = "#ecf0f1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "40px 'Verdana', sans-serif";
    ctx.fillStyle = "#50C878";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 1.8);
}

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
let touchX = null;
function handleTouchStart(event) {
    const touch = event.touches[0];
    touchX = touch.clientX;
}
function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const touchOffset = touch.clientX - canvas.offsetLeft;
    
    if (touchOffset > 0 && touchOffset < canvas.width - pw) {
        paddleX = touchOffset - pw / 2;
    }
}
drawInitialState();

let intervalId;