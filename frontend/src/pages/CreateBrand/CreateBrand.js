import Navbar from "../../components/Navbar";
import { useState, useContext, useRef } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
//import Marketplace from "../../LoyaltyMarketplace.json";
import { useLocation } from "react-router";
import { WalletContext } from "../../contexts/walletProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetIpfsUrlFromPinata } from "../../utils";

export default function CreateBrand() {
  const toastId = useRef(null);

  const dismiss = () => toast.dismiss(toastId.current);

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

  const notifyInfo = (message) =>
    (toastId.current = toast.info(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
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
  // const {provider, account} = useContext(ContractContext);
  const {
    account,
    provider,
    setAccount,
    chainId,
    connect,
    contractMarketplace,
    contractLTYAccount,
  } = useContext(WalletContext);

  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
  });
  const [fileURL, setFileURL] = useState(null);
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

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      disableButton();
      notifyInfo("Uploading image.. please wait...");
      updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage("");
        dismiss();
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);

        const IPFSUrl = await GetIpfsUrlFromPinata(response.pinataURL);
        setIPFSUrl(IPFSUrl);
      }
    } catch (e) {
      notifyError("Error during file upload!");
      //  console.log("Error during file upload", e);
    }
  }

  async function createAccount(e) {
    e.preventDefault();
    console.log("contract account", contractLTYAccount);
    //Upload data to IPFS
    try {
      let transaction = await contractLTYAccount.createUserAccount(
        formParams.name,
        formParams.description,
        fileURL
      );
      await transaction.wait();

      notifySuccess("Account successfully created !");
      // alert("Account successfully created !");
      enableButton();
      updateMessage("");
      updateFormParams({ name: "", description: "" });
      window.location.replace("/");
    } catch (e) {
      notifyError("Error while creating account");
      // alert("Upload error" + e);
    }
  }

  console.log("Working", process.env);
  return (
    <div className="grid flex-grow h-500  card  rounded-box place-items-center ">
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="text-center mb-4  px-20 dark:bg-primary-100 lg:text-left rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-3   bg-base-100 border border-slate-200">
          <h3 className="text-center font-bold text-primary-500 mb-8">
            Create your brand account
          </h3>
          <div class="flex grid items-start gap-6 lg:grid-cols-2 align-top">
            <div>
              <div className="mb-4">
                <label
                  className="block text-primary-500 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Brand name
                </label>
                <input
                  className="h-full w-full rounded-[7px] border border-blue-gray-200   px-3 py-5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all    focus:border-2 focus:border-primary  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  id="name"
                  type="text"
                  placeholder="Airplane company"
                  onChange={(e) =>
                    updateFormParams({ ...formParams, name: e.target.value })
                  }
                  value={formParams.name}
                ></input>
              </div>
              <div className="mb-6">
                <label
                  className="block text-primary-500 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="h-full w-full rounded-[7px] border border-blue-gray-200   px-3 py-5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all    focus:border-2 focus:border-primary  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  cols="40"
                  rows="5"
                  id="description"
                  type="text"
                  placeholder="We offer a large collection of advantages"
                  value={formParams.description}
                  onChange={(e) =>
                    updateFormParams({
                      ...formParams,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>
            <div class="flex items-center justify-center w-full align-top mt-7">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-60  border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-100  dark:bg-blue-gray-200  dark:border-slate-200 dark:hover:bg-slate-300 "
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6 w-60 h-60">
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
                      class="object-fill w-60 h-60 aspect-square object-contain rounded-3xl"
                    />
                  )}
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">
                      {fileURL == null && "Click to upload your logo"}
                    </span>{" "}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {fileURL == null && "SVG, PNG, JPG or GIF (MAX. 400Ko)"}
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
          <div className="text-error text-xs pb-4 text-center">{message}</div>
          <button
            onClick={createAccount}
            className="font-bold mt-2 w-full btn-primary text-white rounded-xl p-2 shadow-lg"
            id="list-button"
          >
            Create my account
          </button>
        </form>
      </div>
    </div>
  );
}
