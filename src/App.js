import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Routes, Route, useNavigate } from "react-router-dom";
import BulkListing from "./pages/bulk-listing/BulkListing";
import Sidebar from "./layouts/sidebar/Sidebar";
import $ from "jquery";

function App() {
  const globalLoadingValue = useSelector(
    (state) => state.globalLoadingValue.value
  );
  const navigate = useNavigate();

  const walletAddress = useSelector((state) => state.walletAddress.value);

  useEffect(() => {
    const userAddress = localStorage.getItem("walletAddress");

    if (userAddress == null) {
      navigate("/");
    }
  }, [walletAddress, navigate]);

  useEffect(() => {
    if (globalLoadingValue) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "auto");
    }
  }, [globalLoadingValue]);
  return (
    <div className="app_wrap">
      <Sidebar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/listing" element={<BulkListing />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>

      {globalLoadingValue && <div className="global_loading"></div>}
    </div>
  );
}

export default App;
