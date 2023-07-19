import Navbar from "../../components/Navbar";
import NFTTile from "../../components/NFTTile";
import BrandTile from "../../components/BrandTile";
import MarketplaceJSON from "../../LoyaltyMarketplace.json";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { GetIpfsUrlFromPinata } from "../../utils";
import { toNumber } from "web3-utils";
import s from "./module.style.css";
import { WalletContext } from "../../contexts/walletProvider";

export default function Marketplace() {
  const {
    account,
    provider,
    setAccount,
    chainId,
    connect,
    contractMarketplace,
    contractLTYAccount,
    contractLTYMarketplace,
  } = useContext(WalletContext);

  const sampleData = [];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);
  const [viewNfts, setViewNfts] = useState(false);
  const [CollectionId, setCollectionId] = useState(null);

  /*
        console.log("viewNFT : ",viewNfts);
    async function  getAllNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getAllNFTs()
    
        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            var tokenURI = await contract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", tokenURI);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
    
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            return item;
        }))
    
        updateFetched(true);
        updateData(items);
    }
*/

  async function TotalValueByBrand(idBrand) {
    const ethers = require("ethers");
    var totalValueTmp = 0;
    try {
      let transaction = await contractLTYMarketplace.getNFTsByBrand(idBrand);

      //Fetch all the details of every NFT from the contract and display
      const items = await Promise.all(
        transaction.map(async (i) => {
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          totalValueTmp += Number(price);
        })
      );
    } catch (error) {
      console.log(error);
    }

    return totalValueTmp;
  }

  async function getAllBrands() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers

    /*const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        //let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        */
    //get all brands
    let transaction = await contractLTYAccount.getAllBrands();

    console.log("transaction brand", transaction);
    //Fetch all the details of every Brands from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        console.log("image : ", i.image);
        //var tokenURI = await contract.tokenURI(i.tokenId);
        //console.log("getting this tokenUri", tokenURI);
        //tokenURI = GetIpfsUrlFromPinata(i.image);
        //var imageFromPinataURL = GetIpfsUrlFromPinata(i.image);
        //let meta = await axios.get(i.image);
        // meta = meta.data;
        //console.log("image from pinata",imageFromPinataURL);
        const totalValue = await TotalValueByBrand(i.brandId);
        //let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let brandId = i.brandId;
        let item = {
          brandId: brandId,
          name: i.name,
          description: i.description,
          image: i.image,
          totalValue: totalValue,
        };
        console.log("item : ", item);
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) {
    getAllBrands();
  }

  return (
    <section className="mb-32  bg-base-200 min-h-screen rounded-lg p-8">
      <div className="flex flex-col place-items-center mt-0">
        <section
          id="Projects"
          class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
        >
          {data.map((value, index) => {
            return (
              <BrandTile data={value} key={index} dataBrand={value}></BrandTile>
            );
          })}
        </section>
      </div>
    </section>
  );
}
