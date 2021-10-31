const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

// Keyboard
let leftPressed = false;
let rightPressed = false;

/**
 * Check if left or right arrow key is pressed
 * @param {Event} e Event object
 */
const onKeyDown = (e) => {
	if (e.keyCode == 37) leftPressed = true;
	else if (e.keyCode == 39) rightPressed = true;
};

/**
 * Check if left or right arrow key is released
 * @param {Event} e Event object
 */
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

	/**
	 * Initialize the ball object
	 */
	init: () => {
		ball.x = width / 2;
		ball.y = height / 2;
		ball.dx = 0;
		ball.dy = height * 0.01;
	},

	/**
	 * Update the ball coordinates
	 */
	move: () => {
		ball.x += ball.dx;
		ball.y += ball.dy;
	},

	/**
	 * Draw the ball on canvas
	 */
	draw: () => {
		circle(ball.x, ball.y, ball.radius, ball.color);
	},
};

let paddle = {
	width: 125,
	height: 20,
	color: "black",
	dx: 10, // speed of paddle

	/**
	 * Initilize the paddle position
	 */
	init: () => {
		paddle.x = (width - paddle.width) / 2;
		paddle.y = height - paddle.height;
	},

	/**
	 * Update the paddle position
	 */
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

	/** Draw the paddle */ 
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

	/**
	 * Initialize the bricks grid
	 */
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

	/**
	 * Draw the bricks
	 */
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

/**
 * Initialize the game
 */
const init = () => {
	ball.init();
	paddle.init();
	bricksGrid.init();
};

/**
 * Function to clear the canvas
 */
const clear = () => {
	ctx.clearRect(0, 0, width, height);
};

/**
 * Function to draw a circle on canvas
 * @param {Number} x x-coordinate of the center of the circle
 * @param {Number} y y-coordinate of the center of the circle
 * @param {Number} radius radius of the circle
 * @param {String} color color of the circle
 */
const circle = (x, y, radius, color) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
};

/**
 * Function to draw a rectangle on canvas
 * @param {Number} x top left x-coordinate of the rectangle
 * @param {Number} y top left y-coordinate of the rectangle
 * @param {Number} width width of the rectangle
 * @param {Number} height height of the rectangle
 * @param {String} color color of the rectangle
 */
const rect = (x, y, width, height, color) => {
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
};

/**
 * Function to display the game result
 * @param {String} message game result message
 */
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

/**
 * Brick collision detection
 */
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

/**
 * Draw each frame of the game
 */
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

	// Handle the ball collision with side walls
	if (
		ball.x + ball.radius + ball.dx > width ||
		ball.x + ball.dx - ball.radius < 0
	) {
		ball.dx = -ball.dx;
	}

	// Handle the ball collision with top wall
	if (ball.y + ball.dy - ball.radius < 0) {
		ball.dy = -ball.dy;
	} else if (ball.y + ball.radius + ball.dy > height) {
		// Handle the ball collision with paddle
		if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
			ball.dx =
				((ball.x - (paddle.x + paddle.width / 2)) * paddle.height) /
				paddle.width;
			ball.dy = -ball.dy;
		} else {
			// Handle the ball collision with bottom wall
			ball.move();
			gameResult("Game Over!");
			cancelAnimationFrame(animationId);
			return;
		}
	}

	ball.move();
};


/**
 * Toggle start/stop button
 */
const toggleButtons = () => {
	if (gameInProgress) {
		startBtn.style.display = "none";
		stopBtn.style.display = "block";
	} else {
		startBtn.style.display = "block";
		stopBtn.style.display = "none";
	}
};

/**
 * Start the game
 */
const startScreen = () => {
	init();
	draw();
};

/** Start the animation */
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
