const getters = {
  getIsConnected: (state) => state.isConnected,
  getNativeBalance: (state) => state.nativeBalance,
  getTokens: (state) => state.tokens,
  getUserAddress: (state) => state.userAddress,
  getAllowance: (state) => state.allowance,
  getTransactions: (state) => state.transactions,
};

export default getters;
