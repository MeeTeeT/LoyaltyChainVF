import Navbar from "../../components/Navbar";
//import axie from "../../tile.jpeg";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import MarketplaceJSON from "../../LoyaltyMarketplace.json";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { GetIpfsUrlFromPinata } from "../../utils";
import { WalletContext } from "../../contexts/walletProvider";
import { NFTHistory } from "../../components/NFTHistory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NFTPage(props) {
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const {
    account,
    provider,
    setAccount,
    chainId,
    connect,
    contractMarketplace,
    contractLTYMarketplace,
  } = useContext(WalletContext);

  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [historyNFT, setHistoryNFT] = useState(null);
  const [dataHistoryFetched, updateDataHistoryFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");
  const [addressApprove, setAddressApprove] = useState("0x");
  const navigate = useNavigate();

  const [formParams, updateFormParams] = useState({ price: "" });

  async function getNFTData(tokenId) {
    /* const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        */
    //create an NFT Token
    var tokenURI = await contractLTYMarketplace.tokenURI(tokenId);
    const listedToken = await contractLTYMarketplace.getListedTokenForId(
      tokenId
    );
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    //console.log(listedToken);

    let item = {
      price: (listedToken.price / 1e18).toString(),
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
      currentlyListed: listedToken.currentlyListed,
    };
    //console.log(item);
    updateData(item);
    updateDataFetched(true);
    //console.log("address account", account);
    //console.log("address seller", listedToken.seller);
    updateCurrAddress(account);

    const addressApproveTmp = await contractLTYMarketplace.getApproved(tokenId);
    setAddressApprove(addressApproveTmp);
  }

  async function removeToken(tokenId) {
    try {
      /*
            const ethers = require("ethers");
            
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            */
      // const salePrice = ethers.utils.parseUnits(data.price, 'ether')
      // updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
      //run the removeTokenFromMarket function
      let transaction = await contractLTYMarketplace.removeTokenFromMarket(
        tokenId
      );
      await transaction.wait();

      // alert("You successfully remove the NFT from marketplace!");
      notifySuccess(
        "You successfully remove the Loyalty NFT from marketplace!"
      );
      updateMessage("");
      updateDataFetched(false);
    } catch (e) {
      notifyError("Error while removing Loyalty NFT from marketplace");
      // alert("Upload Error" + e);
    }
  }
  async function resale(tokenId) {
    // tokenId.preventDefault();
    //Make sure that none of the fields are empty
    if (!formParams.price) {
      updateMessage("Please fill a price");
      return -1;
    }
    try {
      const ethers = require("ethers");
      /*
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            */
      const price = ethers.utils.parseUnits(formParams.price, "ether");
      console.log("price : ", price);
      //updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
      //run the executeSale function
      let transaction = await contractLTYMarketplace.addTokenToSaleOnTheMarket(
        tokenId,
        price
      );
      await transaction.wait();

      notifySuccess("🦄 Loyalty NFT Successfully listed on marketplace !");
      //alert("You successfully set the Loyalty NFT on the market!");
      updateMessage("");
      updateDataFetched(false);
    } catch (e) {
      notifyError("Error while listing Loyalty NFT on marketplace");
      // alert("Upload Error" + e);
    }
    //console.log("fonctoin sell en cours de creation");
  }

  async function getHistory(tokenId) {
    // console.log("-----", contractLTYMarketplace);

    const startBlockNumber = 0;
    const currentBlockNumber = await provider.getBlockNumber();

    const filter = await contractLTYMarketplace.filters.EventTokenTransaction();

    const events = await contractLTYMarketplace.queryFilter(
      filter,
      startBlockNumber,
      currentBlockNumber
    );

    const items = await Promise.all(
      events.map(async (i) => {
        let item = {
          tokenId: i.args.tokenId,
          ownerFrom: i.args.ownerFrom,
          ownerTo: i.args.ownerTo,
          sellerFrom: i.args.sellerFrom,
          sellerTo: i.args.sellerTo,
          price: i.args.price,
          transactionType: i.args.transactionType,
        };
        // console.log("item : ", item);

        return item;
      })
    );
    //updateDataHistoryFetched(true);
    console.log("items", items);
    setHistoryNFT(items);
  }

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      /*
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            //Pull the deployed contract instance
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            */
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the Loyalty NFT... Please Wait (Up to 5 mins)");
      //run the executeSale function
      let transaction = await contractLTYMarketplace.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      notifySuccess("You successfully bought the Loyalty NFT!");
      //alert("You successfully bought the NFT!");
      updateMessage("");
      updateDataFetched(false);
    } catch (e) {
      notifyError("Error while removing Loyalty NFT from marketplace");
      //alert("Upload Error" + e);
    }
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);
  if (typeof data.image == "string") {
    data.image = GetIpfsUrlFromPinata(data.image);
    data.seller = data.seller.toLowerCase();
  }
  //if (!dataHistoryFetched) getHistory(tokenId);

  useEffect(() => {
    const fetchEventHistory = async () => {
      const startBlockNumber = 0;
      const currentBlockNumber = await provider.getBlockNumber();
      // currentBlockNumber.wait();
      const filter =
        await contractLTYMarketplace.filters.EventTokenTransaction();

      const events = await contractLTYMarketplace.queryFilter(
        filter,
        startBlockNumber,
        currentBlockNumber
      );

      const items = await Promise.all(
        events.map(async (i) => {
          if (i.args.tokenId == tokenId) {
            let item = {
              tokenId: i.args.tokenId,
              ownerFrom: i.args.ownerFrom,
              ownerTo: i.args.ownerTo,
              sellerFrom: i.args.sellerFrom,
              sellerTo: i.args.sellerTo,
              price: i.args.price,
              transactionType: i.args.transactionType,
            };
            // console.log("item : ", item);

            return item;
          }
        })
      );
      //updateDataHistoryFetched(true);
      console.log("items", items);
      setHistoryNFT(items);
      console.log("historyNFT 1 : ", historyNFT);
    };
    fetchEventHistory();
    console.log("historyNFT 2: ", historyNFT);
  }, [data]);

  return (
    <>
      {/*
      <div className="navbar bg-neutral text-neutral-content">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Documents</a>
            </li>
            <li>Add Document</li>
          </ul>
        </div>
      </div>
      */}
      <div
        className="md:text-xl font-bold  pl-10 text-primary-500"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back{" "}
      </div>

      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content flex-col">
          <div className="hero-content flex-col min-h-[50%] lg:flex-row w-full">
            <img
              src={data.image}
              className="max-w-sm rounded-lg shadow-2xl object-fill w-1/2"
            />
            <section className=" rounded-lg p-3  min-h-[50%] w-1/2">
              <div className="flex justify-center">
                <div className="text-xl mr-20 space-y-2 text-primary  rounded-2xl  p-5">
                  <div>{data.name}</div>

                  <div>{data.description}</div>
                  <div>
                    Price:{" "}
                    <span className="text-primary">{data.price + " ETH"}</span>
                  </div>
                  <div>
                    Owner:{" "}
                    <span className="text-sm text-primary-500">
                      {data.owner}
                    </span>
                  </div>
                  <div>
                    Seller: <span className="text-sm">{data.seller}</span>
                  </div>
                  <div>
                    Approve: <span className="text-sm">{addressApprove}</span>
                  </div>
                  <div>
                    tokeId: <span className="text-sm">{data.tokenId}</span>
                  </div>
                  <br />
                  <div>
                    {account != data.owner && account != data.seller ? (
                      <button
                        className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm"
                        onClick={() => buyNFT(tokenId)}
                      >
                        Buy this NFT
                      </button>
                    ) : data.currentlyListed == false ? (
                      <>
                        <div className="mb-6">
                          <label
                            className="block text-primary-500 text-sm font-bold mb-2"
                            htmlFor="price"
                          >
                            Price (in ETH)
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            placeholder="Min 0.01 ETH"
                            step="0.01"
                            value={formParams.price}
                            onChange={(e) =>
                              updateFormParams({
                                ...formParams,
                                price: e.target.value,
                              })
                            }
                          ></input>
                        </div>
                        <button
                          className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm "
                          onClick={() => {
                            resale(tokenId);
                          }}
                        >
                          Sell
                        </button>
                      </>
                    ) : (
                      <button
                        className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm"
                        onClick={() => {
                          removeToken(tokenId);
                        }}
                      >
                        Remove listing from marketplace
                      </button>
                    )}

                    <div className="text-green text-center mt-3">{message}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-4 xl:gap-x-12"></div>
            </section>
          </div>
          {historyNFT && (
            <div className="flex ml-0 mt-1 pb-10 w-full">
              <div className="text-xl ml-5 mr-5 space-y-8 text-primary-500 shadow-2xl rounded-2xl border-1 p-5">
                <NFTHistory data={historyNFT} />
              </div>
            </div>
          )}
          <br />
          <br />
        </div>
      </div>
    </>
  );
}
