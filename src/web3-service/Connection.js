import axios from "axios";
import Web3 from "web3";
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_API;

export const getProviderConnection = () => {
  let provider;
  if (window.ethereum.providers !== undefined) {
    const providerLength = window.ethereum.providers.length;
    provider = window.ethereum.providers[providerLength - 1];
  } else {
    provider = window.ethereum;
  }
  return provider;
};

export const connectWallet = async () => {
  try {
    let provider = getProviderConnection();
    const web3 = new Web3(provider);

    const account = await provider.request({
      method: "eth_requestAccounts",
    });

    const nonce = await axios.post(`${BASE_URL}/owner/uuid`, {
      owner_address: account[0],
    });

    const sign = await web3.eth.personal.sign(nonce.data.nonce, account[0]);

    const token = await axios.post(`${BASE_URL}/owner/login`, {
      sign: sign,
      owner_address: account[0],
      nonce: nonce.data.nonce,
    });

    localStorage.setItem("nonce", nonce.data.nonce);
    localStorage.setItem("walletAddress", account[0]);
    localStorage.setItem("token", token.data.token);
    return account[0];
  } catch (error) {
    return false;
  }
};
