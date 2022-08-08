<script setup lang="ts">
const config = {
  ballDiameter: 60,
  bulletDiameter: 20,
  boardWidth: 250,
  boardHeight: 20,
  boardBottom: 40,
  cheat: false,
};

let ballDiameter = $ref(0);
let bulletDiameter = $ref(0);
let boardWidth = $ref(0);
let boardHeight = $ref(0);
let boardBottom = $ref(0);

const difficulty = $ref(5);
let difficultyLock = $ref(difficulty);
let point = $ref(0);
let fail = $ref(false);
const displayPoint = $computed(() => {
  return Math.floor((point * difficultyLock) / 5);
});

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
  clearInterval(timerID);
});

let timerID: ReturnType<typeof setInterval> | number = 0;

const start = () => {
  if (difficulty !== null) {
    difficultyLock = difficulty;
  }

  ballX = innerWidth / 2 - ballDiameter;
  ballY = 0;
  point = 0;
  fail = false;
  bulletExist = false;
  coolDown = true;

  let oldHeight: number;

  let rateX =
    (difficultyLock / Math.tan((Math.random() * 40 + 30) * (Math.PI / 180))) *
    (Math.random() > 0.5 ? 1 : -1);
  let rateY = difficultyLock;

  clearInterval(timerID);
  timerID = setInterval(() => {
    if (oldHeight !== innerHeight) {
      ballDiameter = innerHeight * (config.ballDiameter / 820);
      bulletDiameter = innerHeight * (config.bulletDiameter / 820);
      boardWidth = innerHeight * (config.boardWidth / 820);
      boardHeight = innerHeight * (config.boardHeight / 820);
      boardBottom = innerHeight * (config.boardBottom / 820);

      oldHeight = innerHeight;
    }

    if (ballX + rateX >= innerWidth - ballDiameter) {
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
          rateY *= -(Math.random() * 0.375 + 0.875); // 0.875 ~ 1.25
        }
        if (
          ballY + ballDiameter >
          innerHeightLock - boardHeight - boardBottom + 10
        ) {
          rateX *= -1;
        }
      } else if (ballY + ballDiameter > innerHeightLock - 10) {
        fail = true;
        clickable = true;
        clearInterval(timerID);
      }
    }
  }, 2);
};

const mousemove = (e: MouseEvent) => {
  if (e.clientX + boardWidth / 2 > innerWidth) {
    boardX = innerWidth - boardWidth;
  } else if (e.clientX - boardWidth / 2 < 0) {
    boardX = 0;
  } else {
    boardX = e.clientX - boardWidth / 2;
  }

  if (!bulletExist) {
    if (e.clientX + bulletDiameter / 2 > innerWidth) {
      bulletX = innerWidth - bulletDiameter;
    } else if (e.clientX - bulletDiameter / 2 < 0) {
      bulletX = 0;
    } else {
      bulletX = e.clientX - bulletDiameter / 2;
    }

    bulletY = innerHeight - boardBottom - boardHeight - bulletDiameter;
  }

  if (config.cheat) {
    if (ballX + boardWidth / 2 > innerWidth) {
      boardX = innerWidth - boardWidth;
    } else if (ballX - boardWidth / 2 < 0) {
      boardX = 0;
    } else {
      boardX = ballX - boardWidth / 2 + ballDiameter / 2;
    }
    bulletExist = true;
    coolDown = true;
    bulletX = ballX + 10;
    bulletY = ballY + 10;
  }
};

let bulletExist = false;
let coolDown = true;
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

let rank = $ref([{ point: 0 }]);
const name = $ref("");
let clickable = $ref(true);
const gsetRank = (set = true) => {
  if (set) {
    const _tmp = { name: name ? name : "匿名", point: displayPoint };
    axios.get("/.netlify/functions/rank", {
      params: _tmp,
    });
    rank.push(_tmp);
    clickable = false;
  } else {
    axios.get("/.netlify/functions/rank").then((res) => {
      rank = res.data;
    });
  }
};
gsetRank(false);
</script>

<template>
  <div class="container" onselectstart="return false">
    <el-input-number v-model="difficulty" :min="1" :max="30" />
    <div @click.stop="start">
      <div v-if="fail">
        <el-button type="danger" style="font-size: 12px">
          <h1>Game Over</h1>
        </el-button>
      </div>
      <el-tag :type="config.cheat ? 'danger' : 'success'" size="large">
        <h2>{{ displayPoint }} 分</h2>
      </el-tag>
    </div>

    <div v-if="fail">
      <el-input v-model="name" placeholder="用户名: " />
      <el-button
        type="primary"
        @click="gsetRank"
        :disabled="!(clickable && displayPoint >= 20)"
      >
        提交
      </el-button>

      <el-table
        :data="
          rank
            .sort((a, b) => {
              return b['point'] - a['point'];
            })
            .slice(0, 10)
        "
        table-layout="auto"
      >
        <el-table-column type="index" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="point" label="分数" />
      </el-table>
    </div>

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

<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
