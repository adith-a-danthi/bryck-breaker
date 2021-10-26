let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let ball = {
	x: width / 2,
	y: height / 2,
	radius: 10,
	dx: 0, // horizontal speed of the ball
	dy: height * 0.01, // vertical speed of the ball
	color: "black",
};

let paddle = {
	width: 125,
	height: 20,
	x: 0,
	y: 0,
	color: "black",
	dx: 10, // speed of paddle
};

paddle.x = (width - paddle.width) / 2;
paddle.y = height - paddle.height;

let animationId;

let gameInProgress = false;

// Paddle Controls
// Keyboard
let leftPressed = false;
let rightPressed = false;

const onKeyDown = (e) => {
	if (e.keyCode == 37) leftPressed = true;
	else if (e.keyCode == 39) rightPressed = true;
};

const onKeyUp = (e) => {
	if (e.keyCode == 37) leftPressed = false;
	else if (e.keyCode == 39) rightPressed = false;
};

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

const movePaddle = () => {
	const dx = paddle.dx;
	if (leftPressed) {
		paddle.x =
			paddle.x - dx > 0 - paddle.width / 2
				? paddle.x - dx
				: 0 - paddle.width / 2;
	}
	if (rightPressed) {
		paddle.x =
			paddle.x + dx < width - paddle.width / 2
				? paddle.x + dx
				: width - paddle.width / 2;
	}
};

// Bricks
let bricks, rows, cols, brickWidth, brickHeight, padding, activeBricksCount;
let rowHeight, colWidth;

const initBricks = () => {
	rows = 3;
	cols = 5;
	padding = 5;
	brickWidth = width / cols - padding;
	brickHeight = 20;

	rowHeight = brickHeight + padding;
	colWidth = brickWidth + padding;

	bricks = [];
	for (let i = 0; i < rows; i++) {
		bricks[i] = [];
		for (let j = 0; j < cols; j++) {
			bricks[i][j] = {
				x: j * (brickWidth + padding) + padding,
				y: i * (brickHeight + padding) + padding,
				width: brickWidth,
				height: brickHeight,
				visible: true,
				color: "black",
			};
		}
	}

	activeBricksCount = rows * cols;
};

const drawBricks = () => {
	bricks.forEach((row) => {
		row.forEach((brick) => {
			if (brick.visible) {
				rect(brick.x, brick.y, brick.width, brick.height, brick.color);
			}
		});
	});
};

const circle = (x, y, radius, color) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
};

const rect = (x, y, width, height, color) => {
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
};

const clear = () => {
	ctx.clearRect(0, 0, width, height);
};

const gameResult = (message) => {
	ctx.strokeStyle = "black";
	ctx.lineWidth = "2";
	ctx.strokeRect(width / 2 - 100, height / 2 - 50, 200, 100);

	ctx.font = "24pt 'Segoe UI'";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(message, width / 2, height / 2);
};

// Brick Collision Detection
const detectBrickCollision = () => {
	const row = Math.floor(ball.y / rowHeight);
	const col = Math.floor(ball.x / colWidth);

	if (row >= 0 && row < rows && col >= 0 && col < cols) {
		const brick = bricks[row][col];
		if (brick.visible) {
			ball.dy = -ball.dy;
			brick.visible = false;
			activeBricksCount--;
		}
	}
};

const draw = () => {
	clear();
	circle(ball.x, ball.y, ball.radius, ball.color);

	// Move paddle on key press
	movePaddle();

	rect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);

	if (activeBricksCount === 0) {
		cancelAnimationFrame(animationId);
		gameResult("You Win!");
	}

	// Draw bricks
	drawBricks();

	detectBrickCollision();

	if (
		ball.x + ball.radius + ball.dx > width ||
		ball.x + ball.dx - ball.radius < 0
	) {
		ball.dx = -ball.dx;
	}

	if (ball.y + ball.dy - ball.radius < 0) {
		ball.dy = -ball.dy;
	} else if (ball.y + ball.radius + ball.dy > height) {
		if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
			ball.dx =
				((ball.x - (paddle.x + paddle.width / 2)) * paddle.height) /
				paddle.width;
			ball.dy = -ball.dy;
		} else {
			cancelAnimationFrame(animationId);
			gameInProgress = false;
			ball.x += ball.dx;
			ball.y += ball.dy;
			gameResult("Game Over!");
			return;
		}
	}

	ball.x += ball.dx;
	ball.y += ball.dy;

	// requestAnimationFrame(draw);
};

const initBall = () => {
	ball.x = width / 2;
	ball.y = height / 2;
	ball.dx = 0;
	ball.dy = height * 0.01;
};

const initPaddle = () => {
	paddle.x = (width - paddle.width) / 2;
	paddle.y = height - paddle.height;
};

const init = () => {
	initBall();
	initPaddle();
	initBricks();
};

const startScreen = () => {
	init();
	draw();
};

const animate = () => {
	animationId = requestAnimationFrame(animate);
	draw();
};

startScreen();

let startBtn = document.getElementById("start-btn");
let stopBtn = document.getElementById("stop-btn");


const toggleButtons = () => {
	if (gameInProgress) {
		startBtn.style.display = "none";
		stopBtn.style.display = "block";
	} else {
		startBtn.style.display = "block";
		stopBtn.style.display = "none";
	}
};

startBtn.addEventListener("click", () => {
	animate();
	gameInProgress = true;
	toggleButtons();
});

stopBtn.addEventListener("click", () => {
	cancelAnimationFrame(animationId);
	gameInProgress = false;
	toggleButtons();
	startScreen();
});
