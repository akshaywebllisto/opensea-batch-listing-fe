import "./header.scss";
import languageIcom from "../../assets/language.svg";
import magnifierIcon from "../../assets/Magnifier.svg";
import notificationIcon from "../../assets/notification.svg";
import avatarIcon from "../../assets/Ellipse.png";
import cartICon from "../../assets/cart.svg";
import { useDispatch } from "react-redux";
import { addAddress } from "../../redux/features/walletData/addressSlice";
import { AiOutlineLogout } from "react-icons/ai";
import { getOpenseaAssetsData } from "../../redux/features/openseaData/openseaAssetsSlice";
import { getOpenseaEventsData } from "../../redux/features/openseaData/openseaEventsSlice";
const Header = ({ walletAddress }) => {
  const dispatch = useDispatch();

  const disConnectMetamask = async () => {
    const userAddress = "";
    const emptyData = [];
    dispatch(addAddress(userAddress));
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("token");
    localStorage.removeItem("nonce");
    dispatch(getOpenseaAssetsData(emptyData));
    dispatch(getOpenseaEventsData(emptyData));
  };

  return (
    <div className="header_main_wrap">
      <div>
        <img src={magnifierIcon} alt="" />
      </div>
      <div>
        <img src={languageIcom} alt="" />
      </div>
      <div className="header_notification_wrp">
        <img src={notificationIcon} alt="" />
        <span>13</span>
      </div>

      <div>
        <img src={cartICon} alt="" />
      </div>
      <div>
        <img className="header_avatar_icon" src={avatarIcon} alt="" />
      </div>
      {walletAddress && (
        <div onClick={disConnectMetamask}>
          <AiOutlineLogout className="header_logout_icon" />
        </div>
      )}
    </div>
  );
};

export default Header;
