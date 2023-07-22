import Navbar from "../../components/Navbar";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../../LTYMarketplace.json";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import NFTTile from "../../components/NFTTile";
import { GetIpfsUrlFromPinata } from "../../utils";
import { WalletContext } from "../../contexts/walletProvider";

export default function Profile() {
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
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  // const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");

  useEffect(() => {
    getNFTData();
  }, [account, provider]);

  async function getNFTData() {
    const ethers = require("ethers");
    let sumPrice = 0;

    //create an NFT Token
    try {
      let transaction = await contractLTYMarketplace.getMyNFTs();

      const items = await Promise.all(
        transaction.map(async (i) => {
          var tokenURI = await contractLTYMarketplace.tokenURI(i.tokenId);
          console.log("getting this tokenUri", tokenURI);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
          sumPrice += Number(price);
          return item;
        })
      );

      updateData(items);
      updateFetched(true);
      //updateAddress(account);
      updateTotalPrice(sumPrice.toPrecision(3));
    } catch (e) {
      console.log("check network or account", e);
    }
  }

  //const params = useParams();
  //const tokenId = params.tokenId;

  if (!dataFetched) getNFTData();

  return (
    <>
      <div className="profileClass" style={{ "min-height": "80vh" }}>
        <div className="profileClass ">
          <div className="flex text-center flex-col mt-2 md:text-2xl text-primary-500 ">
            <div className="stats shadow m-8 bg-slace-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
              <div className="stat">
                <div className="stat-title text-lg">Wallet</div>
                <div className="stat-value text-primary">
                  {account.substring(0, 3) + "..." + account.slice(-3)}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title text-lg">Number of items</div>
                <div className="stat-value text-secondary">{data.length}</div>
                <div className="stat-desc">
                  {data.length > 0 && "Well Done !"}
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary"></div>
                <div className="stat-value">{totalPrice}</div>
                <div className="stat-title text-lg">Total value (ETH)</div>
                <div className="stat-desc text-secondary"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-center items-center mt-2 text-primary-500">
            <section
              id="Projects"
              class="w-fit mx-auto grid grid-cols-1 3xl:grid-cols-5  xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-10 gap-x-7 mt-4 mb-5"
            >
              {data.map((value, index) => {
                return <NFTTile data={value} key={index}></NFTTile>;
              })}
            </section>
            <div className="mt-10 text-xs text-alert">
              {data.length == 0
                ? "It seems you don't have any Loyalty NFT"
                : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
