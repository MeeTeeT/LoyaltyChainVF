import Navbar from "../../components/Navbar";
import NFTTile from "../../components/NFTTile";
import BrandTile from "../../components/BrandTile";
import MarketplaceJSON from "../../LoyaltyMarketplace.json";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../../utils";
import { toNumber } from "web3-utils";
import s from "./module.style.css";
import { WalletContext } from "../../contexts/walletProvider";

export default function MarketplaceBrand({ dataBrand }) {
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
  const params = useParams();
  const brandId = params.brandId;
  console.log("databrand", brandId);
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
  const [totalValue, setTotalValue] = useState(0);
  const [lowest, setLowest] = useState(0);

  async function getNFTsByBrand(idBrand) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    /*
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        */
    var totalValueTmp = 0;
    //create an NFT Token
    try {
      let transaction = await contractLTYMarketplace.getNFTsByBrand(idBrand);
      var lowestTmp = 100000000000000;
      //Fetch all the details of every NFT from the contract and display
      const items = await Promise.all(
        transaction.map(async (i) => {
          var tokenURI = await contractLTYMarketplace.tokenURI(i.tokenId);
          console.log("getting this tokenUri", tokenURI);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          console.log("price", price);
          totalValueTmp += Number(price);

          if (lowestTmp > Number(price)) {
            lowestTmp = Number(price);
          }

          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };

          return item;
        })
      );
      if (lowestTmp != 100000000000000) {
        setLowest(lowestTmp);
      }

      setTotalValue(totalValueTmp);
      updateFetched(true);
      updateData(items);
    } catch (error) {}
  }

  async function getDataBrand(idBrand) {
    // const ethers = require("ethers");

    var brandDetail = await contractLTYAccount.getBrandFromId(idBrand);
    const IPFSUrl = await GetIpfsUrlFromPinata(
      //"https://gateway.pinata.cloud/ipfs/QmeiYiTRip2TByG9FBZHzbpwBhozHAf3UAVXMd9wGUPrvk"
      brandDetail.image
    );
    //  brandDetail.image = IPFSUrl;
    console.log("brand detail", brandDetail);

    console.log("image a afficher", IPFSUrl);
    //Fetch all the details of every NFT from the contract and display
    /*
      const items = await Promise.all(transaction.map(async i => {
          var tokenURI = await contractMarketplace.tokenURI(i.tokenId);
          console.log("getting this tokenUri", tokenURI);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
  */
    // let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    let item = {
      name: brandDetail.name,
      description: brandDetail.description,

      image: IPFSUrl,
    };
    /*
          return item;
      }))
  */
    setDatasBrand(item);
    updateBrandFetched(true);
    console.log("item : ", item);
  }

  if (!dataFetched) {
    getNFTsByBrand(brandId);
  }
  if (!dataBrandFetched) {
    getDataBrand(brandId);
  }

  /*
  useEffect(() => {
   getDataBrand(1);
  
}, [])
*/

  return (
    <div className="min-h-screen flex flex-col content-center self-center bg-base-200 pt-5 w-auto">
      <div className="md:text-xl font-bold text-primary-500 pl-10">
        {" "}
        <Link to={{ pathname: "/marketplace" }}>See All Brands </Link>
      </div>
      <br />

      <div class="content-center flex flex-col  item-center w-4/5 self-center place-content-center border border-slate-200 rounded-3xl">
        <div class="mb-12 md:mt-12 lg:mt-0 lg:mb-0">
          <div class="relative flex flex-col   rounded-3xl  bg-white px-8 py-8  ">
            <div class="flex flex-row justify-between">
              <div class="flex flex-col">
                <h2 class="mb-2 text-3xl font-bold text-slate-700 dark:text-primary-400">
                  {datasBrand ? datasBrand.name : ""} Loyalty NFT marketplace
                </h2>

                <p class="mb-0 text-slate-700 dark:text-slate-700">
                  {datasBrand ? datasBrand.description : ""}
                </p>
                <div className="flex text-center flex-col mt-0 ">
                  <div className="stats shadow m-8 bg-base-200">
                    <div className="stat">
                      <div className="stat-title text-xs">Items listed</div>
                      <div className="stat-value text-lg">{data.length}</div>
                    </div>

                    <div className="stat">
                      <div className="stat-title text-xs">Lowest (ETH)</div>
                      <div className="stat-value text-lg">{lowest}</div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-secondary"></div>

                      <div className="stat-title text-xs">
                        Total value (ETH)
                      </div>
                      <div className="stat-value text-lg">{totalValue}</div>
                      <div className="stat-desc text-secondary"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md:mb-12 lg:mb-0 pl-20">
                <img
                  src={datasBrand ? datasBrand.image : null}
                  class=" max-w-sm rounded-3xl  object-fill  border border-slate-700 aspect-square object-contain h-60 w-60"
                  alt="image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col place-items-center mt-20">
        <section
          id="Projects"
          className="w-fit mx-auto grid grid-cols-1 3xl:grid-cols-5  xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-10 gap-x-7 mt-10 mb-5"
        >
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </section>
      </div>
    </div>
  );
}
