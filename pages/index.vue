<script setup lang="ts">
const elementStore = useElementStore()
const statusStore = useStatusStore()

onMounted(() => {
  addEventListener('touchmove', handleTouchmove)
  if (!config.antiCheat)
    elementStore.newSize()
  start()
})
onUnmounted(() => {
  removeEventListener('touchmove', handleTouchmove)
  stop()
})

const { ball, board, bullet } = $(elementStore)
const { difficultyLock } = $(statusStore)
let { score, fail } = $(statusStore)

let timerID: NodeJS.Timer
let bulletExist = false
let coolDown = true

function start() {
  addEventListener('mousemove', handleMousemove)
  addEventListener('click', handleClick)

  statusStore.lockDifficulty()
  score = 0
  fail = false

  bulletExist = false
  coolDown = true

  ball.y = 0
  ball.x = innerWidth / 2 - ball.diameter

  let rateX
    = (difficultyLock / Math.tan((Math.random() * 40 + 30) * (Math.PI / 180))) // 30 ~ 70
    * (Math.random() > 0.5 ? 1 : -1)
  let rateY = difficultyLock

  clearInterval(timerID)
  timerID = setInterval(() => {
    if (config.antiCheat)
      elementStore.newSize()

    if (bulletExist) {
      bullet.y -= 10
      if (
        bullet.x + bullet.diameter >= ball.x
        && bullet.x <= ball.x + ball.diameter
        && bullet.y + bullet.diameter >= ball.y
        && bullet.y <= ball.y + ball.diameter
        && coolDown
      ) {
        coolDown = false
        rateY = Math.abs(rateY) * -1
        score += 3
      }
    }

    if (ball.x + rateX <= 0)
      rateX *= -1
    if (ball.x + rateX >= innerWidth - ball.diameter)
      rateX *= -1
    ball.x += rateX

    if (ball.y + rateY <= 0)
      rateY *= -1
    if (ball.y + ball.diameter > innerHeight - board.bottom - board.height) {
      if (
        board.x <= ball.x + ball.diameter
        && board.x + board.width >= ball.x
      ) {
        score++
        if (rateY > 0) {
          rateY *= -1
          rateX *= 1.0625
        }
      }
      else if (ball.y + ball.diameter > innerHeight - 10) {
        fail = true
        stop()
      }
    }
    ball.y += rateY
  }, 2)
}

function stop() {
  removeEventListener('mousemove', handleMousemove)
  removeEventListener('click', handleClick)
  clearInterval(timerID)
}

function setPosition(target: number, size: number) {
  if (target + size / 2 > innerWidth)
    return innerWidth - size
  else if (target - size / 2 < 0)
    return 0
  else return target - size / 2
}

function handleMousemove(event: MouseEvent) {
  event.preventDefault()
  const { clientX } = event

  board.x = setPosition(clientX, board.width)

  if (!bulletExist) {
    bullet.x = setPosition(clientX, bullet.diameter)
    bullet.y = innerHeight - board.bottom - board.height - bullet.diameter
  }
}

function handleTouchmove(event: TouchEvent) {
  event.preventDefault()

  board.x = setPosition(event.changedTouches[0].clientX, board.width)
  handleClick()
}

function handleClick(event?: MouseEvent) {
  if (event)
    event.preventDefault()

  if (!bulletExist) {
    bulletExist = true
    setTimeout(() => {
      coolDown = true
      bulletExist = false
      bullet.x = board.x + board.width / 2 - bullet.diameter / 2
      bullet.y = innerHeight - board.bottom - board.height - bullet.diameter
    }, 1000)
  }
}
</script>

<template>
  <div>
    <Status @click="start" />
    <Rank />

    <div v-show="!fail">
      <Ball :diameter="ball.diameter" :offset-x="ball.x" :offset-y="ball.y" />
      <Board :width="board.width" :height="board.height" :left="board.x" :bottom="board.bottom" />
      <Bullet :diameter="bullet.diameter" :offset-x="bullet.x" :offset-y="bullet.y" />
    </div>
  </div>
</template>
