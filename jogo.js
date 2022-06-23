console.log("[Jessika Miranda] Flappy Bird");

let frames = 0;

const hitSound = new Audio();
hitSound.src = "./efeitos/hit.wav";

const sprites = new Image();
sprites.src = "./spritesNoFace.png";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Plano de Fundo
const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    ctx.fillStyle = "#70C5CE";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x,
      background.y,
      background.width,
      background.height
    );

    ctx.drawImage(
      sprites, // imagem
      background.spriteX,
      background.spriteY, // sprite X, Sprite Y
      background.width,
      background.height, // Tamanho do recorte na sprite
      background.x + background.width,
      background.y, // onde será desenhado no canvas
      background.width,
      background.height // Tamanho da imagem dentro do canvas
    );
  },
};

function createPipes() {
  const pipes = {
    width: 52,
    height: 400,
    floor: {
      spriteX: 0,
      spriteY: 169,
    },
    sky: {
      spriteX: 52,
      spriteY: 169,
    },
    space: 80,
    draw() {
      pipes.pairs.forEach(function (pair) {
        const yRandom = pair.y;
        const spaceBetweenPipes = 90;

        const skyPipeX = pair.x;
        const skyPipeY = yRandom;

        // Cano do céu
        ctx.drawImage(
          sprites,
          pipes.sky.spriteX,
          pipes.sky.spriteY,
          pipes.width,
          pipes.height,
          skyPipeX,
          skyPipeY,
          pipes.width,
          pipes.height
        );

        // Cano do chão
        const floorPipeX = pair.x;
        const floorPipeY = pipes.height + spaceBetweenPipes + yRandom;
        ctx.drawImage(
          sprites,
          pipes.floor.spriteX,
          pipes.floor.spriteY,
          pipes.width,
          pipes.height,
          floorPipeX,
          floorPipeY,
          pipes.width,
          pipes.height
        );

        pair.skyPipe = {
          x: skyPipeX,
          y: pipes.height + skyPipeY,
        };
        pair.floorPipe = {
          x: floorPipeX,
          y: pipes.height + floorPipeY,
        };
      });
    },
    bumpBird(pair) {
      const birdsHead = globals.flappyBird.y;
      const birdsFeet = globals.flappyBird.y + globals.flappyBird.height;

      if (globals.flappyBird.x >= pair.x) {
        if (birdsHead <= pair.skyPipe.y) {
          return true;
        }

        if (birdsFeet >= pair.floorPipe.y) {
          return true;
        }
      }

      return false;
    },

    pairs: [],
    update() {
      const passed100frames = frames % 100 === 0;
      if (passed100frames) {
        pipes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }
      pipes.pairs.forEach(function (pair) {
        pair.x = pair.x - 2;

        if (pipes.bumpBird(pair)) {
          changeToScreen(Screens.HOME);
        }

        if (pair.x + pipes.width <= 0) {
          pipes.pairs.shift();
        }
      });
    },
  };
  return pipes;
}

// Chão
function createFloor() {
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const floorMovement = 1;
      const repeatIn = floor.width / 2;
      const movementation = floor.x - floorMovement;

      floor.x = movementation % repeatIn;
    },
    draw() {
      ctx.drawImage(
        sprites,
        floor.spriteX,
        floor.spriteY,
        floor.width,
        floor.height,
        floor.x,
        floor.y,
        floor.width,
        floor.height
      );

      ctx.drawImage(
        sprites,
        floor.spriteX,
        floor.spriteY,
        floor.width,
        floor.height,
        floor.x + floor.width,
        floor.y,
        floor.width,
        floor.height
      );
    },
  };
  return floor;
}

function bump(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const floorY = floor.y;

  if (flappyBirdY >= floorY) {
    return true;
  }
  return false;
}

// Flappy Bird
function createFlappyBird() {
  const flappyBird = {
    /* spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50, */
    spriteX: 0,
    spriteY: 0,
    width: 27,
    height: 33,
    x: 10,
    y: 50,
    toJump: 4.6,
    jump() {
      flappyBird.velocity = -flappyBird.toJump;
    },
    gravity: 0.25,
    velocity: 0,
    update() {
      if (bump(flappyBird, globals.floor)) {
        hitSound.play();

        setTimeout(() => {
          changeToScreen(Screens.HOME);
        }, 500);
        return;
      }
      flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.velocity;
    },

    movements: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 37 }, // asa pra meio
      /* { spriteX: 0, spriteY: 52 }, // asa pra baixo
      { spriteX: 0, spriteY: 26 }, // asa pra meio */
    ],
    atualFrame: 0,
    updateAtualFrame() {
      const framesRange = 10;
      const passRange = frames % framesRange === 0;

      if (passRange) {
        const incrementBase = 1;
        const increment = incrementBase + flappyBird.atualFrame;
        const repetitionBase = flappyBird.movements.length;
        flappyBird.atualFrame = increment % repetitionBase;
      }
    },
    draw() {
      flappyBird.updateAtualFrame();
      const { spriteX, spriteY } = flappyBird.movements[flappyBird.atualFrame];
      ctx.drawImage(
        sprites,
        spriteX,
        spriteY,
        flappyBird.width,
        flappyBird.height,
        flappyBird.x,
        flappyBird.y,
        flappyBird.width,
        flappyBird.height
      );
    },
  };
  return flappyBird;
}

// Mensagem get ready
const getReadyMessage = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  draw() {
    ctx.drawImage(
      sprites,
      getReadyMessage.spriteX,
      getReadyMessage.spriteY,
      getReadyMessage.width,
      getReadyMessage.height,
      getReadyMessage.x,
      getReadyMessage.y,
      getReadyMessage.width,
      getReadyMessage.height
    );
  },
};

function createScoreBoard() {
  const scoreBoard = {
    score: 0,

    draw() {
      ctx.font = '50px "VT323"';
      ctx.fillStyle = "white";
      ctx.fillText(`${scoreBoard.score}`, 50, 90);
    },
    update() {},
  };
  return scoreBoard;
}

// Telas
const globals = {};
let activeScreen = {};
function changeToScreen(newScreen) {
  activeScreen = newScreen;

  if (activeScreen.initialize) {
    activeScreen.initialize();
  }
}

const Screens = {
  HOME: {
    initialize() {
      globals.flappyBird = createFlappyBird();
      globals.floor = createFloor();
      globals.pipes = createPipes();
    },
    draw() {
      background.draw();
      globals.flappyBird.draw();

      globals.floor.draw();
      getReadyMessage.draw();
    },
    click() {
      changeToScreen(Screens.GAME);
    },
    update() {
      globals.floor.update();
    },
  },
};

Screens.GAME = {
  initialize() {
    globals.scoreBoard = createScoreBoard();
  },

  draw() {
    background.draw();
    globals.pipes.draw();
    globals.floor.draw();
    globals.flappyBird.draw();
    globals.scoreBoard.draw();
  },
  click() {
    globals.flappyBird.jump();
  },
  update() {
    globals.pipes.update();
    globals.floor.update();
    globals.flappyBird.update();
    globals.scoreBoard.update();
  },
};

function loop() {
  activeScreen.draw();
  activeScreen.update();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeToScreen(Screens.HOME);
loop();
