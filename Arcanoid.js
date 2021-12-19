const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const dCode = 68;
const aCode = 65;

const lvlList = [];
var currentLevelNumber = 0;
var currentLevel;

const colorMap = {
    'R': 'red',
    'O': 'orange',
    'G': 'green',
    'Y': 'yellow',
    'U': 'brown',
    ' ': 'black'
};
const brickGap = 4;
const brickWidth = 50;
const brickHeight = 24;

score = 0;
lives = 3;
score_paddle = 25;
score_lives = 100;
lastBlock = undefined;
lastBoostName = "You have no boost";
const wallSize = 24;

bricks = [];

lvlList.push(new Level([
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
], 160));
lvlList.push(new Level([
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
    ['U', 'U', 'U', 'U', 'U', 'G', 'G', 'G', 'G', 'U', 'U', 'U', 'U', 'U'],
    [' ', ' ', ' ', ' ', ' ', 'U', 'Y', 'Y', 'U', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'U', 'Y', 'Y', 'U', ' ', ' ', ' ', ' ', ' ']
], 140));
currentLevel = lvlList[currentLevelNumber];
createBricksList(currentLevel);
function createBricksList(currentLevel) {
    bricks = [];
    for (let row = 0; row < currentLevel.getMap().length; row++) {
        for (let col = 0; col < currentLevel.getMap()[row].length; col++) {

            const colorCode = currentLevel.getMap()[row][col];

            bricks.push({
                x: wallSize + (brickWidth + brickGap) * col,
                y: wallSize + (brickHeight + brickGap) * row,
                color: colorMap[colorCode],
                width: brickWidth,
                height: brickHeight
            });
        }
    }
}


const paddle = {
    x: canvas.width / 2 - brickWidth / 2,
    y: canvas.height - 50,
    width: brickWidth,
    height: brickHeight - 10,
    dx: 0
};

const ball = {
    x: 260,
    y: 520,
    width: 10,
    height: 10,
    speed: 3,
    dx: 0,
    dy: 0
};
const boost = {
    x: 0,
    y: 0,
    width: brickWidth,
    height: brickHeight,
    makeBoost: function () {

    },
    boostName: "",
    image: undefined,
    exist: false,
    speed: 1,
    dx: 0,
    dy: 0,
    color: "white"
}

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

function loop() {

    if (score == currentLevel.getMaxScores()) {
        currentLevelNumber++;
        if (currentLevelNumber < lvlList.length) {
            currentLevel = lvlList[currentLevelNumber];
            createBricksList(currentLevel);
            score = 0;
            ball.speed = 3;
            score_lives = 100;
            score_paddle = 25;
            paddle.width = brickWidth;
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'black';
            context.globalAlpha = 1;
            context.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
            context.globalAlpha = 1;
            context.fillStyle = 'white';
            context.font = '36px monospace';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('GAME END. YOU WIN!', canvas.width / 2, canvas.height / 2);
            return;
        }
        
    }
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
        lives -= 1;
        score = 0;
        score_paddle = 25;
        score_lives = 100;
        paddle.width = brickWidth;

        if (lives <= 0) {

            context.fillStyle = 'black';
            context.globalAlpha = 1;
            context.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
            context.globalAlpha = 1;
            context.fillStyle = 'white';
            context.font = '36px monospace';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
            return;
        }

        ball.x = 260;
        ball.y = 520;
        ball.dx = 0;
        ball.dy = 0;
    }

    if (collides(ball, paddle)) {
        if (ball.x > paddle.x & ball.x < paddle.x + paddle.width/4) {
            ball.dx = -3/2*ball.speed;
        } else if (ball.x > paddle.x + paddle.width/4 & ball.x < paddle.x + paddle.width*1/2) {
            ball.dx = Math.round(1/2 * ball.speed);
        } else if (ball.x > paddle.x + paddle.width*1/2 & ball.x < paddle.x + paddle.width*3/4) {
            ball.dx = Math.round(1/2 * ball.speed);
        } else if (ball.x > paddle.x + paddle.width*3/4 & ball.x < paddle.x + paddle.width) {
            ball.dx = 3/2*ball.speed;
        }
        ball.dy *= -1;
        console.log("dx", ball.dx);
        console.log("dy", ball.dy);
        ball.y = paddle.y - ball.height;
    }

    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        if (collides(ball, brick)) {

            touchdown(brick);
            if (brick.color != 'brown' & brick.color != 'black') {
                lastBlock = brick;
                bricks.splice(i, 1);
                chance = Math.round(Math.random * 10);
                // chance = 2;

                if (chance < 3 & !boost.exist) {
                    getBoost(boost);
                }

            }
            if (brick.color != 'black') {
                if (ball.y + ball.height - ball.speed <= brick.y ||
                    ball.y >= brick.y + brick.height - ball.speed) {
                    ball.dy *= -1;
                }
                else {
                    ball.dx *= -1;
                }
            }
            break;
        }
    }

    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, wallSize);
    context.fillRect(0, 0, wallSize, canvas.height);
    context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);



    bricks.forEach(function (brick) {
        context.fillStyle = brick.color;
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });


    context.fillStyle = 'cyan';
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    context.fillStyle = 'white';
    if (ball.dx || ball.dy) {
        context.fillRect(ball.x, ball.y, ball.width, ball.height);
    }

    if (boost.dy && boost.exist) {
        boost.y += boost.dy;
        if (boost.x > canvas.width || boost.y > canvas.height || collides(boost, paddle)) {
            if (collides(boost, paddle)) {
                boost.makeBoost();
                lastBoostName = "You got " + boost.boostName + " bost";
            }
            boost.x = 0;
            boost.y = 0;
            boost.dy = 0;
            boost.exist = false;
        }
        context.fillStyle = boost.color;
        context.fillRect(boost.x, boost.y, boost.width, boost.height);
    }

    context.fillStyle = "#777777";
    context.font = "20pt monospace";
    context.fillText('Очки: ' + score, 100, canvas.height - 10);
    context.fillText('Жизни:' + lives, 500, canvas.height - 10);
    context.fillText(lastBoostName, canvas.width / 4, 100);
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', function (e) {
    if (e.which === aCode) {
        paddle.dx = -6;
    }
    else if (e.which === dCode) {
        paddle.dx = 6;
    }

    if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.which === aCode || e.which === dCode) {
        paddle.dx = 0;
    }
});

function touchdown(t_brick) {

    switch (t_brick.color) {
        case "yellow": { score += 1; break; }
        case "green": { score += 2; break; }
        case "orange": { score += 3; break; }
        case "red": { score += 4; }
    }

    if (score > score_paddle) {
        paddle.width += 8;
        score_paddle += 15;
    }

    if (score > score_lives) {
        lives += 1;
        ball.speed += 2;
        if (ball.dx > 0) {
            ball.dx = ball.speed;
        } else {
            ball.dx = -1 * ball.speed
        }
        if (ball.dy > 0) {
            ball.dy = ball.speed;
        } else {
            ball.dy = -1 * ball.speed
        }
    }

    score_lives += 100;
}

function getBoost(boost) {

    boost.x = lastBlock.x;
    boost.y = lastBlock.y;
    boost.dx = boost.speed;
    boost.dy = boost.speed;
    boost.exist = true;
    var a = Math.round(Math.random() * 2);
    switch (a) {
        case 0: {
            boost.makeBoost = function () { paddle.width += 8; boost.boostName = "increase platfrom size"; };
            break;
        }
        case 1: {
            boost.makeBoost = function () { ball.width += 2; ball.height += 2; boost.boostName = "increase ball size"; };
            break;
        }
        case 2: {
            boost.makeBoost = function () { ball.speed -= 1; boost.boostName = "reduce ball speed"; };
            break;
        }
        case 3: {
            boost.makeBoost = function () { lives += 1; boost.boostName = "increase lifes"; };
        }
    }
}
requestAnimationFrame(loop);