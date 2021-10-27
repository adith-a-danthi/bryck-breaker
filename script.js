const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

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

// Canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let ball = {
	radius: 10,
	color: "black",

	init: () => {
		ball.x = width / 2;
		ball.y = height / 2;
		ball.dx = 0;
		ball.dy = height * 0.01;
	},

	move: () => {
		ball.x += ball.dx;
		ball.y += ball.dy;
	},

	draw: () => {
		circle(ball.x, ball.y, ball.radius, ball.color);
	},
};

let paddle = {
	width: 125,
	height: 20,
	color: "black",
	dx: 10, // speed of paddle

	init: () => {
		paddle.x = (width - paddle.width) / 2;
		paddle.y = height - paddle.height;
	},

	move: () => {
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
	},

	draw: () => {
		rect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
	},
};

// Bricks
let bricksGrid = {
	rows: 3,
	cols: 5,
	padding: 5,
	height: 20,

	bricks: [],

	init: () => {
		bricksGrid.width = width / bricksGrid.cols - bricksGrid.padding;
		bricksGrid.rowHeight = bricksGrid.height + bricksGrid.padding;
		bricksGrid.colWidth = bricksGrid.width + bricksGrid.padding;

		for (let i = 0; i < bricksGrid.rows; i++) {
			bricksGrid.bricks[i] = [];
			for (let j = 0; j < bricksGrid.cols; j++) {
				bricksGrid.bricks[i][j] = {
					x: j * (bricksGrid.width + bricksGrid.padding) + bricksGrid.padding,
					y: i * (bricksGrid.height + bricksGrid.padding) + bricksGrid.padding,
					width: bricksGrid.width,
					height: bricksGrid.height,
					visible: true,
					color: "black",
				};
			}
		}

		bricksGrid.activeCount = bricksGrid.rows * bricksGrid.cols;
	},

	draw: () => {
		bricksGrid.bricks.forEach((row) => {
			row.forEach((brick) => {
				if (brick.visible) {
					rect(brick.x, brick.y, brick.width, brick.height, brick.color);
				}
			});
		});
	},
};

let animationId;
let gameInProgress = false;

const init = () => {
	ball.init();
	paddle.init();
	bricksGrid.init();
};

const clear = () => {
	ctx.clearRect(0, 0, width, height);
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

const gameResult = (message) => {
	ctx.beginPath();
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
	const row = Math.floor(ball.y / bricksGrid.rowHeight);
	const col = Math.floor(ball.x / bricksGrid.colWidth);

	if (row >= 0 && row < bricksGrid.rows && col >= 0 && col < bricksGrid.cols) {
		const brick = bricksGrid.bricks[row][col];
		if (brick.visible) {
			ball.dy = -ball.dy;
			brick.visible = false;
			bricksGrid.activeCount--;
		}
	}
};

const draw = () => {
	clear();

	ball.draw();
	paddle.move();
	paddle.draw();

	if (bricksGrid.activeCount === 0) {
		cancelAnimationFrame(animationId);
		gameResult("You Win!");
	}

	bricksGrid.draw();
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
			ball.move();
			gameResult("Game Over!");
			cancelAnimationFrame(animationId);
			return;
		}
	}

	ball.move();
};

const toggleButtons = () => {
	if (gameInProgress) {
		startBtn.style.display = "none";
		stopBtn.style.display = "block";
	} else {
		startBtn.style.display = "block";
		stopBtn.style.display = "none";
	}
};

const startScreen = () => {
	init();
	draw();
};

const animate = () => {
	animationId = requestAnimationFrame(animate);
	draw();
};

startBtn.addEventListener("click", () => {
	gameInProgress = true;
	toggleButtons();
	animate();
});

stopBtn.addEventListener("click", () => {
	cancelAnimationFrame(animationId);
	gameInProgress = false;
	toggleButtons();
	startScreen();
});

startScreen();
