import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "./Marketplace.scss";
import opensea from "../../assets/OpenSea-Full-Logo (dark).svg";
import Rarible from "../../assets/looksrare-seeklogo.com.svg";
import LookRare from "../../assets/rarible-seeklogo.com.svg";
const Marketplace = ({
  setListingWebsite,
  setListingTimeForNft,
  listingWebsite,
  listingTimeForNft,
}) => {
  const daySelecthandle = (eventKey) => {
    setListingTimeForNft(eventKey);
  };
  return (
    <div className="Marketplace">
      <div className="marketplace_wrp">
        <p>NFT Marketplaces</p>
        <div className="nft_marketplace">
          <div className="select_marketplace">
            <span>Select Marketplace</span>
            <div className="marketplace_network">
              <span
                className={`${
                  listingWebsite === "opensea" && "marketplace_network_hover"
                }`}
                listingTimeForNft
                onClick={() => setListingWebsite("opensea")}
              >
                Opensea <img src={opensea} alt="opensealogo" />
              </span>
              <span
                className={`${
                  listingWebsite === "rarible" && "marketplace_network_hover"
                }`}
                onClick={() => setListingWebsite("rarible")}
              >
                Rarible <img src={Rarible} alt="rariable-logo" />
              </span>
              <span
                className={`${
                  listingWebsite === "LookRare" && "marketplace_network_hover"
                }`}
                onClick={() => setListingWebsite("LookRare")}
              >
                LookRare <img src={LookRare} alt="lookararelogo" />
              </span>
            </div>
          </div>
          <div className="duration">
            <span>Duration</span>
            <Dropdown onSelect={(eventKey) => daySelecthandle(eventKey)}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {`${
                  listingTimeForNft / 24 === 1
                    ? listingTimeForNft / 24 + " Day"
                    : listingTimeForNft / 24 + " Days"
                }`}
              </Dropdown.Toggle>
              <Dropdown.Menu className="days_dropdown">
                <Dropdown.Item eventKey={24}>1 Day</Dropdown.Item>
                <Dropdown.Item eventKey={48}>2 Days</Dropdown.Item>
                <Dropdown.Item eventKey={168}>7 Days</Dropdown.Item>
                <Dropdown.Item eventKey={360}>15 Days</Dropdown.Item>
                <Dropdown.Item eventKey={720}>1 Month</Dropdown.Item>
                <Dropdown.Item eventKey={2160}>3 Month</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Marketplace;
