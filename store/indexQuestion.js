export const state = () => {
  return {
    currentIndexQuestion: null
  }
}

export const getters = {
  currentIndexQuestion(state) {
    return state.currentIndexQuestion
  }
}

export const mutations = {
  setCurrentIndexQuestion(state, currentIndexQuestion) {
    state.currentIndexQuestion = currentIndexQuestion
  }
}
