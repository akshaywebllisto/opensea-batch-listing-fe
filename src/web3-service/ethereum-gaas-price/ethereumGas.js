import axios from "axios";
let key = process.env.REACT_APP_ETHERSCAN_API_KEY;
let api = process.env.REACT_APP_GAS_API;

export const getEthereumGasPrice = async () => {
  let response = await axios.get(`${api}${key}`);

  return response.data.result.SafeGasPrice;
};
