import Navbar from "../../components/Navbar";
import { useState, useContext } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS,uploadNFTOnIPFS } from "../../pinata";
import Marketplace from '../../LoyaltyMarketplace.json';
import { useLocation } from "react-router";
import { Toast } from "../../components/Toast";
import { WalletContext} from '../../contexts/walletProvider';
const fs = require('fs');

export default function SellNFT () {
    const {account, provider, setAccount, chainId, connect, contractMarketplace} = useContext(WalletContext);
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const [fileS, setFileS] = useState(null);
    const [nftDestination, setNftDestination] = useState('to the marketplace');
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    async function disableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = true
        listButton.style.backgroundColor = "grey";
        listButton.style.opacity = 0.3;
    }

    async function enableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = false
        listButton.style.backgroundColor = "#A500FF";
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
            updateMessage("Uploading image.. please dont click anything!")
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                enableButton();
                updateMessage("")
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
        
        
    }

    //uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        
        
        const {name, description, price} = formParams;

        //Make sure that none of the fields are empty
        if( !name || !description || !price || 
            !fileURL
           // !fileS
            )
        {
            updateMessage("Please fill all the fields!")
            return -1;
        }

        const nftJSON = {
            name, description, price, 
            image: fileURL
           // image: fileS
        }


        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            //const response = await uploadNFTOnIPFS(fileS,nftJSON);            
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
        
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1)
                return;
            //After adding your Hardhat network to your metamask, this code will get providers and signers
           /* const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            disableButton();
            updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
*/
            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contractMarketplace.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contractMarketplace.createTokenToMarketplace(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your Loyalty NFT!");
            enableButton();
            updateMessage("");
            updateFormParams({ name: '', description: '', price: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }
    async function listNFTtoAddress(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1)
                return;
           
            let listingPrice = await contractMarketplace.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contractMarketplace.createTokenToAddress(metadataURL, formParams.address, { value: listingPrice })
            await transaction.wait()

            alert("Successfully send your Loyalty NFT to customer !");
            enableButton();
            updateMessage("");
            updateFormParams({ name: '', description: '', address: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    


    console.log("Working", process.env);
    return (
        <div className="">
        <section class="mb-32 bg-white text-center dark:bg-white-100 lg:text-left">
    <div class="px-6 py-12 md:px-12">
      <div class="flex grid items-center gap-12 lg:grid-cols-2">
        <div class="mt-12 lg:mt-0">
          <h1 class="mb-12 text-5xl font-bold leading-tight tracking-tight">
            Create <br /><span class="text-primary"> your loyalty NFT</span>
          </h1>
          <p class="text-secondary dark:text-base-330">
            Personalized your NFT and send it directly to the marketplace or to a customer's wallet.
          </p>
        </div>
        <div class="mb-12 lg:mb-0">
          <div
            class="block rounded-lg bg-white px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-primary-800 md:px-12">
             <div className="flex flex-col place-items-center mt-10" id="nftForm">
            <form className="bg-white ">
            <h3 className="text-center font-bold text-primary-500 mb-8">Upload your Loyalty NFT 
            
            
            <div className="dropdown dropdown-close">
  <label tabIndex={0} className="btn m-2">{nftDestination}</label>
  <ul tabIndex={0} className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-52">
  <li onClick={(e)=>{e.preventDefault(); setNftDestination('to the marketplace')}}><a className="text-xs">to the marketplace</a></li>
    <li onClick={()=>setNftDestination('to a customer')}><a className="text-xs">to a customer</a></li>
  </ul>
</div>

            
            </h3>
                <div className="mb-4">
                    <label className="block text-primary-500 text-sm font-bold mb-2" htmlFor="name">NFT Loyalty Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Promo 10% on everything" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                </div>
                <div className="mb-6">
                    <label className="block text-primary-500 text-sm font-bold mb-2" htmlFor="description">Loyalty Description</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="This campains allows you a full discount of 10% on every product" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                </div>
                {nftDestination == "to the marketplace" ?
                <div className="mb-6">
                    <label className="block text-primary-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div>
                :
                <div className="mb-6">
                    <label className="block text-primary-500 text-sm font-bold mb-2" htmlFor="address">Address of customer</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="0x21....4CD5"  value={formParams.address} onChange={e => updateFormParams({...formParams, address: e.target.value})}></input>
                </div>
                }
                <div>
                    <label className="block text-primary-500 text-sm font-bold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>

                <br></br>
                <div className="text-red-500 text-center">{message}</div>
                <button onClick={
                    (nftDestination == "to the marketplace") ?
                    listNFT
                    :
                    listNFTtoAddress
                    } className="font-bold mt-10 w-full btn-primary text-white rounded p-2 shadow-lg" id="list-button">
                    { (nftDestination == "to the marketplace") ? "List NFT" : "Send NFT to customer"}
                </button>
            </form>
        </div>
          </div>
        </div>
      </div>
    </div>
  </section>

       
        </div>
    )
}