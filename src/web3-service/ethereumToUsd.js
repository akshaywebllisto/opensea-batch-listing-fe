import axios from "axios";
let exchagneURL = process.env.REACT_APP_EXCHANGE_API;
export const ethereumToUsd = async (ethereumValue, convertToEther = true) => {
  try {
    if (convertToEther) {
      ethereumValue = ethereumValue / 10 ** 18;
    }
    let response = await axios.get(exchagneURL);
    return ethereumValue * response.data[0].current_price;
  } catch (error) {
    return false;
  }
};
export const getOneEtherPriceInUSD = async () => {
  try {
    let response = await axios.get(exchagneURL);
    return response.data[0].current_price;
  } catch (error) {
    return false;
  }
};
