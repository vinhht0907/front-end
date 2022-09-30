export const state = () => {
  return {
    currentIndexPoint: null
  }
}

export const getters = {
  currentIndexPoint(state) {
    return state.currentIndexPoint
  }
}

export const mutations = {
  setCurrentIndexPoint(state, currentIndexPoint) {
    state.currentIndexPoint = currentIndexPoint
  }
}
