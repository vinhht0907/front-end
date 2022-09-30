export const state = () => {
  return {
    currentIndexCourseWare: null
  }
}

export const getters = {
  currentIndexCourseWare(state) {
    return state.currentCourseWare
  }
}

export const mutations = {
  setCurrentIndexCourseWare(state, currentIndexCourseWare) {
    state.currentIndexCourseWare = currentIndexCourseWare
  }
}
