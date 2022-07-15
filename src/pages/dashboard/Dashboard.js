import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "../../components/chart/Chart";
import Header from "../../components/header/Header";
import Spinner from "react-bootstrap/Spinner";
import { addAddress } from "../../redux/features/walletData/addressSlice";
import { connectWallet } from "../../web3-service/Connection";
import "./dashboard.scss";
import axios from "axios";
import { ethereumToUsd } from "../../web3-service/ethereumToUsd";
import { useToasts } from "react-toast-notifications";
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_API;

export const Dashboard = () => {
  const [localLoading, setLocalLoading] = useState(false);
  const [sellNftWithProfitState, setsellNftWithProfitState] = useState("");
  const [sellProfitState, setSellProfitState] = useState("");
  const [netProfitlossInPercent, setNetProfitlossInPercent] = useState(0);
  const [biggestLossState, setBiggestLossState] = useState("");
  const [biggestProfitState, setBiggestProfitState] = useState("");
  const dispatch = useDispatch();
  const { userAssetData, assetloading } = useSelector(
    (state) => state.assetsdata
  );
  const { userEventData, eventloading } = useSelector(
    (state) => state.eventsdata
  );
  const walletAddress = useSelector((state) => state.walletAddress.value);

  const { addToast } = useToasts();

  useEffect(() => {
    const getProfit = async () => {
      try {
        let percent = 0;
        let response = await axios.post(`${BASE_URL}/owner/net-profit`, {
          netProfitAndLoss: +sellProfitState,
          owner_address: walletAddress,
        });
        if (response?.data?.payload?.totalNetProfitAndLoss !== 0) {
          percent =
            ((sellProfitState - response.data.payload.totalNetProfitAndLoss) /
              response.data.payload.totalNetProfitAndLoss) *
            100;
        }

        setNetProfitlossInPercent(percent.toFixed(2));
      } catch (error) {
        return false;
      }
    };
    if (sellProfitState !== "") {
      getProfit();
    }
    setLocalLoading(false);
  }, [sellProfitState]);

  useEffect(() => {
    setLocalLoading(true);
    const createDashboardData = async () => {
      // const userAddress = "0xd4842459fD22124847539d98938EF7c411C62519";
      const userAddress = localStorage.getItem("walletAddress");
      let buyNft = [];
      let sellNft = [];
      let sellNftWithProfit = 0;
      let sellProfit = 0;
      let biggestProfit = 0;
      let biggestloss = 0;
      for (let i = 0; i < userEventData.length; i++) {
        if (
          userEventData[i]?.seller.address.toLowerCase() ===
          userAddress.toLowerCase()
        ) {
          sellNft.push(userEventData[i]);
        } else {
          let newBuyNft = {
            ...userEventData[i],
            readForCalculation: true,
          };
          buyNft.push(newBuyNft);
        }
      }

      for (let i = 0; i < sellNft.length; i++) {
        let buyfound = false;
        for (let j = buyNft.length - 1; j >= 0; j--) {
          if (
            sellNft[i].asset.asset_contract.address ===
              buyNft[j].asset.asset_contract.address &&
            sellNft[i].asset.token_id === buyNft[j].asset.token_id &&
            buyNft[j].readForCalculation
          ) {
            //  calculation for nft those sell with profit
            if (+sellNft[i].total_price > +buyNft[j].total_price) {
              sellNftWithProfit =
                sellNftWithProfit +
                +sellNft[i].total_price -
                +buyNft[j].total_price;
            }

            // calculation for all profit
            sellProfit =
              sellProfit + (+sellNft[i].total_price - +buyNft[j].total_price);

            //adding flag for already read entiry
            buyNft[j].readForCalculation = false;

            // if buy entiry found
            buyfound = true;

            //calculation of biggest loss and biggest profit
            const sellProfitDeff =
              +sellNft[i].total_price - +buyNft[j].total_price;

            if (sellProfitDeff >= 0) {
              biggestProfit =
                biggestProfit > sellProfitDeff ? biggestProfit : sellProfitDeff;
            } else if (sellProfitDeff < 0) {
              biggestloss =
                biggestloss < sellProfitDeff
                  ? Math.abs(biggestloss)
                  : Math.abs(sellProfitDeff);
            }
            //break inner for loop if buy entiry found
            break;
          }
        }

        // run if buy entiry not found
        if (buyfound === false) {
          sellNftWithProfit = sellNftWithProfit + +sellNft[i].total_price;
          sellProfit = sellProfit + +sellNft[i].total_price;
        }
      }

      const sellNftWithProfitInUSD = await ethereumToUsd(sellNftWithProfit);
      setsellNftWithProfitState(sellNftWithProfitInUSD.toFixed(2));
      const biggestLossInUSD = await ethereumToUsd(biggestloss);
      setBiggestLossState(biggestLossInUSD.toFixed(2));
      const biggestProfitInUSD = await ethereumToUsd(biggestProfit);
      setBiggestProfitState(biggestProfitInUSD.toFixed(2));

      const sellProfitInUSD = await ethereumToUsd(sellProfit);

      setSellProfitState(+sellProfitInUSD.toFixed(2));
    };
    if (userEventData.length !== 0) {
      createDashboardData();
    }
    setLocalLoading(false);
  }, [userEventData]);

  const connectMetamask = async () => {
    if (window.ethereum.overrideIsMetaMask) {
      const userAddress = await connectWallet();
      dispatch(addAddress(userAddress));
    } else {
      addToast("Please Install MetaMask Extension ", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <div className="dashboard_main_wrp">
        <div className="dashboard_data">
          <div className="dashboard_header_wrap">
            <div className="dashboard_data_heading">Dashboard</div>
            <Header walletAddress={walletAddress} />
          </div>
          {walletAddress ? (
            localLoading && assetloading && eventloading ? (
              <div className="dashboard_spinner_wrp">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : userAssetData.length === 0 && userEventData.length === 0 ? (
              <div className="data_not_found_deshboard_wrap">
                <h1 className="data_not_found_deshboard"> Data Not Found</h1>
              </div>
            ) : (
              <div className="dashboard_card_chart">
                <div className="dashboard_card_wrp_main">
                  <div className="dashboard_card_wrp">
                    <p className="card_heading_main">{userAssetData.length}</p>
                    <p className="card_heading_sub">NFT'S Minted</p>
                  </div>
                  <div className="dashboard_card_wrp">
                    <p className="card_heading_main">
                      ${sellNftWithProfitState > 0 ? sellNftWithProfitState : 0}
                    </p>
                    <p className="card_heading_sub">NFT Sales with Profit</p>
                  </div>
                  <div className="dashboard_card_wrp">
                    <p className="card_heading_main">
                      ${Math.abs(sellProfitState)}
                      <span>
                        {`${
                          netProfitlossInPercent < 0
                            ? "-" + Math.abs(netProfitlossInPercent)
                            : "+" + Math.abs(netProfitlossInPercent)
                        }`}
                        %
                      </span>
                    </p>
                    <p className="card_heading_sub">Net Profit/Loss</p>
                  </div>
                  <div className="dashboard_card_wrp">
                    <p className="card_heading_main">
                      $
                      {biggestProfitState > biggestLossState
                        ? biggestLossState
                        : biggestProfitState}
                      <span>
                        {biggestProfitState > biggestLossState ? "Loss" : "Win"}
                      </span>
                    </p>
                    <p className="card_heading_sub">Biggest Win/Loss</p>
                  </div>
                </div>
                <Chart walletAddress={walletAddress} />
              </div>
            )
          ) : (
            <div className="dashboard_login">
              <h5 className="dashboard_login_heading">
                Please Connect Your Wallet
              </h5>
              <button onClick={connectMetamask} className="dashboard_login_btn">
                Connect
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
