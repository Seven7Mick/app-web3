export default {
  show({ commit }, payload) {
    commit('setIsShow', true);
    commit('setCurrentModalKey', payload.key);
    commit('setOptions', payload);
  },
  hide({ commit }) {
    commit('setIsShow', false);
    commit('setCurrentModalKey', '');
    commit('setOptions', {});
  },
  setUnclosable({ commit }) {
    commit('setUnclosable');
  },
};
