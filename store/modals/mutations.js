export default {
  setIsShow(state, payload) {
    state.isShow = payload;
  },
  setCurrentModalKey(state, payload) {
    state.currentModalKey = payload;
  },
  setOptions(state, payload) {
    state.options = payload;
  },
  setUnclosable(state) {
    state.options = {
      ...state.options,
      isUnclosable: true,
    };
  },
};
