import { acceptHMRUpdate, defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {
  const difficulty = ref(config.difficulty)
  const score = ref(0)
  const fail = ref(false)

  function incrementScore(add: number) {
    score.value += add
  }

  function resetScore() {
    score.value = 0
  }

  return {
    difficulty,
    score,
    fail,
    incrementScore,
    resetScore,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot))
