export const state = () => {
  return {
    currentIndexImage: null
  }
}

export const getters = {
  currentIndexImage(state) {
    return state.currentIndexImage
  }
}

export const mutations = {
  setCurrentIndexImage(state, currentIndexImage) {
    state.currentIndexImage = currentIndexImage
  }
}
