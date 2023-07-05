//import logo from '../logo_3.png';
//import fullLogo from '../full_logo.png';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers'
//import { useWalletProvider } from '../hooks/useWalletProvider';
import { WalletContext} from '../contexts/walletProvider';


function Navbar() {
//const {account, contract} = useContext(ContractContext);
//console.log("account",account);
//const { account, provider, setAccount, chainId, connect } = WalletProvider();// useWalletProvider()

//const {account, provider, setAccount, chainId, connect} = useWalletProvider();
const {account, provider, setAccount, chainId, connect, contract, isRegisteredBrand,isAddressAlreadyCreatedAccount} = useContext(WalletContext);

//const [connected, toggleConnect] = useState(false);
const location = useLocation();
//const [currAddress, updateAddress] = useState('0x');

/*
async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
}
*/
/*
function updateButton() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  ethereumButton.textContent = "Connected";
  ethereumButton.classList.remove("hover:bg-blue-70");
  ethereumButton.classList.remove("bg-blue-500");
  ethereumButton.classList.add("hover:bg-green-70");
  ethereumButton.classList.add("bg-green-500");
}
*/


/*
async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        //updateButton();
       //console.log("here");
        getAddress();
        window.location.replace(location.pathname)
      });
}
*/
/*
  useEffect(() => {
    if(window.ethereum == undefined)
      return;
    let val = window.ethereum.isConnected();
    if(val)
    {
      console.log("here");
      console.log(account);
      console.log(chainId);
      
     // getAddress();
      toggleConnect(val);
     // updateButton();
    }

    window.ethereum.on('accountsChanged', function(accounts){
    //  window.location.replace(location.pathname)
    })
  });
*/
    return (
    <>
     
     <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      {
      !isAddressAlreadyCreatedAccount && (
      location.pathname === "/createBrand" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/createBrand">Create Account</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/createBrand">Create Account</Link>
              </li>    
    )          
              }
              {location.pathname === "/marketplace" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/marketplace">Marketplace</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/marketplace">Marketplace</Link>
              </li>              
              }
             {
             isRegisteredBrand && (
             location.pathname === "/sellNFT" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/sellNFT">Create My NFT</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/sellNFT">Create My NFT</Link>
              </li>     
             )         
              }  
                
                         
              {location.pathname === "/profile" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/profile">My Profile</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/profile">My Profile</Link>
              </li>              
              }  
      </ul>
    </div>
    <a className="btn btn-ghost normal-case text-xl"> <Link to="/">Loyalty Chain</Link></a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    {
    !isAddressAlreadyCreatedAccount && (
    location.pathname === "/createBrand" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/createBrand">Create Account</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/createBrand">Create Account</Link>
              </li>  
    )            
              }
              {location.pathname === "/marketplace" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/marketplace">Marketplace</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/marketplace">Marketplace</Link>
              </li>              
              }
             {
             isRegisteredBrand && (
             location.pathname === "/sellNFT" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/sellNFT">Create My NFT</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/sellNFT">Create My NFT</Link>
              </li>  )          
              }  
                
                         
              {location.pathname === "/profile" ? 
              <li className='hover:pb-0 p-2'>
                <Link to="/profile">My Profile</Link>
              </li>
              :
              <li className='hover:pb-0 p-2'>
                <Link to="/profile">My Profile</Link>
              </li>              
              }  
    </ul>
  </div>
  <div className="navbar-end">
  
    <a className="btn enableEthereumButton" onClick={connect}>
      {account !== "0x" && account !== null ? "Connected to "+(account.substring(0,3)+'...'+account.slice(-3)):"Connect to wallet"}
       </a>
  </div>
</div>


      
  
      
      </>  
    );
  }

  export default Navbar;
  
/*
  import React, { useState } from 'react';

  
const props = [
  {"icon": "",
    "label": "toto",
    "desc": "test desc",
    "link": ""

}, {"icon": "",
"label": "toto",
"desc": "test desc",
"link": ""

}];

    //boolean to always open ddm (for presentation)
    forceOpen?: boolean;
    label?: string;
    withDivider?: boolean;
    icon?: JSX.Element;
    items: DDMItem[];
    withBackground?: boolean;
}

export interface DDMItem {
    icon?: JSX.Element;
    label: string;
    desc?: string;
    link?: string;
}


function NavBar(){
    const [isOpen, setIsOpen] = useState(false);
    const [withBackground, setWithBackground] = useState(true);
    const [forceOpen, setForceOpen] = useState(true);
    const [withDivider, setWithDivider] = useState(true);
    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={` ${
                        withBackground ? 'border border-gray-300 bg-white dark:bg-gray-800 shadow-sm' : ''
                    } flex items-center justify-center w-full rounded-md  px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500`}
                    id="options-menu"
                >
                    {props.label}

                    {props.icon || (
                        <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z" />
                        </svg>
                    )}
                </button>
            </div>

            {(forceOpen || isOpen) && (
                <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div
                        className={`py-1 ${withDivider ? 'divide-y divide-gray-100' : ''}`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {props.map((item) => {
                            return (
                                <a
                                    key={item.label}
                                    href={item.link || '#'}
                                    className={`${
                                        item.icon ? 'flex items-center' : 'block'
                                    } block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600`}
                                    role="menuitem"
                                >
                                    {item.icon}

                                    <span className="flex flex-col">
                                        <span>{item.label}</span>
                                        {item.desc && <span className="text-xs text-gray-400">{item.desc}</span>}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
export default NavBar;
*/