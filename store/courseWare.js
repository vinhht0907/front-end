export const state = () => {
  return {
    currentCourseWare: null
  }
}

export const getters = {
  currentCourseWare(state) {
    return state.currentCourseWare
  }
}

export const mutations = {
  setCurrentCourseWare(state, currentCourseWare) {
    state.currentCourseWare = currentCourseWare
  }
}
