import Table from "react-bootstrap/Table";
import "./Listing.scss";
import opensea from "../../assets/OpenSea-Full-Logo (dark).svg";
import deleteIcons from "../../assets/Icon material-delete.png";
import IconEth from "../../assets/Icon-ethereum.svg";
import IconEthWhite from "../../assets/IconEth.png";
import imgNotAvailable from "../../assets/img-not-available.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addListingPriceToNft,
  removeNftToCart,
} from "../../redux/features/selected-nft-cart/nftCard";
import { addFlagForNftInCartById } from "../../redux/features/openseaData/openseaAssetsSlice";

const Listing = ({ oneEtherInUSD, nftCartData }) => {
  const dispatch = useDispatch();
  const handleInPrice = (e, idx) => {
    const { value } = e.target;
    dispatch(addListingPriceToNft({ value, idx }));
  };
  const handleDeleteNftFromCart = (nftId, idx) => {
    dispatch(addFlagForNftInCartById({ nftId }));
    dispatch(removeNftToCart(nftId));
  };

  const calculateMarketFee = (listingPrice, openseaFee) => {
    const value = (listingPrice * openseaFee) / 10000;
    return value;
  };
  const calculateRoyaltiesFee = (listingPrice, royalties) => {
    const value = (listingPrice * royalties) / 10000;
    return value;
  };

  return (
    <div className="Listing">
      <div className="listing_wrp">
        <p>Listings</p>
        <Table className="listing_table">
          <thead>
            <tr>
              <th className="table_row_market_heading">Market</th>
              <th>Item</th>
              <th>Last Price</th>
              <th>List Price</th>
              <th>Marketplace fee</th>
              <th>Royalties</th>
              <th className="table_row_delete_heading"> </th>
            </tr>
          </thead>

          <tbody className="items_body_details">
            {nftCartData.map((nft, idx) => {
              return (
                <tr key={nft.id} className="items_details">
                  <td className="table_market_icon ">
                    <img alt={"img for market"} src={opensea} />
                  </td>
                  <td className="table_nft_name_img">
                    <div>
                      <img
                        alt={"img for market"}
                        src={nft.image_thumbnail_url || imgNotAvailable}
                      />
                      <div>
                        <span className="heading_1">
                          {nft.name ? nft.name.substring(0, 10) : ""}
                        </span>
                        <span className="heading_2">
                          {nft.collection.name.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="table_nft_last_price">
                    <div>
                      {nft?.last_sale?.total_price
                        ? nft?.last_sale?.total_price / 10 ** 18
                        : 0}
                      <img alt={"img for market"} src={IconEth} />
                    </div>
                  </td>
                  <td className="table_nft_price">
                    <div className="table_nft_price_wrap">
                      <input
                        type="number"
                        onChange={(e) => handleInPrice(e, idx)}
                        placeholder="Price"
                      />
                      <div className="price_eth">
                        <img alt={"img for market"} src={IconEthWhite} />
                        ETH
                      </div>
                    </div>
                  </td>
                  <td className="table_nft_market_fees">
                    <div className="marketplace_fees">
                      <span className="marketplace_grow">2.5%</span>
                      <div className="marketplace_fees_price">
                        <div>
                          <span>
                            {nft.listingPrice
                              ? calculateMarketFee(
                                  nft.listingPrice,
                                  nft.asset_contract
                                    .opensea_seller_fee_basis_points
                                )
                                  .toFixed(4)
                                  .substring(0, 7)
                              : 0}
                          </span>
                          <img alt={"img for market"} src={IconEth} />
                        </div>
                        <div>
                          $
                          {nft.listingPrice
                            ? (
                                calculateMarketFee(
                                  nft.listingPrice,
                                  nft.asset_contract
                                    .opensea_seller_fee_basis_points
                                ) * oneEtherInUSD
                              )
                                .toFixed(2)
                                .substring(0, 7)
                            : 0}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="table_nft_royalties">
                    <div className="marketplace_fees">
                      <span className="marketplace_royalties">2.5%</span>
                      <div className="marketplace_fees_price">
                        {nft.listingPrice
                          ? calculateRoyaltiesFee(
                              nft.listingPrice,
                              nft.asset_contract.seller_fee_basis_points
                            )
                              .toFixed(4)
                              .substring(0, 7)
                          : 0}
                        <img alt={"img for market"} src={IconEth} />
                        <div>
                          $
                          {nft.listingPrice
                            ? (
                                calculateRoyaltiesFee(
                                  nft.listingPrice,
                                  nft.asset_contract.seller_fee_basis_points
                                ) * oneEtherInUSD
                              )
                                .toFixed(2)
                                .substring(0, 7)
                            : 0}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td
                    onClick={() => handleDeleteNftFromCart(nft.id, idx)}
                    className="table_nft_delete_btn"
                  >
                    <img alt={"img for market"} src={deleteIcons} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Listing;
