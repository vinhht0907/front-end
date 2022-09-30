export const state = () => {
  return {
    currentReloadTable: null
  }
}

export const getters = {
  currentReloadTable(state) {
    return state.currentReloadTable
  }
}

export const mutations = {
  setCurrentReloadTable(state, currentReloadTable) {
    state.currentReloadTable = currentReloadTable
  }
}
