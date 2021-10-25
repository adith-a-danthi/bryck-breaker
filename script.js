let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let ball = {
	x: width / 2,
	y: height / 2,
	radius: 10,
	dx: 4, // horizontal speed of the ball
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

const draw = () => {
	clear();
	circle(ball.x, ball.y, ball.radius, ball.color);

	// Move paddle on key press
	movePaddle();

	rect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);

	if (
		ball.x + ball.radius + ball.dx > width ||
		ball.x + ball.dx - ball.radius < 0
	) {
		ball.dx = -ball.dx;
	}

	if (
		ball.y + ball.radius + ball.dy > height ||
		ball.y + ball.dy - ball.radius < 0
	) {
		ball.dy = -ball.dy;
	}

	ball.x += ball.dx;
	ball.y += ball.dy;

	requestAnimationFrame(draw);
};

draw();
