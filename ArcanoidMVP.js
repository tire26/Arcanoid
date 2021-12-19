const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const level1 = [
    [],
    [],
    [],
    [],
    [],
    [],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y']
];

const colorMap = {
    'R': 'red',
    'O': 'orange',
    'G': 'green',
    'Y': 'yellow'
};

const brickGap = 4;
const brickWidth = 50;
const brickHeight = 24;

const wallSize = 24;

const bricks = [];
for (let row = 0; row < level1.length; row++) {
    for (let col = 0; col < level1[row].length; col++) {

        const colorCode = level1[row][col];

        bricks.push({
            x: wallSize + (brickWidth + brickGap) * col,
            y: wallSize + (brickHeight + brickGap) * row,
            color: colorMap[colorCode],
            width: brickWidth,
            height: brickHeight
        });
    }
}

const paddle = {
    x: canvas.width / 2 - brickWidth / 2,
    y: 880,

    width: brickWidth,
    height: brickHeight,

    dx: 0
};

const ball = {
    x: 260,
    y: 520,
    width: 10,
    height: 10,

    speed: 4,

    dx: 0,
    dy: 0
};

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    paddle.x += paddle.dx;

    if (paddle.x < wallSize) {
        paddle.x = wallSize
    }
    else if (paddle.x + brickWidth > canvas.width - wallSize) {
        paddle.x = canvas.width - wallSize - brickWidth;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x < wallSize) {
        ball.x = wallSize;
        ball.dx *= -1;
    }
    else if (ball.x + ball.width > canvas.width - wallSize) {
        ball.x = canvas.width - wallSize - ball.width;
        ball.dx *= -1;
    }
    if (ball.y < wallSize) {
        ball.y = wallSize;
        ball.dy *= -1;
    }

    if (ball.y > canvas.height) {

        paddle.width = brickWidth
        ball.x = 260;
        ball.y = 520;
        ball.dx = 0;
        ball.dy = 0;
    }

    
    if (collides(ball, paddle)) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.height;
    }
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        if (collides(ball, brick)) {
            bricks.splice(i, 1);

            if (ball.y + ball.height - ball.speed <= brick.y ||
                ball.y >= brick.y + brick.height - ball.speed) {
                ball.dy *= -1;
            }
            else {
                ball.dx *= -1;
            }
            break;
        }
    }

    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, wallSize);
    context.fillRect(0, 0, wallSize, canvas.height);
    context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

    if (ball.dx || ball.dy) {
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    bricks.forEach(function (brick) {
        context.fillStyle = brick.color;
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });

    context.fillStyle = 'cyan';
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

}

document.addEventListener('keydown', function (e) {
    if (e.which === 37) {
        paddle.dx = -6;
    }
    else if (e.which === 39) {
        paddle.dx = 6;
    }

    if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.which === 37 || e.which === 39) {
        paddle.dx = 0;
    }
});
// start the game
requestAnimationFrame(loop);