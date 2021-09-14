export default {
  setLoading({ commit }, payload) {
    commit('setLoading', payload);
    commit('setStatusText', '');
    commit('setIsBgHider', false);
  },
  setIsBgHider({ commit }, payload) {
    commit('setIsBgHider', payload);
  },
  setStatusText({ commit }, payload) {
    commit('setStatusText', payload);
  },
  setLoaderMode({ commit }, payload) {
    commit('setLoaderMode', payload);
  },
};
