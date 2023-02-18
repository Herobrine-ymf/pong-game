<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'

useHead({
  title: 'Pong Game',
  link: [{
    rel: 'icon', type: 'image/png', href: '/nuxt.png',
  }],
})

const theme = computed(() => useColorMode().value === 'dark' ? darkTheme : lightTheme)

onMounted(start)

const { width, height } = $(useWindowSize())
const { x: mouseX, sourceType: mouseType } = $(useMouse())
const { pressed: mousePressed } = $(useMousePressed())

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

watchEffect(() => {
  const pixels = Math.sqrt(width * height)
  ball.diameter = config.ball.diameter / 1200 * pixels
  bullet.diameter = config.bullet.diameter / 1200 * pixels
  board.width = config.board.width / 1200 * pixels
  board.height = config.board.height / 1200 * pixels
  board.bottom = config.board.bottom / 1200 * pixels
})

let { score, fail } = $(useStatusStore())
let difficulty = $ref(config.difficulty)
let bulletExist = $ref(false)
let bulletTimer: NodeJS.Timer
let gameTimer: NodeJS.Timer

function start() {
  if (!difficulty)
    difficulty = config.difficulty

  const unwatchClick = watch($$(mousePressed), onClick)
  bulletExist = false

  score = 0
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
      bullet.y -= 15
      if (
        bullet.x + bullet.diameter >= ball.x
        && bullet.x <= ball.x + ball.diameter
        && bullet.y + bullet.diameter >= ball.y
        && bullet.y <= ball.y + ball.diameter
      ) {
        clearInterval(bulletTimer)
        bulletExist = false
        rateY = Math.abs(rateY) * -1
        score += 2
      }
    }

    if (ball.x + rateX <= 0 || ball.x + rateX >= width - ball.diameter)
      rateX *= -1
    ball.x += rateX

    if (ball.y + rateY <= 0)
      rateY *= -1
    if (ball.y + ball.diameter > height - board.bottom - board.height) {
      if (board.x <= ball.x + ball.diameter && board.x + board.width >= ball.x) {
        score += 1
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
    bulletTimer = setTimeout(() => bulletExist = false, 1000)
  }
}

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
  <n-config-provider :theme="theme">
    <n-space align="center" vertical>
      <n-tag :bordered="false" type="success" size="large">
        <h2>{{ score }} 分</h2>
      </n-tag>
      <n-collapse-transition :show="fail">
        <n-space align="center" vertical>
          <n-button type="error" @click.stop="start">
            <h1>Game Over</h1>
          </n-button>
          <n-input-number
            v-model:value="difficulty" class="w-[250px]" size="large" :min="2" :max="10"
            button-placement="both"
          />
        </n-space>
      </n-collapse-transition>
    </n-space>

    <Rank />

    <div v-show="!fail">
      <Ball :diameter="ball.diameter" :offset-x="ball.x" :offset-y="ball.y" />
      <Board :width="board.width" :height="board.height" :left="board.x" :bottom="board.bottom" />
      <Bullet v-show="bulletExist" :diameter="bullet.diameter" :offset-x="bullet.x" :offset-y="bullet.y" />
    </div>
  </n-config-provider>
</template>

<style>
html {
  padding: 0;
  user-select: none;
}

html.dark {
  background: #222;
}
</style>
