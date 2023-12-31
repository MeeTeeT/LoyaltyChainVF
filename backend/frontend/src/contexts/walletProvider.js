import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers"
import detectEthereumProvider from "@metamask/detect-provider"
import Marketplace from '../LoyaltyMarketplace.json';

const WalletContext = createContext();

const WalletProvider = ({ children }) => {

    //STATES
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [chainId, setChainId] = useState(null)
    const [contractMarketplace, setContractMarketplace] = useState(null)
    const [isRegisteredBrand, setIsRegisteredBrand] = useState(null)
    const [isAddressAlreadyCreatedAccount, setIsAddressAlreadyCreatedAccount] = useState(null)
    

    let currentAccount = null

    //EVENTS METAMASK
    useEffect(() => {
        connect();
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
        //Faire ici le return pour remove les listeners
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
            window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
    }, [])

    // Connexion function
    const connect = async() => {
       
        const provider = await detectEthereumProvider();
        console.log("provider", provider);
        if(provider) {
            startApp(provider)
            const chainId = await window.ethereum.request({ method: 'eth_chainId'})
            console.log(chainId);
            
            
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum);
            const signer = providerLocal.getSigner();
            //updateMessage("Loading contract")
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
            setContractMarketplace(contract);

            /***** listen event */
          
              contract.on('UserAccountCreated', (event) => {
                // Traitez l'événement ici
                console.log(event);
              }).on("error", error =>{console.log("erreur lors de lecoute des evenement", error);});
              
/*
              UserAccountCreated(
                currentBrandId,
                 _name,
                 _description,
                 _image,
                 true, 
                 true,
                 true
         );
         */

            /** end listening event */

            if(chainId.toString() === "0x539") {
                window.ethereum.request({ method: 'eth_requestAccounts'})
                    .then(handleAccountsChanged)
                    .catch((err) => {
                        if(err.code === 4001) {
                            console.log('Please connect to Metamask')
                        }
                        else {
                            console.log(err)
                        }
                    })
            }
            else if(chainId.toString() === "0x5") {
                window.ethereum.request({ method: 'eth_requestAccounts'})
                    .then(handleAccountsChanged)
                    .catch((err) => {
                        if(err.code === 4001) {
                            console.log('Please connect to Metamask')
                        }
                        else {
                            console.log(err)
                        }
                    })
            }
            else {
                console.log('Please change your network on Metamask, you need to be connected to Goerli test network')
            }
        }
        else {
            console.log('Please install Metamask!')
        }
    }

    const startApp = (provider) => {
        if(provider !== window.ethereum) {
            console.error("Do you have multiple Wallets installed ?")
        }
    }

    const handleAccountsChanged = async (accounts) => {
        if(accounts.length === 0) {
            console.log('Disconnected')
            setAccount(null)
            setProvider(null)
            setChainId(null)
        }
        else if(accounts[0] !== currentAccount) {
            currentAccount = accounts[0]
            setAccount(currentAccount)

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
           
            //updateMessage("please wait...")

            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
            let userAccountDetail = await contract.userAccounts(currentAccount);
            //await userAccountDetail.wait();
            //console.log("account detail : ",userAccountDetail);
            setIsRegisteredBrand(userAccountDetail.isBrandRegisterOnPlatform);
            setIsAddressAlreadyCreatedAccount(userAccountDetail.isAddressAlreadyCreatedAccount);
            
        }
    }

    const handleChainChanged = () => {
        window.location.reload()
    }

   

    return (
        <WalletContext.Provider 
            value={{ account , provider , setAccount , chainId , connect, contractMarketplace, isRegisteredBrand,isAddressAlreadyCreatedAccount }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export { WalletContext, WalletProvider};
