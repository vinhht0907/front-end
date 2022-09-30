export const state = () => {
  return {
    currentQuestion: null
  }
}

export const getters = {
  currentQuestion(state) {
    return state.currentQuestion
  }
}

export const mutations = {
  setCurrentQuestion(state, currentQuestion) {
    state.currentQuestion = currentQuestion
  }
}
