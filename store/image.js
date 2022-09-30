export const state = () => {
  return {
    currentImage: null
  }
}

export const getters = {
  currentImage(state) {
    return state.currentImage
  }
}

export const mutations = {
  setCurrentImage(state, currentImage) {
    state.currentImage = currentImage
  }
}
