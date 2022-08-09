<script setup lang="ts">
onMounted(() => {
  addEventListener("keyup", keyup);
  start();
});
onUnmounted(() => {
  removeEventListener("keyup", keyup);
  clearInterval(timerID);
});

const _config = config.multiple;

let pointL = $ref(0),
  pointR = $ref(0),
  ballX = $ref(0),
  ballY = $ref(0),
  boardLY = $ref((innerHeight - _config.boardHeight) / 2),
  boardRY = $ref((innerHeight - _config.boardHeight) / 2),
  innerHeightLock: number,
  timerID: NodeJS.Timer,
  timeOutID: NodeJS.Timer;

const start = () => {
  innerHeightLock = innerHeight;

  ballX = innerWidth / 2 - _config.diameter;
  ballY = innerHeight / 2 - _config.diameter;

  let rateX = _config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    rateY =
      (_config.ballSpeed /
        Math.tan((Math.random() * 40 + 30) * (Math.PI / 180))) *
      (Math.random() > 0.5 ? 1 : -1);

  timerID = setInterval(() => {
    if (ballY + rateY <= 0) rateY *= -1;
    if (ballY + rateY >= innerHeight - _config.diameter) rateY *= -1;

    ballX += rateX;
    ballY += rateY;

    if (ballX < _config.boardInterval + _config.boardWidth) {
      if (
        boardLY <= ballY + _config.diameter &&
        boardLY + _config.boardHeight >= ballY
      )
        rateX *= -1;
      else {
        pointR++;
        clearInterval(timerID);
        timeOutID = setTimeout(() => {
          start();
        }, _config.timeOut);
      }
    } else if (
      ballX + _config.diameter >
      innerWidth - _config.boardInterval - _config.boardWidth
    ) {
      if (
        boardRY <= ballY + _config.diameter &&
        boardRY + _config.boardHeight >= ballY
      )
        rateX *= -1;
      else {
        pointL++;
        clearInterval(timerID);
        timeOutID = setTimeout(() => {
          start();
        }, _config.timeOut);
      }
    }
  }, 2);
};

const reset = () => {
  pointL = 0;
  pointR = 0;
  boardLY = (innerHeight - _config.boardHeight) / 2;
  boardRY = (innerHeight - _config.boardHeight) / 2;
  start();
};

const fail = $computed(() => {
  if (pointL >= 5 || pointR >= 5) {
    clearTimeout(timeOutID);
    return true;
  }
  return false;
});

const keyup = (e: KeyboardEvent) => {
  switch (e.key) {
    case "w":
      if (boardLY - _config.boardSpeed < 0) boardLY = 0;
      else boardLY -= _config.boardSpeed;
      break;
    case "s":
      if (boardLY + _config.boardHeight + _config.boardSpeed >= innerHeightLock)
        boardLY = innerHeightLock - _config.boardHeight - 1;
      else boardLY += _config.boardSpeed;
      break;
    case "i":
      if (boardRY - _config.boardSpeed < 0) boardRY = 0;
      else boardRY -= _config.boardSpeed;
      break;
    case "k":
      if (boardRY + _config.boardHeight + _config.boardSpeed >= innerHeightLock)
        boardRY = innerHeightLock - _config.boardHeight - 1;
      else boardRY += _config.boardSpeed;
      break;
  }
};
</script>

<template>
  <div class="page">
    <el-button
      @click.stop="reset()"
      v-if="fail"
      type="danger"
      style="font-size: 12px"
    >
      <h1>{{ pointL >= 5 ? "A" : "B" }}赢了!</h1>
    </el-button>
    <div />
    <el-tag :type="pointR >= 5 ? 'danger' : 'success'" size="large">
      <h2>A: {{ pointL }} 分</h2>
    </el-tag>
    <el-tag :type="pointL >= 5 ? 'danger' : 'success'" size="large">
      <h2>B: {{ pointR }} 分</h2>
    </el-tag>

    <PongBall
      :diameter="_config.diameter"
      :offset-x="ballX"
      :offset-y="ballY"
    />
    <PongBoard
      :width="_config.boardWidth"
      :height="_config.boardHeight"
      :top="boardLY"
      :left="_config.boardInterval"
    />
    <PongBoard
      :width="_config.boardWidth"
      :height="_config.boardHeight"
      :top="boardRY"
      :right="_config.boardInterval"
    />
  </div>
</template>
