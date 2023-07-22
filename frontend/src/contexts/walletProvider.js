import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
//import Marketplace from "../LoyaltyMarketplace.json";
import LTYMarketplace from "../LTYMarketplace.json";
import LTYAccount from "../LTYAccount.json";

const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  //STATES
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [contractMarketplace, setContractMarketplace] = useState(null);
  const [contractLTYMarketplace, setContractLTYMarketplace] = useState(null);
  const [contractLTYAccount, setContractLTYAccount] = useState(null);
  const [isRegisteredBrand, setIsRegisteredBrand] = useState(null);
  const [isAddressAlreadyCreatedAccount, setIsAddressAlreadyCreatedAccount] =
    useState(null);

  let currentAccount = null;

  useEffect(() => {
    connect();
    try {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    } catch (e) {
      alert("You need to install metamask !");
    }
  }, []);

  // Connexion function
  const connect = async () => {
    const provider = await detectEthereumProvider();
    setProvider(provider);
    console.log("provider", provider);
    if (provider) {
      startApp(provider);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log(chainId);

      const providerLocal = new ethers.providers.Web3Provider(window.ethereum);
      const signer = providerLocal.getSigner();
      //updateMessage("Loading contract")

      let contract = new ethers.Contract(
        LTYMarketplace.address,
        LTYMarketplace.abi,
        signer
      );
      setContractMarketplace(contract);

      let contractLTYMarketplace = new ethers.Contract(
        LTYMarketplace.address,
        LTYMarketplace.abi,
        signer
      );
      setContractLTYMarketplace(contractLTYMarketplace);

      let contractLTYAccount = new ethers.Contract(
        LTYAccount.address,
        LTYAccount.abi,
        signer
      );
      setContractLTYAccount(contractLTYAccount);

      if (chainId.toString() === "0x539") {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              console.log("Please connect to Metamask");
            } else {
              //alert("You need to install metamask");
              console.log(err);
            }
          });
      } else if (chainId.toString() === "0x5") {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              console.log("Please connect to Metamask");
            } else {
              //alert("You need to install metamask");
              console.log(err);
            }
          });
      } else if (chainId.toString() === "0x13881") {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(handleAccountsChanged)
          .catch((err) => {
            if (err.code === 4001) {
              console.log("Please connect to Metamask");
            } else {
              //alert("You need to install metamask");
              console.log(err);
            }
          });
      } else {
        console.log(
          "Please change your network on Metamask, you need to be connected to the appropriate test network"
        );
      }
    } else {
      alert("Please install Metamask!");
      console.log("Please install Metamask!");
    }
  };

  const startApp = (provider) => {
    if (provider !== window.ethereum) {
      console.error("Do you have multiple Wallets installed ?");
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log("Disconnected");
      setAccount(null);
      setProvider(null);
      setChainId(null);
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      setAccount(currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const signer = provider.getSigner();

      //updateMessage("please wait...")

      //let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
      //let userAccountDetail = await contract.userAccounts(currentAccount);

      //let contractLTYMarketplace = new ethers.Contract(LTYMarketplace.address, LTYMarketplace.abi, signer)
      //setContractLTYMarketplace(contractLTYMarketplace);

      let contractLTYAccount = new ethers.Contract(
        LTYAccount.address,
        LTYAccount.abi,
        signer
      );
      let userAccountDetail = await contractLTYAccount.userAccounts(
        currentAccount
      );

      //await userAccountDetail.wait();
      //console.log("account detail : ",userAccountDetail);
      setIsRegisteredBrand(userAccountDetail.isBrandRegisterOnPlatform);
      setIsAddressAlreadyCreatedAccount(
        userAccountDetail.isAddressAlreadyCreatedAccount
      );
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        setAccount,
        chainId,
        connect,
        contractMarketplace,
        contractLTYMarketplace,
        contractLTYAccount,
        isRegisteredBrand,
        isAddressAlreadyCreatedAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export { WalletContext, WalletProvider };
