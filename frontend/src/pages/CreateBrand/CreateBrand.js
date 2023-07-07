import Navbar from "../../components/Navbar";
import { useState, useContext } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import Marketplace from "../../LoyaltyMarketplace.json";
import { useLocation } from "react-router";
import { WalletContext } from "../../contexts/walletProvider";

export default function CreateBrand() {
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

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      disableButton();
      updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage("");
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }
  /*
    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {name, description, price} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !price || !fileURL)
        {
            updateMessage("Please fill all the fields!")
            return -1;
        }

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }
    */

  async function createAccount(e) {
    e.preventDefault();
    console.log("contract account", contractLTYAccount);
    //Upload data to IPFS
    try {
      /*
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            disableButton();
            updateMessage("Uploading Logo (can takes few minutes).. please dont click anything!")

            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
*/
      //massage the params to be sent to the create NFT request
      // const price = ethers.utils.parseUnits(formParams.price, 'ether')
      // let listingPrice = await contract.getListPrice()
      // listingPrice = listingPrice.toString()

      //actually create the NFT
      let transaction = await contractLTYAccount.createUserAccount(
        formParams.name,
        formParams.description,
        fileURL
      );
      await transaction.wait();

      alert("Account successfully created !");
      enableButton();
      updateMessage("");
      updateFormParams({ name: "", description: "" });
      window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
    }
  }
  /*
    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1)
                return;
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            disableButton();
            updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            enableButton();
            updateMessage("");
            updateFormParams({ name: '', description: '', price: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    */

  console.log("Working", process.env);
  return (
    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-500 card  rounded-box place-items-center">
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
          <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-primary-500 mb-8">
              Create your brand account
            </h3>
            <div className="mb-4">
              <label
                className="block text-primary-500 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Brand name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <div>
              <label
                className="block text-primary-500 text-sm font-bold mb-2"
                htmlFor="image"
              >
                Upload Image (&lt;500 KB)
              </label>
              <input type={"file"} onChange={OnChangeFile}></input>
            </div>
            <br></br>
            <div className="text-red-500 text-center">{message}</div>
            <button
              onClick={createAccount}
              className="font-bold mt-10 w-full btn-primary text-white rounded p-2 shadow-lg"
              id="list-button"
            >
              Create my account
            </button>
          </form>
        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>
      <div className="grid flex-grow h-500 card rounded-box place-items-center">
        {" "}
        <img
          src="https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31"
          className="max-w-sm rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}
