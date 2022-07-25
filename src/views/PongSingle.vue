<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const config = {
  ballDiameter: 60,
  bulletDiameter: 20,
  boardWidth: 256,
  boardHeight: 25,
  boardBottom: 40,
  cheat: false,
};

const difficulty = $ref(5);
let difficultyLock = $ref(difficulty);
let point = $ref(0);
let fail = $ref(false);

let ballX = $ref(0);
let ballY = $ref(0);
let boardX = $ref(0);
let bulletX = $ref(0);
let bulletY = $ref(0);

onMounted(() => {
  addEventListener("mousemove", mousemove);
  addEventListener("click", click);
  start();
});
onUnmounted(() => {
  removeEventListener("mousemove", mousemove);
  removeEventListener("click", click);
  clearInterval(timer);
});

let timer: ReturnType<typeof setInterval> | number = 0;

const start = () => {
  if (difficulty !== null) {
    difficultyLock = difficulty;
  }

  ballX = innerWidth / 2 - config.ballDiameter;
  ballY = 0;
  point = 0;
  fail = false;
  bulltExist = false;
  coolDown = true;

  let rateX =
    (difficultyLock / Math.tan((Math.random() * 40 + 30) * (Math.PI / 180))) *
    (Math.random() > 0.5 ? 1 : -1);
  let rateY = difficultyLock;

  clearInterval(timer);
  timer = setInterval(() => {
    if (ballX + rateX >= innerWidth - config.ballDiameter) {
      rateX *= -1;
    }
    if (ballX + rateX <= 0) {
      rateX *= -1;
    }
    if (ballY + rateY <= 0) {
      rateY *= -1;
    }

    ballX += rateX;
    ballY += rateY;

    if (bulltExist) {
      bulletY -= 10;
      if (
        bulletX + config.bulletDiameter >= ballX &&
        bulletX <= ballX + config.ballDiameter &&
        bulletY + config.bulletDiameter >= ballY &&
        bulletY <= ballY + config.ballDiameter &&
        coolDown
      ) {
        coolDown = false;
        rateY = Math.abs(rateY) * -1.0625;
        point += 3;
      }
    } else {
      bulletY =
        innerHeight -
        config.boardBottom -
        config.boardHeight -
        config.bulletDiameter;
      bulletX = boardX + config.boardWidth / 2 - config.bulletDiameter / 2;
    }

    const innerHeightLock = innerHeight;
    if (
      ballY + config.ballDiameter >
      innerHeightLock - config.boardBottom - config.boardHeight
    ) {
      if (
        boardX <= ballX + config.ballDiameter &&
        boardX + config.boardWidth >= ballX
      ) {
        point += 1.125;
        if (rateY > 0) {
          rateY *= -1.03125;
        }
        if (
          ballY + config.ballDiameter >
          innerHeightLock - config.boardHeight - config.boardBottom + 4
        ) {
          rateX *= -1;
        }
      } else if (ballY + config.ballDiameter > innerHeightLock - 10) {
        fail = true;
        clearInterval(timer);
      }
    }
  }, 2);
};

const mousemove = (e: MouseEvent) => {
  if (e.clientX + config.boardWidth / 2 > innerWidth) {
    boardX = innerWidth - config.boardWidth;
  } else if (e.clientX - config.boardWidth / 2 < 0) {
    boardX = 0;
  } else {
    boardX = e.clientX - config.boardWidth / 2;
  }
  if (config.cheat) {
    if (ballX + config.boardWidth / 2 > innerWidth) {
      boardX = innerWidth - config.boardWidth;
    } else if (ballX - config.boardWidth / 2 < 0) {
      boardX = 0;
    } else {
      boardX = ballX - config.boardWidth / 2 + config.ballDiameter / 2;
    }
  }
};

let bulltExist = false;
let coolDown = true;
const click = () => {
  if (!bulltExist) {
    bulltExist = true;
    setTimeout(() => {
      coolDown = true;
      bulltExist = false;
    }, 1000);
  }
};
</script>

<template>
  <div class="container">
    <el-input-number v-model="difficulty" :min="1" :max="30" />
    <div @click.stop="start">
      <div v-if="fail">
        <el-button type="danger" style="font-size: 12px">
          <h1>你失败了!</h1>
        </el-button>
      </div>
      <el-tag :type="fail ? 'danger' : ''" size="large">
        <h2>{{ Math.floor((point * difficultyLock) / 5) }} 分</h2>
      </el-tag>
    </div>

    <MyBall
      :diameter="config.ballDiameter"
      :offset-x="ballX"
      :offset-y="ballY"
    />
    <MyBoard
      :width="config.boardWidth"
      :height="config.boardHeight"
      :left="boardX"
      :bottom="config.boardBottom"
    />
    <MyBullet
      :diameter="config.bulletDiameter"
      :offset-x="bulletX"
      :offset-y="bulletY"
    />
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
