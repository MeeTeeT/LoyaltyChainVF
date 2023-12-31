import Navbar from "../../components/Navbar";
import NFTTile from "../../components/NFTTile";
import BrandTile from "../../components/BrandTile";
import MarketplaceJSON from "../../LoyaltyMarketplace.json";
import axios from "axios";
import { useState,useEffect, useContext } from "react";
import { useLocation, useParams,Link } from 'react-router-dom';
import { GetIpfsUrlFromPinata } from "../../utils";
import { toNumber } from 'web3-utils';
import s from "./module.style.css";
import { WalletContext} from '../../contexts/walletProvider';

export default function MarketplaceBrand({dataBrand}) {
  const {account, provider, setAccount, chainId, connect, contractMarketplace} = useContext(WalletContext);
    const params = useParams();
        const brandId = params.brandId;
    console.log("databrand",brandId);
    const sampleData = [
        /*
        {
            "name": "NFT#1",
            "description": "NFT in creation...",
            "website":"http://axieinfinity.io",
            "image":"../../assets/images/loadingCard.png",
            "price":"waiting...",
            "currentlySelling":"True",
            "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        }
        ,
        {
            "name": "NFT#2",
            "description": "Alchemy's Second NFT",
            "website":"http://axieinfinity.io",
            "image":"https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
            "price":"0.03ETH",
            "currentlySelling":"True",
            "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#3",
            "description": "Alchemy's Third NFT",
            "website":"http://axieinfinity.io",
            "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
            "price":"0.03ETH",
            "currentlySelling":"True",
            "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },*/
        
    ];
    const [data, updateData] = useState(sampleData);
    const [datasBrand, setDatasBrand] = useState();
    const [dataFetched, updateFetched] = useState(false);
    const [dataBrandFetched, updateBrandFetched] = useState(false);
    const [viewNfts, setViewNfts] = useState(false);
    const [CollectionId, setCollectionId] = useState(null);



    async function  getNFTsByBrand(idBrand) {
       
      const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        /*
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        */
        //create an NFT Token
        let transaction = await contractMarketplace.getNFTsByBrand(idBrand);
    
        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            var tokenURI = await contractMarketplace.tokenURI(i.tokenId);
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

    async function  getDataBrand(idBrand) {
     // const ethers = require("ethers");
      
      let brandDetail = await contractMarketplace.getBrandFromId(idBrand);
    console.log("brand detail", brandDetail);

    console.log("image", brandDetail.image);
      //Fetch all the details of every NFT from the contract and display
      /*
      const items = await Promise.all(transaction.map(async i => {
          var tokenURI = await contractMarketplace.tokenURI(i.tokenId);
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
  */
      setDatasBrand(brandDetail);
      updateBrandFetched(true);
      console.log("data brand : ",datasBrand);
  }


        console.log("viewNFT : ",viewNfts);
    

    
    
    

    if(!dataFetched){
        getNFTsByBrand(brandId);
    }
    if(!dataBrandFetched){
      getDataBrand(brandId);
  }
  
  
  useEffect(() => {
   //getDataBrand(1);
  
}, [])
    
    return (
        <div className="min-h-screen ">

            
          <section className="mb-32  bg-base-200 min-h-screen rounded-lg p-8">
            <div className="md:text-xl font-bold text-primary-500 pl-10" > <Link to={{pathname:"/marketplace"}}>See All Brands </Link></div>
            <section className="mb-32">
    <div className="flex flex-wrap">
      <div className="mb-12 w-full shrink-0 grow-0 basis-auto lg:mb-0 lg:w-5/12">
        <div className="flex lg:py-12">
          <img src=""
            className="z-[10] w-full rounded-lg shadow-lg dark:shadow-black/20 lg:ml-[50px]" alt="image"/>
        </div>
      </div>

      <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
        <div
          className="flex h-full items-center rounded-lg bg-primary p-6 text-center text-white lg:pl-12 lg:text-left">
          <div className="lg:pl-12">
            <h2 className="mb-8 text-3xl font-bold">{/*datasBrand.name*/} Loyalty NFT marketplace</h2>
            

            <div className="mx-auto mb-8 flex flex-col md:flex-row md:justify-around xl:justify-start">
              <p className="mx-auto mb-4 flex items-center md:mx-0 md:mb-2 lg:mb-0 xl:mr-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor" className="mr-2 h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Best team
              </p>

              <p className="mx-auto mb-4 flex items-center md:mx-0 md:mb-2 lg:mb-0 xl:mr-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor" className="mr-2 h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Best quality
              </p>

              <p className="mx-auto mb-2 flex items-center md:mx-0 lg:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor" className="mr-2 h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Best experience
              </p>
            </div>

            <p>
            {/*datasBrand.description*/} DESCRIPTION 
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
            <div className="flex flex-col place-items-center mt-20">
            
                <section id="Projects"
    className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                    
                    {data.map((value, index) => {
                        return <NFTTile 
                        data={value} key={index} 
                        >
                    </NFTTile>;
                    })}
                </section>
            </div> 
            </section>

        </div>
    );
    
    }