<script setup lang="ts">
onMounted(() => {
  start()
})

const statusStore = useStatusStore()
const { width, height } = $(useWindowSize())
const { x: mouseX, sourceType: mouseType } = $(useMouse())
const { pressed } = $(useMousePressed())

const ball = reactive({
  x: 0,
  y: 0,
  diameter: 0,
})
const board = reactive({
  x: 0,
  width: 0,
  height: 0,
  bottom: 0,
})
const bullet = reactive({
  x: 0,
  y: 0,
  diameter: 0,
})

let { difficulty, fail } = $(statusStore)

let gameTimer: NodeJS.Timer
let bulletTimer: NodeJS.Timer
let bulletExist = $ref(false)

function start() {
  if (!difficulty)
    difficulty = config.difficulty

  const unwatchClick = watch($$(pressed), onClick)
  bulletExist = false

  statusStore.resetScore()
  fail = false

  ball.y = 0
  ball.x = width / 2 - ball.diameter
  let rateX
    = (difficulty / Math.tan((Math.random() * 40 + 30) * (Math.PI / 180))) // 30 ~ 70
    * (Math.random() > 0.5 ? 1 : -1)
  let rateY = difficulty

  clearInterval(gameTimer)
  gameTimer = setInterval(() => {
    if (bulletExist) {
      bullet.y -= 10
      if (
        bullet.x + bullet.diameter >= ball.x
        && bullet.x <= ball.x + ball.diameter
        && bullet.y + bullet.diameter >= ball.y
        && bullet.y <= ball.y + ball.diameter
      ) {
        clearInterval(bulletTimer)
        bulletExist = false
        rateY = Math.abs(rateY) * -1
        statusStore.incrementScore(1)
      }
    }

    if (ball.x + rateX <= 0 || ball.x + rateX >= width - ball.diameter)
      rateX *= -1
    ball.x += rateX

    if (ball.y + rateY <= 0)
      rateY *= -1
    if (ball.y + ball.diameter > height - board.bottom - board.height) {
      if (board.x <= ball.x + ball.diameter && board.x + board.width >= ball.x) {
        statusStore.incrementScore(1)
        if (rateY > 0) {
          rateY *= -1
          rateX *= 1.0625
        }
      }
      else if (ball.y + ball.diameter > height) {
        fail = true
        unwatchClick()
        clearInterval(gameTimer)
      }
    }
    ball.y += rateY
  }, 2)
}

function onClick() {
  if (!bulletExist) {
    bullet.x = getPosition(mouseX, bullet.diameter)
    bullet.y = height - board.bottom - board.height - bullet.diameter
    bulletExist = true
    if (mouseType === 'touch')
      bulletTimer = setTimeout(() => bulletExist = false, 1500)
    else
      bulletTimer = setTimeout(() => bulletExist = false, 1000)
  }
}

watchEffect(() => {
  ball.diameter = Math.sqrt(width * height) * (config.ball.diameter / 1200)
  bullet.diameter = Math.sqrt(width * height) * (config.bullet.diameter / 1200)
  board.width = Math.sqrt(width * height) * (config.board.width / 1200)
  board.height = Math.sqrt(width * height) * (config.board.height / 1200)
  board.bottom = Math.sqrt(width * height) * (config.board.bottom / 1200)
})

watch($$(mouseX), () => {
  board.x = getPosition(mouseX, board.width)
  if (mouseType === 'touch')
    onClick()
})

function getPosition(target: number, size: number) {
  if (target + size / 2 > width)
    return width - size
  if (target - size / 2 < 0)
    return 0
  return target - size / 2
}
</script>

<template>
  <div>
    <Status @click="start" />
    <Rank />

    <div v-show="!fail">
      <Ball :diameter="ball.diameter" :offset-x="ball.x" :offset-y="ball.y" />
      <Board :width="board.width" :height="board.height" :left="board.x" :bottom="board.bottom" />
      <Bullet v-show="bulletExist" :diameter="bullet.diameter" :offset-x="bullet.x" :offset-y="bullet.y" />
    </div>
  </div>
</template>
