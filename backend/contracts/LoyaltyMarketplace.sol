//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract LoyaltyMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    
    //_Brandids variable has the most recent minted tokenId
    Counters.Counter private _brandsIds;
    
    //owner of the contract
    address payable owner;

    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;

    //Information about the brands
    struct UserAccount {
        uint brandId;
        string name;
        string description;
        string image;
        bool isABrand; // set if account is a Brand (or a Client)
        bool isBrandRegisterOnPlatform; //allow account to mint NFT
        bool isAddressAlreadyCreatedAccount;
    }

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        uint256 brandId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    //mapping to store all brands
    mapping(uint256 => UserAccount) private idToListedBrand;

    //Mapping of brand
    mapping(address => UserAccount) userAccounts;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    //set account (brand or customer)
    function createUserAccount(
        //address _addr, 
        string memory _name, 
        string memory _description, 
        string memory _image
        ) public {
        //ajouter un ownable
        require(!userAccounts[msg.sender].isAddressAlreadyCreatedAccount, "You alerady have an account");
        userAccounts[msg.sender].name = _name;
        userAccounts[msg.sender].description = _description;
        userAccounts[msg.sender].image = _image;
        userAccounts[msg.sender].isAddressAlreadyCreatedAccount = true;


        //a deporter dans les fonctions pour qu'il y ai une validation par l'admin de la plateforme
         userAccounts[msg.sender].isBrandRegisterOnPlatform = true;
        
        //Increment the brandId counter, which is keeping track of the number of brand registered who are allowed to mint
        _brandsIds.increment();
        uint256 currentBrandId = _brandsIds.current();
        userAccounts[msg.sender].brandId = currentBrandId;
        idToListedBrand[currentBrandId] = userAccounts[msg.sender];

         userAccounts[msg.sender].isABrand = true;
   }

    //set brand account as registered => Allow account to mint NFT
    function setIsBrandRegisterOnPlatform(address _addr) public{
        userAccounts[_addr].isBrandRegisterOnPlatform = true;
        
        //Increment the brandId counter, which is keeping track of the number of brand registered who are allowed to mint
       // _brandsIds.increment();
       // uint256 currentBrandId = _brandsIds.current();
       // userAccounts[_addr].brandId = currentBrandId;
       // idToListedBrand[currentBrandId] = userAccounts[_addr];

    }

    //set account as a brand account
    function setUserIsABrand(address _addr) public{
        userAccounts[_addr].isABrand = true;
    }


    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
       createListedToken(newTokenId, price);

        return newTokenId;
    }

    function getIdBrandFromAddress(address _addr) public view returns (uint _id){
        return userAccounts[_addr].brandId;
    }

    //mint NFT and sent to marketplace
    function createListedToken(uint256 tokenId, uint256 price) private {
    //require etre sur que le createur a un compte entreprise et qu'il est authorisé a minter des nft

        //Make sure the sender sent enough ETH to pay for listing
        require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            getIdBrandFromAddress(msg.sender),//brandId -> faire une fonction qui recup l'id de la brand a partir de l'adresse
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

       // approve(address(this), tokenId);
        //approve(msg.sender, tokenId);
       // setApprovalForAll(contractAddress, true);
        _transfer(msg.sender, address(this), tokenId);
         //approve(address(this), tokenId);
        //approve(msg.sender, tokenId);
        

        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
    }

//mint NFT and sent to a customer
function createListedTokenAndSendToAddress(uint256 tokenId, address _addr) private {
        //Make sure the sender sent enough ETH to pay for listing
       // require(msg.value == listPrice, "Hopefully sending the correct price");
       
        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            getIdBrandFromAddress(msg.sender),//brandId 
            payable(address(this)),
            payable(msg.sender),
            0,
            false
        );

        _transfer(msg.sender, _addr, tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            _addr,
            msg.sender,
            0,
            false
        );
    }

     //This will return all the Brands currently registered on the marketplace
    function getAllBrands() public view returns (UserAccount[] memory) {
        uint brandsCount = _brandsIds.current();
        UserAccount[] memory brands = new UserAccount[](brandsCount);
        uint currentIndex = 0;

         for(uint i=0;i<brandsCount;i++)
        {
            uint currentId = i + 1;
            UserAccount storage currentItem = idToListedBrand[currentId];
            brands[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return brands;
    }
    
    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;

        //at the moment currentlyListed is true for all, if it becomes false in the future we will 
        //filter out currentlyListed == false over here
        for(uint i=0;i<nftCount;i++)
        {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }
    
    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

      //Returns all the NFTs by brand
    function getNFTsByBrand(uint _idBrand) public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].brandId == _idBrand && idToListedToken[i+1].currentlyListed){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].brandId == _idBrand && idToListedToken[i+1].currentlyListed) {
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

 

    function removeTokenFromMarket(uint _idToken) public{
        require(_exists(_idToken), "Invalid token ID");
     //  require(idToListedToken[_idToken].seller == msg.sender, "The token is not listed on the marketplace");

    
    //delete idToListedToken[_idToken];

    
    //_transfer(address(this), msg.sender, _idToken);
        
       
        require(msg.sender == idToListedToken[_idToken].seller, "YOu need to be the owner of the NFT to sell it");
        idToListedToken[_idToken].owner = payable(msg.sender);
        idToListedToken[_idToken].seller = payable(msg.sender);
        idToListedToken[_idToken].currentlyListed = false;

        _transfer(address(this), msg.sender, _idToken);
         
       // approve(address(this), _idToken);
        
    }

    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].owner = payable(msg.sender);
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //transfer the NFT to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs for user
        approve(address(this), tokenId);
    

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }



       function addTokenToSaleOnTheMarket(uint _idToken, uint _price) public{
        require(_exists(_idToken), "Invalid token ID");
    require(ownerOf(_idToken) == msg.sender, "You are not the owner of this token");

    // Vérifier que le prix n'est pas nul
    require(_price > 0, "Price must be greater than zero");
/*
    // Ajouter le NFT à la marketplace
    idToListedToken[_idToken] = ListedToken(
        _idToken,
        getIdBrandFromAddress(msg.sender), // brandId
        payable(address(this)),
        payable(msg.sender),
        _price,
        true
    );

    // Transférer le NFT du propriétaire vers le contrat de la marketplace
    _transfer(msg.sender, address(this), _idToken);

    // Émettre un événement pour signaler que le NFT a été listé avec succès
    emit TokenListedSuccess(
        _idToken,
        address(this),
        msg.sender,
        _price,
        true
    );
    */
        
        //require(msg.sender == idToListedToken[_idToken].seller, "You need to be the owner of the NFT to sell it");
        //require(msg.value == listPrice, "Hopefully sending the correct price");

        idToListedToken[_idToken].price = _price;
        idToListedToken[_idToken].currentlyListed = true;

         idToListedToken[_idToken].seller = payable(msg.sender);
         idToListedToken[_idToken].owner = payable(address(this));

        _transfer(msg.sender, address(this), _idToken);

         //approve the user to retransfer the NFT to him
        //approve(msg.sender, _idToken);

       // payable(owner).transfer(listPrice);
         emit TokenListedSuccess(
        _idToken,
        address(this),
        msg.sender,
        _price,
        true
    );
       
    }
}