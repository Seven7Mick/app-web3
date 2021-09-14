import Web3 from 'web3';
import Web4 from '@cryptonteam/web4';
import { output, error } from '@/utils/index';
import ERC20 from './abi/index';

let web4;
let web3Wallet;
let userAddress = '';
let currentChainId = -1;

export const fetchContractData = async (method, abi, address, params) => {
  try {
    const Contract = new web3Wallet.eth.Contract(abi, address);
    return await Contract.methods[method].apply(this, params).call();
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getUserAddress = () => userAddress;

export const createInst = async (address) => {
  if (!web4) {
    throw new Error('web4 undefined');
  }
  const abs = web4.getContractAbstraction(ERC20);
  return await abs.getInstance(address);
};

export const connectWallet = async () => {
  let provider;
  try {
    const { ethereum } = window;
    provider = ethereum;
    web3Wallet = new Web3(provider);
    userAddress = await web3Wallet.eth.getCoinbase();
    if (userAddress === null) {
      await provider.enable();
      userAddress = await web3Wallet.eth.getCoinbase();
    }
    userAddress = await web3Wallet.eth.getCoinbase();
    currentChainId = await web3Wallet.eth.net.getId();
    if (+currentChainId !== 4) {
      error(0, `invalid wallet type error, chainId: ${currentChainId}`, currentChainId);
      return;
    }

    currentChainId = await web3Wallet.eth.net.getId();
    web4 = new Web4();
    web4.setProvider(provider, userAddress);
    // eslint-disable-next-line consistent-return
    return output({ userAddress });
  } catch (err) {
    console.log(err);
    // eslint-disable-next-line consistent-return
    return error(500, 'err', err);
  }
};

export const getTransaction = (tokenAddress, fn) => {
  const inst = new web3Wallet.eth.Contract(ERC20, tokenAddress);

  inst.events.Transfer({
    fromBlock: 0,
    filter: {
      from: userAddress,
    },
  }, (e, r) => fn(r));

  inst.events.Approval({
    fromBlock: 0,
    filter: {
      owner: userAddress,
    },
  }, (e, r) => fn(r));
};
