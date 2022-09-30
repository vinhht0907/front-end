export const state = () => {
  return {
    currentPoint: null
  }
}

export const getters = {
  currentPoint(state) {
    return state.currentPoint
  }
}

export const mutations = {
  setCurrentPoint(state, currentPoint) {
    state.currentPoint = currentPoint
  },
  setPositionPoint(state, payload) {
    state.currentPoint.offsetX = payload.x
    state.currentPoint.offsetY = payload.y
  }
}
