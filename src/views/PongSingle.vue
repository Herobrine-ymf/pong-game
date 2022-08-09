<script setup lang="ts">
onMounted(() => {
  addEventListener("mousemove", mousemove);
  addEventListener("click", click);
  start();
});
onUnmounted(() => {
  removeEventListener("mousemove", mousemove);
  removeEventListener("click", click);
  clearInterval(timerID);
});

let ballDiameter = $ref(0),
  bulletDiameter = $ref(0),
  boardWidth = $ref(0),
  boardHeight = $ref(0),
  boardBottom = $ref(0);
if (!config.antiCheat)
  ({ ballDiameter, bulletDiameter, boardWidth, boardHeight, boardBottom } =
    getSize());

const difficulty = $ref(config.difficulty);
let difficultyLock = $ref(0);

let point = $ref(0),
  fail = $ref(false);
const displayPoint = $computed(() => Math.floor((point * difficultyLock) / 5));

let ballX = $ref(0),
  ballY = $ref(0),
  boardX = $ref(0),
  bulletX = $ref(0),
  bulletY = $ref(0);

let timerID: NodeJS.Timer;

const start = () => {
  if (difficulty) difficultyLock = difficulty;

  point = 0;
  fail = false;

  bulletExist = false;
  coolDown = true;

  ballX = innerWidth / 2 - ballDiameter;
  ballY = 0;

  let rateX =
      (difficultyLock / Math.tan((Math.random() * 40 + 30) * (Math.PI / 180))) *
      (Math.random() > 0.5 ? 1 : -1),
    rateY = difficultyLock,
    oldHeight: number;

  clearInterval(timerID);
  timerID = setInterval(() => {
    if (config.antiCheat && oldHeight !== innerHeight) {
      ({ ballDiameter, bulletDiameter, boardWidth, boardHeight, boardBottom } =
        getSize());
      oldHeight = innerHeight;
    }

    if (ballX + rateX >= innerWidth - ballDiameter) rateX *= -1;
    if (ballX + rateX <= 0) rateX *= -1;
    if (ballY + rateY <= 0) rateY *= -1;

    ballX += rateX;
    ballY += rateY;

    if (bulletExist) {
      bulletY -= 10;
      if (
        bulletX + bulletDiameter >= ballX &&
        bulletX <= ballX + ballDiameter &&
        bulletY + bulletDiameter >= ballY &&
        bulletY <= ballY + ballDiameter &&
        coolDown
      ) {
        coolDown = false;
        rateY = Math.abs(rateY) * -1;
        point += 3;
      }
    }

    const innerHeightLock = innerHeight;
    if (ballY + ballDiameter > innerHeightLock - boardBottom - boardHeight) {
      if (boardX <= ballX + ballDiameter && boardX + boardWidth >= ballX) {
        point += 1;
        if (rateY > 0) {
          rateY *= -1;
          rateX *= 1.0625;
        }
      } else if (ballY + ballDiameter > innerHeightLock - 10) {
        fail = true;
        clearInterval(timerID);
      }
    }
  }, 2);
};

const mousemove = (event: MouseEvent) => {
  if (event.clientX + boardWidth / 2 > innerWidth) {
    boardX = innerWidth - boardWidth;
  } else if (event.clientX - boardWidth / 2 < 0) {
    boardX = 0;
  } else {
    boardX = event.clientX - boardWidth / 2;
  }

  if (!bulletExist) {
    if (event.clientX + bulletDiameter / 2 > innerWidth) {
      bulletX = innerWidth - bulletDiameter;
    } else if (event.clientX - bulletDiameter / 2 < 0) {
      bulletX = 0;
    } else {
      bulletX = event.clientX - bulletDiameter / 2;
    }
    bulletY = innerHeight - boardBottom - boardHeight - bulletDiameter;
  }
};

let bulletExist = false,
  coolDown = true;

const click = () => {
  if (!bulletExist) {
    bulletExist = true;
    setTimeout(() => {
      coolDown = true;
      bulletExist = false;
      bulletX = boardX + boardWidth / 2 - bulletDiameter / 2;
      bulletY = innerHeight - boardBottom - boardHeight - bulletDiameter;
    }, 1000);
  }
};
</script>

<template>
  <div class="page" onselectstart="return false">
    <PongStatus
      :start="start"
      :fail="fail"
      :point="displayPoint"
      @difficulty="(a :number) => difficulty = a"
    />
    <PongRank :fail="fail" :point="displayPoint" />

    <PongBall :diameter="ballDiameter" :offset-x="ballX" :offset-y="ballY" />
    <PongBoard
      :width="boardWidth"
      :height="boardHeight"
      :left="boardX"
      :bottom="boardBottom"
    />
    <PongBullet
      :diameter="bulletDiameter"
      :offset-x="bulletX"
      :offset-y="bulletY"
    />
  </div>
</template>
