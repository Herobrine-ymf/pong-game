import { acceptHMRUpdate, defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {
  const difficulty = ref(config.difficulty)
  const difficultyLock = ref(0)
  const score = ref(0)
  const fail = ref(false)

  const displayScore = computed(() => Math.floor((score.value * difficultyLock.value) / 5))

  function lockDifficulty() {
    difficultyLock.value = difficulty.value
  }

  function incrementScore(add: number) {
    score.value += add
  }

  function resetScore() {
    score.value = 0
  }

  return {
    difficulty,
    difficultyLock,
    score,
    fail,
    displayScore,
    incrementScore,
    lockDifficulty,
    resetScore,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
