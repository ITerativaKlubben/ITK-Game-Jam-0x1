var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var score = document.getElementById("score");

var xMousePosition = 0;
var yMousePosition = 0;
var running = true;
var gameOver = false;
var start = false;
var gameTimer = 0;
var points = 0;

var playerBullet = [];
var enemyBullet = [];
var enemiesFuture = [
    [250, 0, 250],
    [750, 0, 250],
    [100, 0, 500],
    [1100, 0, 500],
    [500, 0, 500],
    [100, 0, 750],
    [300, 0, 850],
    [500, 0, 900],
    [1100, 0, 1100],
    [900, 0, 1200],
    [700, 0, 1300],
];
var enemies = [
    [100, 0],
    [1100, 0],
    [500, 0],
];

var imageVirus = new Image();
imageVirus.src = "virus.png";
var imageNat = new Image();
imageNat.src = "nat.png";
var background = new Image();
background.src = "background.png";
var backgroundDanger = new Image();
backgroundDanger.src = "background-danger.png";

canvas.addEventListener("mousemove", findCursor, false);
canvas.addEventListener("click", startGame, false);

function addEnemyBullet() {
    for (let index = 0; index < enemies.length; index++) {
        enemyBullet.unshift([enemies[index][0], enemies[index][1], "#eb341e"]);
    }
}

function addPlayerBullet() {
    playerBullet.unshift([xMousePosition, yMousePosition, "#313edd"]);
}

function drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = "#b1b1b1";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if (gameTimer > 1500 && gameTimer < 1750) {
        ctx.drawImage(backgroundDanger, 0, 0);
    } else {
        ctx.drawImage(background, 0, 0);
    }
}

function drawBullet(x, y, color) {
    ctx.beginPath();
    ctx.rect(x, y, 8, 16);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawEnemy(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, 35, 35);
    ctx.fillStyle = "#eb8c1e";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.drawImage(imageVirus, x, y, 35, 35);
}

function drawPlayer(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, 35, 35);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.drawImage(imageNat, x, y, 35, 35);
}

function findCursor(event) {
    xMousePosition = event.pageX;
    yMousePosition = event.pageY;
}

function handleBullet() {
    // handle enemies bullet
    for (let index = 0; index < enemyBullet.length; index++) {
        drawBullet(
            enemyBullet[index][0],
            enemyBullet[index][1],
            enemyBullet[index][2]
        );

        if (enemyBullet[index][1] + 5 >= canvas.clientHeight) {
            enemyBullet.splice(index, 1);
        } else {
            enemyBullet[index] = [
                enemyBullet[index][0],
                enemyBullet[index][1] + 5,
                enemyBullet[index][2],
            ];
        }
    }

    // handle player bullet
    for (let index = 0; index < playerBullet.length; index++) {
        drawBullet(
            playerBullet[index][0],
            playerBullet[index][1],
            playerBullet[index][2]
        );

        if (playerBullet[index][1] - 5 <= 0) {
            playerBullet.splice(index, 1);
        } else {
            playerBullet[index] = [
                playerBullet[index][0],
                playerBullet[index][1] - 5,
                playerBullet[index][2],
            ];
        }
    }
}

function handleCollision() {
    // Check player and enemy collision
    for (let index = 0; index < enemies.length; index++) {
        let enemyHorizontalSize = enemies[index][0] + 35;
        let enemyVerticalSize = enemies[index][1] + 35;

        if (
            xMousePosition < enemyHorizontalSize &&
            xMousePosition + 35 > enemies[index][0]
        ) {
            if (
                yMousePosition < enemyVerticalSize &&
                yMousePosition + 35 > enemies[index][1]
            ) {
                gameOver = true;

                return;
            }
        }
    }

    // Check player and enemy bullet collision
    for (let index = 0; index < enemyBullet.length; index++) {
        let enemyBulletHorizontalSize = enemyBullet[index][0] + 8;
        let enemyBulletVerticalSize = enemyBullet[index][1] + 16;

        if (
            xMousePosition < enemyBulletHorizontalSize &&
            xMousePosition + 35 > enemyBullet[index][0]
        ) {
            if (
                yMousePosition < enemyBulletVerticalSize &&
                yMousePosition + 35 > enemyBullet[index][1]
            ) {
                gameOver = true;

                return;
            }
        }
    }

    // Check enemy and player bullet collision
    for (let i = 0; i < playerBullet.length; i++) {
        let playerBulletHorizontalSize = playerBullet[i][0] + 8;
        let playerBulletVerticalSize = playerBullet[i][1] + 16;

        for (let j = 0; j < enemies.length; j++) {
            if (
                enemies[j][0] < playerBulletHorizontalSize &&
                enemies[j][0] + 35 > playerBullet[i][0]
            ) {
                if (
                    enemies[j][1] < playerBulletVerticalSize &&
                    enemies[j][1] + 35 > playerBullet[i][1]
                ) {
                    // Delete enemy
                    enemies.splice(j, 1);
                    points += 50;
                }
            }
        }
    }
}

function handleEnemies() {
    for (let index = 0; index < enemies.length; index++) {
        drawEnemy(enemies[index][0], enemies[index][1]);

        if (enemies[index][1] + 1 >= canvas.clientHeight) {
            enemies.splice(index, 1);
        } else {
            enemies[index][1] = enemies[index][1] + 2;
        }
    }

    spawnEnemies();
}

function renderScreen() {
    if (!gameOver && start) {
        drawBackground();
        drawPlayer(xMousePosition, yMousePosition);
        handleEnemies();
        handleBullet();
        handleCollision();
        updateScore();
        gameTimer++;
    } else if (!gameOver && !start) {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "#313edd";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "#eb341e";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

function spawnEnemies() {
    for (let i = 0; i < enemiesFuture.length; i++) {
        if (gameTimer >= enemiesFuture[i][2]) {
            enemies.unshift([enemiesFuture[i][0], enemiesFuture[i][1]]);
            enemiesFuture.splice(i, 1);
        }
    }
}

function spawnRandomEnemies() {
    if (gameTimer >= 1800) {
        let xValue = Math.floor(Math.random() * 1200 + 10);
        enemiesFuture.unshift([xValue, 0, gameTimer + 25]);
    }
    if (gameTimer > 3600) {
        let xValue = Math.floor(Math.random() * 1200 + 10);
        enemiesFuture.unshift([xValue, 0, gameTimer + 25]);
    }
}

function startGame() {
    start = true;
}

function updateScore() {
    score.innerText = "score = " + points;
}

setInterval(renderScreen, 10);
setInterval(spawnRandomEnemies, 100);
setInterval(addPlayerBullet, 500);
setInterval(addEnemyBullet, 1500);
