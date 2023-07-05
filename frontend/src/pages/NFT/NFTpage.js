import Navbar from "../../components/Navbar";
//import axie from "../../tile.jpeg";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import MarketplaceJSON from "../../LoyaltyMarketplace.json";
import axios from "axios";
import { useState , useContext} from "react";
import { GetIpfsUrlFromPinata } from "../../utils";
import { WalletContext} from '../../contexts/walletProvider';


export default function NFTPage (props) {
    const {account, provider, setAccount, chainId, connect, contractMarketplace} = useContext(WalletContext);
    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");
    const [addressApprove, setAddressApprove] = useState("0x");
    const navigate = useNavigate();

    const [formParams, updateFormParams] = useState({  price: ''});

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
        var tokenURI = await contractMarketplace.tokenURI(tokenId);
        const listedToken = await contractMarketplace.getListedTokenForId(tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(listedToken);
    
        let item = {
            price: ((listedToken.price)/1e18).toString(),
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            currentlyListed: listedToken.currentlyListed,
        }
        console.log(item);
        updateData(item);
        updateDataFetched(true);
        console.log("address account", account);
        console.log("address seller", listedToken.seller)
        updateCurrAddress(account);

        const addressApproveTmp = await contractMarketplace.getApproved(tokenId);
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
            let transaction = await contractMarketplace.removeTokenFromMarket(tokenId);
            await transaction.wait();
    
            alert('You successfully remove the NFT from marketplace!');
            updateMessage("");
        }
        catch(e) {
            alert("Upload Error"+e)
        }
    }
    async function resale(tokenId) {
       // tokenId.preventDefault();
       //Make sure that none of the fields are empty
       if( !formParams.price )
       {
           updateMessage("Please fill a price")
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
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            console.log("price : ",price);
            //updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
            //run the executeSale function
            let transaction = await contractMarketplace.addTokenToSaleOnTheMarket(tokenId, price);
            await transaction.wait();
    
            alert('You successfully set the Loyalty NFT on the market!');
            updateMessage("");
        }
        catch(e) {
            alert("Upload Error"+e)
        }
        //console.log("fonctoin sell en cours de creation");
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
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')
            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
            //run the executeSale function
            let transaction = await contractMarketplace.executeSale(tokenId, {value:salePrice});
            await transaction.wait();
    
            alert('You successfully bought the NFT!');
            updateMessage("");
        }
        catch(e) {
            alert("Upload Error"+e)
        }
    }
    
        const params = useParams();
        const tokenId = params.tokenId;
        if(!dataFetched)
             getNFTData(tokenId);
        if(typeof data.image == "string"){
            data.image = GetIpfsUrlFromPinata(data.image);
            data.seller = (data.seller).toLowerCase();
}
    
        return(
            <>
{/*
            <div style={{"min-height":"100vh"}}>
                <Navbar></Navbar>
                <div class=" py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row -mx-4">
            <div class="md:flex-1 px-4">
                <div class="h-[460px] rounded-lg bg-gray-300 mb-4">
                    <img class="w-full h-full object-cover" src={data.image} alt="Product Image" />
                </div>
                <div class="flex -mx-2 mb-4">
                    <div class="w-1/2 px-2">
                        <button class="w-full bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Buy</button>
                    </div>
                    <div class="w-1/2 px-2">
                        <button class="w-full bg-gray-400 text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-gray-300">Sell</button>
                    </div>
                </div>
            </div>
            <div class="md:flex-1 px-4">
                <h2 class="text-2xl font-bold text-white mb-2">{data.name}</h2>
                <p class=" text-sm text-white mb-4">{data.description}</p>
                <div class="flex mb-4">
                    <div class="mr-4">
                        <span class="font-bold text-white">Price:</span>
                        <span class="text-white">{data.price + " ETH"}</span>
                    </div>
                    <div>
                        <span class="font-bold text-white">Availability :</span>
                        <span class="text-white">3 left</span>
                    </div>
                </div>
               
               
                <div>
                    <span class="font-bold text-white">NFT Loyalty Description :</span>
                    <p class="text-white text-sm mt-2">{data.description}
                    </p>
                </div>
            </div>
        </div>

    </div>
</div>
        */}
<div style={{"min-height":"100vh"}}>
<div className="md:text-xl font-bold  pl-10 text-primary-500" onclick={()=>{navigate(-1);}}>Back to Brand </div>

                <div className="flex ml-20 mt-20">
                    <img src={data.image} alt="" className="w-2/5 rounded-2xl " />
                    <div className="text-xl ml-20 space-y-8 text-primary-500 shadow-2xl rounded-2xl border-2 p-5">
                        <div>
                            Name: {data.name}
                        </div>
                        <div>
                            Description: {data.description}
                        </div>
                        <div>
                            Price: <span className="text-primary-500">{data.price + " ETH"}</span>
                        </div>
                        <div>
                            Owner: <span className="text-sm text-primary-500">{data.owner}</span>
                        </div>
                        <div>
                            Seller: <span className="text-sm">{data.seller}</span>
                        </div>
                        <div>
                            Approve: <span className="text-sm">{addressApprove} {data.seller} {account}</span>
                        </div>
                        <div>
                        { (account != (data.owner) && account != (data.seller)) ?
                            <button className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                            : 
                                data.currentlyListed ==false ?
                                <>
                                <div className="mb-6">
                                <label className="block text-primary-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                            </div>
                                <button className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm" onClick={()=>{
                                    resale(tokenId);}
                                }>Sell</button>
                                </>
                                :
                                
                                <button className="enableEthereumButton btn-primary hover:btn-primary-500 text-white font-bold py-2 px-4 rounded text-sm" onClick={()=>{
                                removeToken(tokenId);}
                            }>Remove listing from marketplace</button>
                            






                       


                            
                        }
                        
            
                        <div className="text-green text-center mt-3">{message}</div>
                        </div>
                    </div>
                </div>
                    
            </div>
            </>
        )
    }