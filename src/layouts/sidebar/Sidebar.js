import LiamLogo from "../../assets/Liamlogo.svg";
import "./sidebar.scss";
import Dashboard from "../../assets/Dashboard-Icon.svg";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOpenseaAssetsAsync } from "../../redux/features/openseaData/openseaAssetsSlice";
import { addAddress } from "../../redux/features/walletData/addressSlice";
import { getOpenseaEventsAsync } from "../../redux/features/openseaData/openseaEventsSlice";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_API;

function Sidebar() {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.walletAddress.value);

  useEffect(() => {
    if (walletAddress !== "") {
      dispatch(getOpenseaAssetsAsync(walletAddress));
      dispatch(getOpenseaEventsAsync(walletAddress));
    }
  }, [walletAddress, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      const nonce = localStorage.getItem("nonce");
      const token = localStorage.getItem("token");
      const walletAddress = localStorage.getItem("walletAddress");

      if (nonce !== null && token !== null) {
        try {
          const response = await fetch(
            `${BASE_URL}refetch?nonce=${nonce}&owner_address=${walletAddress}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "text/plain",
                "X-My-Custom-Header": "value-v",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          return false;
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const address =
      localStorage.getItem("walletAddress") == null
        ? ""
        : localStorage.getItem("walletAddress");
    dispatch(addAddress(address));
  }, [dispatch]);
  return (
    <div className="sidebar_main_wrap">
      <div className="sidebar_logo">
        <img src={LiamLogo} alt="liam-logo" />
      </div>

      <div className="sidebar_navigation">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "sidebar_nav_option sidebar_nav_option_active"
              : "sidebar_nav_option"
          }
          to="/"
        >
          <img src={Dashboard} alt="" /> Dashboard
        </NavLink>
        <NavLink
          to="/listing"
          className={({ isActive }) =>
            isActive
              ? "sidebar_nav_option sidebar_nav_option_active"
              : "sidebar_nav_option"
          }
        >
          <img src={Dashboard} alt="" /> Bulk List
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
