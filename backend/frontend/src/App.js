import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './pages/Marketplace/Marketplace';

import Profile from './pages/Profile/Profile';
import SellNFT from './pages/CreateNFT/CreateNFT';
import NFTPage from './pages/NFT/NFTpage';
import CreateBrand  from './pages/CreateBrand/CreateBrand';
import Landing from './pages/Landing/Landing';
import ReactDOM from "react-dom/client";
/*
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  hardhat,
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
*/
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

//import { WalletProvider } from './contexts/walletProvider';
/*
const { chains, publicClient } = configureChains(
  [hardhat, mainnet, polygon, optimism, arbitrum, zora],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'LoyaltyChain',
  projectId: '06b59f1d343697d93e3d9df4a1aba6c1',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})

*/
function App() {
  return (
   
        
          <div className="container">
              <Routes>
              <Route path="/marketplace" element={<Marketplace />}/>
                <Route path="/" element={<Landing />}/>
                <Route path="/nftPage" element={<NFTPage />}/>        
                <Route path="/profile" element={<Profile />}/>
                <Route path="/sellNFT" element={<SellNFT />}/> 
                <Route path="/createBrand" element={<CreateBrand />}/>             
              </Routes>
          </div>
   
   
  );
}

export default App;
