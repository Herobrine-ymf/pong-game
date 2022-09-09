import { acceptHMRUpdate, defineStore } from 'pinia'

export const useElementStore = defineStore('element', () => {
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

  let oldHeight = 0

  function newSize() {
    if (oldHeight !== innerHeight) {
      ball.diameter = innerHeight * (config.ball.diameter / 820)
      bullet.diameter = innerHeight * (config.bullet.diameter / 820)
      board.width = innerHeight * (config.board.width / 820)
      board.height = innerHeight * (config.board.height / 820)
      board.bottom = innerHeight * (config.board.bottom / 820)
      oldHeight = innerHeight
    }
  }

  return {
    ball,
    board,
    bullet,
    newSize,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useElementStore, import.meta.hot),
  )
}
