import imgNotAvailable from "../../assets/img-not-available.png";

import "./CardListing.scss";
const CardListing = ({ createSelectedNftList, userAssetData }) => {
  return (
    <div className="CardListing">
      <div className="Card">
        {userAssetData.map((nft, idx) => {
          return (
            <div key={idx} className="listing_card">
              {nft.isOnListed && (
                <h6 className="listing_card_listed_heading">
                  {"Already Listed"}
                </h6>
              )}
              <label className="listingcard_checkbox">
                <input
                  disabled={nft.isOnListed}
                  checked={
                    nft.isSelected === undefined
                      ? false
                      : nft.isSelected && true
                  }
                  type="checkbox"
                  id="card_checkbox"
                  name="card_checkbox"
                  value={
                    nft.isSelected === undefined
                      ? false
                      : nft.isSelected && true
                  }
                  onChange={(e) => createSelectedNftList(e, nft.id, idx, nft)}
                />
                <span className="checkmark"></span>
              </label>
              <img
                src={nft.image_url ? nft.image_url : imgNotAvailable}
                alt={`${nft.name}img`}
              />
              <div className="card_details">
                <div className="card_name">
                  <span>
                    {nft.asset_contract.name !== null
                      ? nft.asset_contract.name.substring(0, 10)
                      : ""}
                  </span>
                  <p>{nft.name ? nft.name.substring(0, 10) : ""}</p>
                </div>
                <button>view</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CardListing;
