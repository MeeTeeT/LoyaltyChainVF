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
    try {
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
        let items;
        try {
          items = await Promise.all(
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
        } catch (e) {
          console.log(e);
          items = null;
        }
        //updateDataHistoryFetched(true);
        console.log("items", items);
        setHistoryNFT(items);
        console.log("historyNFT 1 : ", historyNFT);
      };
      //if (historyNFT != null) {
      fetchEventHistory();
      // }
      console.log("historyNFT 2: ", historyNFT);
    } catch (e) {
      console.log(e);
    }
  }, [data]);

  return (
    <div className="bg-base-200">
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
        className="md:text-xl pt-5 font-bold  pl-10 text-primary-500"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back{" "}
      </div>
      {/*
      <div class="w-screen h-screen bg-white flex flex-row flex-wrap p-3">
        <div class="mx-auto w-2/3">
          <div class="rounded-lg shadow-lg bg-gray-600 w-full flex flex-row flex-wrap p-3 antialiased">
            <div class="md:w-1/3 w-full">
              <img class="rounded-lg shadow-lg antialiased" src={data.image} />
            </div>
            <div class="md:w-2/3 w-full px-3 flex flex-row flex-wrap">
              <div class="w-full text-right text-gray-700 font-semibold relative pt-3 md:pt-0">
                <div class="text-2xl text-white leading-tight">Admin User</div>
                <div class="text-normal text-gray-300 hover:text-gray-400 cursor-pointer">
                  <span class="border-b border-dashed border-gray-500 pb-1">
                    Administrator
                  </span>
                </div>
                <div class="text-sm text-gray-300 hover:text-gray-400 cursor-pointer md:absolute pt-3 md:pt-0 bottom-0 right-0">
                  Last Seen: <b>2 days ago</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}

      <div>
        <div className="flex ml-10 mt-5 mb-5 pb-10 shadow appearance-none bg-base-100 border rounded-3xl py-2 px-3 w-4/5 border-slate-300 ">
          <div className="hero-content flex-col min-h-[50%] lg:flex-row w-full pt-5 pb-0 content-center">
            <img
              src={data.image}
              className="max-w-sm rounded-lg s object-fill w-1/2 aspect-square object-contain"
            />
            <section className=" rounded-lg p-3  min-h-[50%] w-1/2">
              <div className="flex justify-center">
                <div className=" mr-20 space-y-2 text-secondary  rounded-2xl  p-5">
                  <div className="text-4xl   text-slate-700 ">
                    {data.name} #{data.tokenId}
                  </div>

                  <div className="text-lg  text-slate-700 pb-6">
                    {data.description}
                  </div>
                  <div className="text-xl  mt-10  text-slate-700 ">Price</div>
                  <div className="text-m  text-slate-700 pb-4">
                    {data.price + " ETH"}
                  </div>
                  <div className="text-2xl  mt-10  text-slate-700 ">Seller</div>
                  <div className="text-m text-slate-700 pb-4">
                    {data.seller}
                  </div>

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
                        <div className="mb-2 mt-10  ">
                          <label
                            className="text-xl  mt-10  text-slate-700"
                            htmlFor="price"
                          >
                            Price (in ETH)
                          </label>
                          <input
                            className="h-full w-full rounded-[7px] border border-blue-gray-200   px-3 py-5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all    focus:border-2 focus:border-primary  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 "
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
                          className=" mt-1 enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm "
                          onClick={() => {
                            resale(tokenId);
                          }}
                        >
                          Sell
                        </button>
                      </>
                    ) : (
                      <button
                        className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm mt-10 content-center"
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

          <br />
          <br />
        </div>
        {historyNFT && (
          <div className="flex ml-10 mt-10 mb-0 pb-10 shadow appearance-none bg-base-100 border rounded-3xl py-2 px-3 w-4/5 border-slate-300 pb-10">
            <NFTHistory data={historyNFT} />
          </div>
        )}
      </div>
    </div>
  );
}
