import { Network, OpenSeaSDK } from "opensea-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import CardListing from "../../components/listing-card/CardListing";
import Listing from "../../components/listing/Listing";
import Marketplace from "../../components/marketplaces/Marketplace";
import Summary from "../../components/summary/Summary";
import { useToasts } from "react-toast-notifications";

import {
  addNftToCart,
  removeNftToCart,
} from "../../redux/features/selected-nft-cart/nftCard";
import { getProviderConnection } from "../../web3-service/Connection";
import { getOneEtherPriceInUSD } from "../../web3-service/ethereumToUsd";
import "./BulkListing.scss";
import { addFlagForNftInCart } from "../../redux/features/openseaData/openseaAssetsSlice";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { setGlobalLoading } from "../../redux/features/global-loading/global-loading";
import axios from "axios";
const ONLISTAPI = process.env.REACT_APP_OPENSEA_CHECKLIST_API;
const BulkListing = () => {
  const [listingWebsite, setListingWebsite] = useState("");
  const [listingTimeForNft, setListingTimeForNft] = useState(24);
  const [oneEtherInUSD, setOneEetEtherInUSD] = useState(0);
  const [totalMarketFee, setTotalMarketFee] = useState(0);
  const [totalRoyalies, setTotalRoyalies] = useState(0);
  const [proccessToList, setProccessToList] = useState(false);
  const nftCartData = useSelector((state) => state.nftCartData.value);
  const { userAssetData, assetloading } = useSelector(
    (state) => state.assetsdata
  );
  const walletAddress = useSelector((state) => state.walletAddress.value);

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    const userAddress = localStorage.getItem("walletAddress");

    if (userAddress == null) {
      navigate("/");
    }
    (async () => {
      const result = await getOneEtherPriceInUSD();
      setOneEetEtherInUSD(result);
    })();
  }, [navigate]);

  const createSelectedNftList = async (e, nftId, idx, nft) => {
    if (e.target.checked) {
      let response;
      try {
        response = await axios.get(
          `${ONLISTAPI}/${nft.asset_contract.address}/${nft.token_id}/listings?limit=20`
        );
      } catch (error) {
        return false;
      }
      if (
        response?.data.seaport_listings?.length !== 0 &&
        response?.data.seaport_listings !== undefined
      ) {
        response = false;
      } else {
        response = true;
      }
      if (response) {
        let value = true;
        dispatch(addFlagForNftInCart({ value, idx }));
        const selectedNft = userAssetData.find((nft) => nft.id === nftId);
        dispatch(addNftToCart(selectedNft));
      } else {
        addToast("NFT Is Already Listed On Opensea", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else if (e.target.checked === false) {
      let value = false;
      dispatch(addFlagForNftInCart({ value, idx }));
      dispatch(removeNftToCart(nftId));
    }
  };

  const listingHandle = async () => {
    if (listingTimeForNft) {
      if (listingWebsite) {
        let isPriceEmpty;
        for (let nft of nftCartData) {
          isPriceEmpty = nft.listingPrice === undefined ? false : true;
        }

        if (isPriceEmpty) {
          dispatch(setGlobalLoading(true));
          let accountAddress = localStorage.getItem("walletAddress");

          let metaMaskProvider = getProviderConnection();
          const openseaSDK = new OpenSeaSDK(metaMaskProvider, {
            networkName: Network.Rinkeby,
          });
          let openseaListingResult = [];

          for (let i = 0; i < nftCartData.length; i++) {
            const expirationTime = Math.round(
              Date.now() / 1000 + 60 * 60 * listingTimeForNft
            );
            try {
              const listingResult = await openseaSDK.createSellOrder({
                asset: {
                  tokenId: nftCartData[i].token_id,
                  tokenAddress: nftCartData[i].asset_contract.address,
                },
                accountAddress,
                startAmount: nftCartData[i].listingPrice,
                endAmount: nftCartData[i].listingPrice,
                expirationTime,
              });
              openseaListingResult.push(listingResult);
              dispatch(setGlobalLoading(false));
              addToast("Listing Successful", {
                appearance: "success",
                autoDismiss: true,
              });
            } catch (error) {
              dispatch(setGlobalLoading(false));
              addToast(error.message, {
                appearance: "error",
                autoDismiss: true,
              });
            }
          }
        } else {
          addToast("Please Enter NFT Price For Listing", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } else {
        addToast("Please Select Website For Listing", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast("Please Select Day For Listing", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <div className="BulkListing">
      <div className="bulklisting_header">
        <h4>Reviews Listings</h4>
        <Header walletAddress={walletAddress} />
      </div>
      <div className="bulklisting_wrp">
        <div className="market_listing_wrp">
          {proccessToList ? (
            <div>
              <Marketplace
                listingTimeForNft={listingTimeForNft}
                listingWebsite={listingWebsite}
                setListingWebsite={setListingWebsite}
                setListingTimeForNft={setListingTimeForNft}
              />
              <Listing
                nftCartData={nftCartData}
                setTotalMarketFee={setTotalMarketFee}
                setTotalRoyalies={setTotalRoyalies}
                setOneEetEtherInUSD={setOneEetEtherInUSD}
                oneEtherInUSD={oneEtherInUSD}
              />
            </div>
          ) : assetloading ? (
            <div className="dashboard_spinner_wrp">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : userAssetData.length !== 0 ? (
            <CardListing
              userAssetData={userAssetData}
              nftCartData={nftCartData}
              createSelectedNftList={createSelectedNftList}
            />
          ) : (
            <h1 className="data_not_found_bulkListing">Data Not Found</h1>
          )}
        </div>
        <Summary
          nftCartData={nftCartData}
          totalRoyalies={totalRoyalies}
          totalMarketFee={totalMarketFee}
          oneEtherInUSD={oneEtherInUSD}
          listingWebsite={listingWebsite}
          listingTimeForNft={listingTimeForNft}
          listingHandle={listingHandle}
          setProccessToList={setProccessToList}
          proccessToList={proccessToList}
          className="summary_comp_wrp"
        />
      </div>
    </div>
  );
};

export default BulkListing;
