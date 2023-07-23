import Navbar from "../../components/Navbar";
import { useState, useContext, useRef } from "react";
import {
  uploadFileToIPFS,
  uploadJSONToIPFS,
  uploadNFTOnIPFS,
} from "../../pinata";
//import Marketplace from "../../LoyaltyMarketplace.json";
import { useLocation } from "react-router";
import { Toast } from "../../components/Toast";
import { WalletContext } from "../../contexts/walletProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetIpfsUrlFromPinata } from "../../utils";
const fs = require("fs");

export default function SellNFT() {
  const toastId = useRef(null);

  const dismiss = () => toast.dismiss(toastId.current);

  const notifyInfo = (message) =>
    (toastId.current = toast.info(message, {
      position: "top-right",
      autoClose: 0,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }));

  const notifySuccess = (message) =>
    (toastId.current = toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }));

  const notifyError = (message) =>
    (toastId.current = toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }));
  const {
    account,
    provider,
    setAccount,
    chainId,
    connect,
    contractMarketplace,
    contractLTYMarketplace,
  } = useContext(WalletContext);
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState(null);
  const [fileS, setFileS] = useState(null);
  const [nftDestination, setNftDestination] = useState("to the marketplace");
  const ethers = require("ethers");
  const [message, updateMessage] = useState("");
  const location = useLocation();

  const [IPFSUrl, setIPFSUrl] = useState(null);

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#057AFF";
    listButton.style.opacity = 1;
  }

  //uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    console.log("file", file);
    //var file = fs.createReadStream(e.target.files[0]);
    // setFileS(file);

    //console.log("file", fileS);
    //check for file extension

    try {
      //upload the file to IPFS
      disableButton();
      notifyInfo("Uploading image.. please wait");
      //updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        dismiss();
        //updateMessage("");
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);

        const IPFSUrl = await GetIpfsUrlFromPinata(response.pinataURL);
        setIPFSUrl(IPFSUrl);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //uploads the metadata to IPFS
  async function uploadMetadataToIPFS() {
    const { name, description, price, address } = formParams;

    //Make sure that none of the fields are empty
    if (
      !name ||
      !description ||
      (!price && !address) ||
      !fileURL
      // !fileS
    ) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
      // image: fileS
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      //const response = await uploadNFTOnIPFS(fileS,nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  async function listNFT(e) {
    e.preventDefault();
    console.log("contractLTYMarketplace", contractLTYMarketplace);
    //Upload data to IPFS
    try {
      notifyInfo("Generating Loyalty NFT.. Please wait");
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      const price = ethers.utils.parseUnits(formParams.price, "ether");
      console.log("avant exec getListPrice");
      let listingPrice = await contractLTYMarketplace.getListPrice();
      listingPrice = listingPrice.toString();
      console.log(listingPrice);

      let transaction = await contractLTYMarketplace.createTokenToMarketplace(
        metadataURL,
        price,
        { value: listingPrice }
      );
      console.log("apres createtoken");
      await transaction.wait();
      dismiss();
      console.log("apres wait");
      notifySuccess("Successfully listed your Loyalty NFT!");
      //alert("Successfully listed your Loyalty NFT!");
      enableButton();
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "" });
      window.location.replace("/");
    } catch (e) {
      dismiss();
      notifyError("Error while minting Loyalty NFT");
      // console.log("Upload error" + e);
    }
  }
  async function listNFTtoAddress(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      notifyInfo("Generating Loyalty NFT.. Please wait");
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      let listingPrice = await contractLTYMarketplace.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contractLTYMarketplace.createTokenToAddress(
        metadataURL,
        formParams.address,
        { value: listingPrice }
      );
      await transaction.wait();
      dismiss();
      notifySuccess("Successfully send your Loyalty NFT to customer");
      // alert("Successfully send your Loyalty NFT to customer !");
      enableButton();
      updateMessage("");
      updateFormParams({ name: "", description: "", address: "" });
      window.location.replace("/");
    } catch (e) {
      dismiss();
      notifyError("Error while minting Loyalty NFT");
      //alert("Upload error" + e);
    }
  }

  console.log("Working", process.env);
  return (
    <div className="">
      <section class="mb-6 bg-white text-center dark:bg-white-100 lg:text-left rounded-3xl  p-3  border border-white  bg-white">
        <div class="px-6 py-4 md:px-12">
          <div class="flex grid items-center gap-6 lg:grid-cols-5">
            <div class="mt-2 lg:mt-0 lg:col-span-2">
              <h1 class="mb-2 text-5xl font-bold leading-tight tracking-tight">
                Create <br />
                <span class="text-primary"> your loyalty NFT</span>
              </h1>
              <p class="text-secondary dark:text-base-330">
                Personalized your NFT and send it directly to the marketplace or
                to a customer's wallet.
              </p>
            </div>
            <div class="mb-0 lg:mb-0 lg:col-span-3 ">
              <div class="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] px-6 py-6 dark:bg-primary-800 align-top border border-slate-200 md:px-12">
                <div
                  className="flex flex-col place-items-center mt-0"
                  id="nftForm"
                >
                  <form className="bg-white ">
                    <h3 className="text-center font-bold text-primary-500 mb-8">
                      Upload your Loyalty NFT
                      <div className="dropdown dropdown-close">
                        <label tabIndex={0} className="btn m-2">
                          {nftDestination}
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-52"
                        >
                          <li
                            onClick={(e) => {
                              e.preventDefault();
                              setNftDestination("to the marketplace");
                            }}
                          >
                            <a className="text-xs">to the marketplace</a>
                          </li>
                          <li
                            onClick={() => setNftDestination("to a customer")}
                          >
                            <a className="text-xs">to a customer</a>
                          </li>
                        </ul>
                      </div>
                    </h3>
                    <div class="flex grid items-start gap-6 lg:grid-cols-2 align-top">
                      <div>
                        <div className="mb-4">
                          <label
                            className="block text-primary-500 text-sm font-bold mb-2"
                            htmlFor="name"
                          >
                            NFT Loyalty Name
                          </label>
                          <input
                            className=" h-full w-full rounded-[7px] border border-blue-gray-200   px-3 py-5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all    focus:border-2 focus:border-primary  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            id="name"
                            type="text"
                            placeholder="Promo 10% on everything"
                            onChange={(e) =>
                              updateFormParams({
                                ...formParams,
                                name: e.target.value,
                              })
                            }
                            value={formParams.name}
                          ></input>
                        </div>
                        <div className="mb-6">
                          <label
                            className="block text-primary-500 text-sm font-bold mb-2"
                            htmlFor="description"
                          >
                            Loyalty Description
                          </label>
                          <textarea
                            className="h-full w-full rounded-[7px] border border-blue-gray-200   px-3 py-5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all    focus:border-2 focus:border-primary  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 "
                            cols="40"
                            rows="5"
                            id="description"
                            type="text"
                            placeholder="This campains allows you a full discount of 10% on every product"
                            value={formParams.description}
                            onChange={(e) =>
                              updateFormParams({
                                ...formParams,
                                description: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                        {nftDestination == "to the marketplace" ? (
                          <div className="mb-6">
                            <label
                              className="block text-primary-500 text-sm font-bold mb-2"
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
                        ) : (
                          <div className="mb-6">
                            <label
                              className="block text-primary-500 text-sm font-bold mb-2"
                              htmlFor="address"
                            >
                              Address of customer
                            </label>
                            <input
                              className=" h-full w-full rounded-[7px] border border-blue-gray-200   px-3 py-5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all    focus:border-2 focus:border-primary  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                              type="text"
                              placeholder="0x21....4CD5"
                              value={formParams.address}
                              onChange={(e) =>
                                updateFormParams({
                                  ...formParams,
                                  address: e.target.value,
                                })
                              }
                            ></input>
                          </div>
                        )}
                      </div>
                      <div class="flex items-center justify-center w-full align-top mt-7">
                        <label
                          for="dropzone-file"
                          class="flex flex-col items-center justify-center w-60 h-60  border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-100  dark:bg-blue-gray-200  dark:border-slate-200 dark:hover:bg-slate-300 "
                        >
                          <div class="flex flex-col items-center justify-center w-60 h-60">
                            {IPFSUrl == null ? (
                              <svg
                                class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                            ) : (
                              <img
                                src={IPFSUrl}
                                class="object-fill w-60 h-60 aspect-square object-contain border-2 border-slate-200 border-dotted rounded-3xl"
                              />
                            )}
                            <p class=" text-sm text-gray-500 dark:text-gray-400">
                              <span class="font-semibold">
                                {fileURL == null && "Click to upload"}
                              </span>{" "}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              {fileURL == null &&
                                "SVG, PNG, JPG or GIF (MAX. 400Ko)"}
                            </p>
                          </div>
                          <input
                            id="dropzone-file"
                            type={"file"}
                            onChange={OnChangeFile}
                            class="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="text-error text-xs pb-4 text-center">
                      {message}
                    </div>
                    <button
                      onClick={
                        nftDestination == "to the marketplace"
                          ? listNFT
                          : listNFTtoAddress
                      }
                      className="font-bold mt-0 w-full btn-primary text-white rounded-xl p-2 shadow-lg"
                      id="list-button"
                    >
                      {nftDestination == "to the marketplace"
                        ? "List NFT"
                        : "Send NFT to customer"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
