export const useStatusStore = createGlobalState(
  () => {
    return {
      score: ref(0),
      fail: ref(false),
    }
  },
)
