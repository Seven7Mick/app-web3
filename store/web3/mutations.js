const mutations = {
  SET_IS_CONNECTED(state, payload) {
    state.isConnected = payload;
  },
  SET_NATIVE_BALANCE(state, payload) {
    state.nativeBalance = payload;
  },
  SET_USER_ADDRESS(state, payload) {
    state.userAddress = payload;
  },
  SET_TOKENS(state, payload) {
    const index = state.tokens.findIndex((item) => item.symbol === payload.symbol);
    if (index !== -1) {
      state.tokens.splice(index, 1);
    }
    state.tokens = [...state.tokens, payload];
  },
  SET_ALLOWANCE(state, payload) {
    state.allowance = payload;
  },
  SET_TRANSACTIONS(state, payload) {
    state.transactions = [...state.transactions, payload];
  },
};

export default mutations;
