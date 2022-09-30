export const state = () => ({
  labelTypes: [],
  translationConvention: [],
  currentIndex: -1
})

export const mutations = {
  SET_LABEL_TYPES(state, labelTypes) {
    state.labelTypes = labelTypes
  },
  SET_TRANSLATION_CONVENTION(state, translationConvention) {
    state.translationConvention = translationConvention
  },
  SET_CURRENT_INDEX(state, currentIndex) {
    state.currentIndex = currentIndex
  }
}
