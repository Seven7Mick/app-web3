export default {
  setLoading(state, payload) {
    state.isLoading = payload;
  },
  setStatusText(state, payload) {
    state.loaderStatusText = payload;
  },
  setIsBgHider(state, payload) {
    state.isBgHider = payload;
  },
};
