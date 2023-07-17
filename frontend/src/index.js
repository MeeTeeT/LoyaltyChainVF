import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import CreateBrand from "./pages/CreateBrand/CreateBrand";
import SellNFT from "./pages/CreateNFT/CreateNFT";
import Marketplace from "./pages/Marketplace/Marketplace";
import MarketplaceBrand from "./pages/MarketplaceBrand/MarketplaceBrand";
import Profile from "./pages/Profile/Profile";
import NFTPage from "./pages/NFT/NFTpage";
import Landing from "./pages/Landing/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { WalletProvider } from "./contexts/walletProvider";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WalletProvider>
      <HashRouter>
        <Navbar></Navbar>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/brand/:brandId" element={<MarketplaceBrand />} />
          <Route path="/sellNFT" element={<SellNFT />} />
          <Route path="/nftPage/:tokenId" element={<NFTPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createBrand" element={<CreateBrand />} />
        </Routes>
        <Footer></Footer>
      </HashRouter>
    </WalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
