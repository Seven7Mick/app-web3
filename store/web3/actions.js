import BigNumber from 'bignumber.js';
import {
  createInst,
  connectWallet,
  getUserAddress,
  getTransaction,
} from '@/utils/web3';

const actions = {
  async connectWallet({ commit }) {
    const r = await connectWallet();
    if (!r || !r.ok) {
      return null;
    }
    commit('SET_IS_CONNECTED', true);
    commit('SET_USER_ADDRESS', getUserAddress());
    return r;
  },

  async fetchToken({ commit, getters }, tokenAddress) {
    const userAddress = await getters.getUserAddress;
    const instance = await createInst(tokenAddress);
    const symbol = await instance.symbol();
    const decimalsToken = await instance.decimals();
    const decimals = new BigNumber(decimalsToken).toString();
    let balance = await instance.balanceOf(userAddress);
    balance = new BigNumber(balance).shiftedBy(-decimals).toString();
    const token = {
      symbol,
      decimals,
      balance,
      instance,
      tokenAddress,
    };
    commit('SET_TOKENS', token);
  },

  async fetchCurrentBalance({ commit, getters }, tokenSymbol) {
    const tokens = getters.getTokens;
    const token = tokens.find((item) => item.symbol === tokenSymbol);
    commit('SET_NATIVE_BALANCE', token.balance);
  },

  async fetchCurrentAllowance({ commit, getters }, payload) {
    const userAddress = getters.getUserAddress;
    const tokens = getters.getTokens;
    const { symbol, recipientAddress } = payload;
    try {
      const token = tokens.find((item) => item.symbol === symbol);
      const allowance = await token.instance.allowance(userAddress, recipientAddress);
      commit('SET_ALLOWANCE', +new BigNumber(allowance).toString());
    } catch (e) {
      console.log(e);
    }
  },

  async approve({ getters, dispatch }, payload) {
    const tokens = getters.getTokens;
    const { symbol, recipientAddress, amount } = payload;
    const token = tokens.find((item) => item.symbol === symbol);
    try {
      await token.instance.approve(recipientAddress, amount);
      dispatch('fetchCurrentAllowance', { recipientAddress, symbol });
    } catch (e) {
      console.log(e);
    }
  },

  async transfer({ commit, getters, dispatch }, payload) {
    const tokens = getters.getTokens;
    const allowance = getters.getAllowance;
    const { symbol, recipientAddress, amount } = payload;
    if (allowance < amount) {
      await dispatch('approve', payload);
    }
    const token = tokens.find((item) => item.symbol === symbol);
    const decimals = +token.decimals;
    try {
      const transferAmount = new BigNumber(amount).shiftedBy(decimals).toString();
      await token.instance.transfer(recipientAddress, transferAmount);
      commit('SET_NATIVE_BALANCE', token.balance - amount);
      dispatch('fetchToken', token.tokenAddress);
    } catch (e) {
      console.log(e);
    }
  },

  async fetchTransaction({ commit, getters }, tokenAddress) {
    const tokens = getters.getTokens;
    let result;
    const token = tokens.find((item) => item.tokenAddress === tokenAddress);
    await getTransaction(tokenAddress, async (r) => {
      result = await r.returnValues;
      const transaction = {
        from: r.event === 'Transfer' ? result.from : result.owner,
        to: r.event === 'Transfer' ? result.to : result.spender,
        type: r.event,
        amount: r.event === 'Approval'
          ? result.value
          : new BigNumber(result.value).shiftedBy(-token.decimals).toString(),
        token,
      };
      commit('SET_TRANSACTIONS', transaction);
    });
  },
};

export default actions;
