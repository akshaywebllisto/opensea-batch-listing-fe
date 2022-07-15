import React, { useEffect, useState } from "react";
import "./Summary.scss";
import Iconpayment from "../../assets/Icon-payment-cash.png";
import begIcon from "../../assets/begIcon.svg";
import writeICon from "../../assets/writeICon.svg";
import IconEth from "../../assets/Icon-ethereum.svg";
import { useDispatch } from "react-redux";
import { getEthereumGasPrice } from "../../web3-service/ethereum-gaas-price/ethereumGas";
import { clearCart } from "../../redux/features/selected-nft-cart/nftCard";
import imgNotAvailable from "../../assets/img-not-available.png";
import { removeFlagForAllNftInCart } from "../../redux/features/openseaData/openseaAssetsSlice";

const Summary = ({
  setProccessToList,
  proccessToList,
  listingHandle,
  oneEtherInUSD,
  nftCartData,
}) => {
  const [ethereumGas, setethereumGas] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const gasResult = await getEthereumGasPrice();
      setethereumGas(gasResult);
    })();
  }, []);
  let marketFeeWithoutToFixed = 0;
  let royaltiesFeeWithoutToFixed = 0;
  let gas = 0;
  const calculateTotalGas = (inUSD = false) => {
    gas = (ethereumGas * 46016 * nftCartData.length) / 10 ** 9;
    if (inUSD) {
      return (gas * 1).toFixed(2);
    } else {
      return (gas * 1).toFixed(4);
    }
  };

  const calculateTotalMarketFee = (inUSD = false) => {
    let marketFee = 0;
    for (let nft of nftCartData) {
      if (nft.listingPrice !== undefined) {
        marketFee =
          +marketFee +
          +(
            nft.listingPrice *
            nft.asset_contract.opensea_seller_fee_basis_points
          ) /
            10000;
        marketFeeWithoutToFixed = marketFee;
        marketFee = (marketFee * 1).toFixed(4);
      }
    }
    if (inUSD && marketFee !== 0) {
      marketFee = (marketFeeWithoutToFixed * oneEtherInUSD).toFixed(2);
    }
    return marketFee;
  };

  const calculateTotalRoyaltiesFee = (inUSD = false) => {
    let royaltiesFee = 0;
    for (let nft of nftCartData) {
      if (nft.listingPrice !== undefined) {
        royaltiesFee =
          +royaltiesFee +
          +(+nft.listingPrice * +nft.asset_contract.seller_fee_basis_points) /
            10000;
        royaltiesFeeWithoutToFixed = royaltiesFee;
        royaltiesFee = (royaltiesFee * 1).toFixed(4);
      }
    }
    if (inUSD && royaltiesFee !== 0) {
      royaltiesFee = (royaltiesFeeWithoutToFixed * oneEtherInUSD).toFixed(2);
    }
    return royaltiesFee;
  };

  const calculateTotalProfit = (inUSD = false) => {
    let totalLastPrice = 0;
    let totalListingPrice = 0;

    for (let nft of nftCartData) {
      if (nft?.last_sale?.total_price !== undefined) {
        totalLastPrice = +totalLastPrice + nft.last_sale.total_price;
      }
      if (nft.listingPrice !== undefined) {
        totalListingPrice = +totalListingPrice + +nft.listingPrice;
      }
    }
    let totalProfit =
      totalListingPrice -
      gas -
      marketFeeWithoutToFixed -
      royaltiesFeeWithoutToFixed -
      totalLastPrice / 10 ** 18;
    if (totalProfit > 0) {
      if (inUSD) {
        return (totalProfit = (totalProfit * oneEtherInUSD).toFixed(2));
      } else {
        return (totalProfit * 1).toFixed(4);
      }
    } else {
      return 0;
    }
  };
  const clearCartNft = () => {
    dispatch(clearCart());
    dispatch(removeFlagForAllNftInCart());
  };

  return (
    <div className="Summary">
      <div>
        <h4>Summary</h4>
        {proccessToList === false && (
          <>
            <span className="summary_nft_count">{nftCartData.length}</span>
            <span onClick={clearCartNft} className="summary_nft_clear">
              Clear
            </span>
          </>
        )}
      </div>

      {proccessToList === false ? (
        <>
          <div className="summary_list_wrap">
            {nftCartData.length !== 0 ? (
              nftCartData.map((nft) => {
                return (
                  <div className="summary_cart" key={nft.id}>
                    <figure>
                      <img
                        src={
                          nft.image_thumbnail_url
                            ? nft.image_thumbnail_url
                            : imgNotAvailable
                        }
                        alt={"nft"}
                      />
                    </figure>
                    <div className="summary_cart_heading_wrp">
                      <h6 className="summary_cart_heading1">
                        {nft.name ? nft.name.substring(0, 10) : ""}
                      </h6>
                      <h6 className="summary_cart_heading2">
                        {nft.asset_contract.name
                          ? nft.asset_contract.name.substring(0, 10)
                          : ""}
                      </h6>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="summary_cart_empty">NFT Not Selected</div>
            )}
          </div>
          {nftCartData.length !== 0 && (
            <div className="start_listing_btn">
              <button onClick={() => setProccessToList(true)}>
                Proceed to List
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="Summary_wrp">
          <div className="summary_details">
            <figure>
              <img src={Iconpayment} alt="" />
            </figure>

            <div className="Total_gas_fees">
              <h6 className="gas_heading1">{"Total gas fees"}</h6>
              <h6 className="gas_heading2">{"Est. Maximum"}</h6>
            </div>
            <div className="all_price">
              <div className="Total_fees_price">
                {calculateTotalGas().substring(0, 7)}
                <img src={IconEth} alt="" />
              </div>
              <span>${calculateTotalGas(true).substring(0, 6)}</span>
            </div>
          </div>
          <div className="summary_details">
            <figure>
              <img className="begIcon" src={begIcon} alt="" />
            </figure>

            <div className="Total_gas_fees">
              <h6 className="gas_heading1">{"Marketplace fees"}</h6>
              <h6 className="gas_heading2">{"Est. Maximum"}</h6>
            </div>
            <div className="all_price">
              <div className="Total_fees_price">
                {calculateTotalMarketFee().toString().substring(0, 7)}
                <img src={IconEth} alt="" />
              </div>
              <span>
                ${calculateTotalMarketFee(true).toString().substring(0, 6)}
              </span>
            </div>
          </div>
          <div className="summary_details">
            <figure>
              <img className="writeicon" src={writeICon} alt="" />
            </figure>

            <div className="Total_gas_fees">
              <h6 className="gas_heading1">{"Creator Royalties"}</h6>
              <h6 className="gas_heading2">{"Est. Maximum"}</h6>
            </div>
            <div className="all_price">
              <div className="Total_fees_price">
                {calculateTotalRoyaltiesFee().toString().substring(0, 7)}
                <img src={IconEth} alt="" />
              </div>
              <span>
                ${calculateTotalRoyaltiesFee(true).toString().substring(0, 6)}
              </span>
            </div>
          </div>
        </div>
      )}
      {proccessToList && (
        <div className="total_profit">
          <div className="profit_estimate">
            <span className="total_profit_name">Total Profit </span>
            <span>Estimate minus all fees</span>
          </div>
          <div className="profit_estimate_prices">
            <span className="total_profit_name">
              {calculateTotalProfit().toString().substring(0, 7)}{" "}
              <img src={IconEth} alt="" />
            </span>
            <span>
              {" "}
              $ {calculateTotalProfit(true).toString().substring(0, 6)}
            </span>
          </div>
        </div>
      )}
      {proccessToList && (
        <div className="start_listing_btn">
          <button onClick={listingHandle}>Start Listing</button>
        </div>
      )}
    </div>
  );
};
export default Summary;
