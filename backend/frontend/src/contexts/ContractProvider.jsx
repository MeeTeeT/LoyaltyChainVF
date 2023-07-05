import React, { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ContractContext = createContext();

const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const contractProvider = new ethers.providers.Web3Provider(window.ethereum);
        setContract(contractProvider);

        const accounts = await contractProvider.listAccounts();
        setAccount(accounts[0]);

        const accountBalance = await contractProvider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(accountBalance));
      }
    };

    initContract();
  }, []);

  return (
    <ContractContext.Provider value={{ contract: contract, account: account, balance: balance }}>
      {children}
    </ContractContext.Provider>
  );
};

export { ContractContext, ContractProvider };