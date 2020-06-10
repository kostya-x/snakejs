let canvas = document.querySelector(".game-canvas");
let context = canvas.getContext("2d");
let gridSize = 16;
let frame = 0;

let snake = {};

let apple = {
  x: 320,
  y: 320
};

function setSnake() {
  snake.x = 160;
  snake.y = 160;
  snake.bodyPosition = [];
  snake.bodyPositionLenght = 4;
  snake.dx = gridSize;
  snake.dy = 0;

  return snake;
}

function clearField() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
  snake.x += snake.dx;
  snake.y += snake.dy;

  wallCollision();

  snake.bodyPosition.unshift({ x: snake.x, y: snake.y });

  if (snake.bodyPosition.length > snake.bodyPositionLenght) {
    snake.bodyPosition.pop();
  }
}

function moveApple() {
  apple.x = getNewPosition(0, 25) * gridSize;
  apple.y = getNewPosition(0, 25) * gridSize;
}

function wallCollision() {
  if (snake.x < 0) {
    snake.x = canvas.width - gridSize;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - gridSize;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}

function getNewPosition(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createApple() {
  let appleSize = (gridSize - 1) / 2;

  context.fillStyle = "red";
  context.beginPath();
  context.arc(
    apple.x + gridSize / 2,
    apple.y + gridSize / 2,
    appleSize,
    0,
    2 * Math.PI,
    false
  );
  context.fill();
  context.closePath();
}

function checkAppleCollision(x, y) {
  if (x === apple.x && y === apple.y) {
    snake.bodyPositionLenght++;

    moveApple();
  }
}

function checkBodyCollision(x, y, index) {
  for (let i = index + 1; i < snake.bodyPosition.length; i++) {
    if (x === snake.bodyPosition[i].x && y === snake.bodyPosition[i].y) {
      setSnake();
      moveApple();
    }
  }
}

function createSnake() {
  context.fillStyle = "green";

  snake.bodyPosition.forEach(function (cell, index) {
    let bodySize = (gridSize - 1) / 2;
    context.beginPath();
    context.arc(
      cell.x + gridSize / 2,
      cell.y + gridSize / 2,
      bodySize,
      0,
      2 * Math.PI,
      false
    );
    context.fill();
    context.closePath();

    checkAppleCollision(cell.x, cell.y);

    checkBodyCollision(cell.x, cell.y, index);
  });
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if (++frame < 8) {
    return;
  }

  frame = 0;

  clearField();

  moveSnake();

  createApple();

  createSnake();
}

document.addEventListener("keydown", function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -gridSize;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -gridSize;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = gridSize;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = gridSize;
    snake.dx = 0;
  }
});

function startGame() {
  setSnake();
  gameLoop();
}

startGame();
