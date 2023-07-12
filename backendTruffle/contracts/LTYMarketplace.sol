//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


import "./LTYAccount.sol";

/// @title Loyalty Marketplace
/// @author Thibaut Pauget
/// @notice Loyalty NFT Marketplace : Mint, Send, Buy, Sell NFT
/// @dev All function calls are currently implemented without side effects
contract LTYMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    LTYAccount public LTYAccountContract;
   // address LTYAccountAddress;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;

    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;

    //_Brandids variable has the most recent minted tokenId
    Counters.Counter private _brandsIds;

    //owner of the contract
    address payable public owner;

    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 public listPrice = 0.01 ether;

    //Structure to store info about an NFT
    struct ListedToken {
        uint256 tokenId;
        uint256 brandId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a NFT is successfully listed
    event EventTokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //the event emit when an action is set on NFT (mint, list, delist ...)
    event EventTokenTransaction(
        uint256 indexed tokenId,
        address ownerFrom,
        address ownerTo,
        address sellerFrom,
        address sellerTo,
        uint256 price,
        string transactionType
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    //mapping to store all brands
    //mapping(uint256 => UserAccount) private idToListedBrand;

    //Mapping of brand
    //mapping(address => UserAccount) public userAccounts;

    constructor(address _LTYAccountContractAddress) ERC721("LoyaltyChain", "LTY") {
        owner = payable(msg.sender);
        LTYAccountContract = LTYAccount(_LTYAccountContractAddress);
    }

    /// @notice Update listing price fees
    /// @param _listPrice Price of the listing fees
    ///TO DO  a mettre Ownable
    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    /// @notice Get detail of NFT Token from Id
    /// @param _tokenId of the brand
    /// @return ListedToken
    function getListedTokenForId(uint256 _tokenId)
        public
        view
        returns (ListedToken memory)
    {
        return idToListedToken[_tokenId];
    }

    /// @notice Get current NFT Id
    /// @return current Id
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    /// @notice Mint and list NFT on marketplace
    /// @dev Mint (and list NFT on marketplace with createListedToken)
    /// @param _tokenURI of th NFT (IPFS URL with the NFT metadata)
    /// @param _price initial listing price
    /// @return newTokenId
    function createTokenToMarketplace(string memory _tokenURI, uint256 _price)
        public
        payable
        returns (uint256)
    {
        //Check if the minter is a authorized to mint NFT
       /* 
       require( 
            LTYAccountContract.userAccounts[msg.sender].isBrandRegisterOnPlatform == true,
            "You need to be a registred brand to mint NFT"
        );
        */
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with newTokenId to the address who called createTokenToMarketplace
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId with the tokenURI
        _setTokenURI(newTokenId, _tokenURI);

        emit EventTokenTransaction(
            newTokenId,
            msg.sender,
            msg.sender,
            msg.sender,
            msg.sender,
            0,
            "mint"
        );

        //update Global variables, list NFT on marketplace,  and emit an event
        createListedToken(newTokenId, _price);
        return newTokenId;
    }

    /// @notice Mint and send NFT to an address
    /// @dev Mint (and send NFT to an address with createListedTokenAndSendToAddress)
    /// @param _tokenURI of th NFT (IPFS URL with the NFT metadata)
    /// @param _addr address of the future Owner
    /// @return newTokenId

    function createTokenToAddress(string memory _tokenURI, address _addr)
        public
        payable
        returns (uint256)
    {
        //Check if the minter is a authorized to mint NFT
        /*
        require(
            LTYAccountContract.userAccounts[msg.sender].isBrandRegisterOnPlatform == true,
            "You need to be a registred brand to mint NFT"
        );
        */
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, _tokenURI);

        emit EventTokenTransaction(
            newTokenId,
            msg.sender,
            msg.sender,
            msg.sender,
            msg.sender,
            0,
            "mint"
        );

        //update Global variables, send NFT to his new Owner,  and emit an event
        createListedTokenAndSendToAddress(newTokenId, _addr);
        return newTokenId;
    }

   
    /// @notice Send NFT to marketplace
    /// @dev Update Global Variable, Send NFT to marketplace and emit event
    /// @param _tokenId of the NFT to list on marketplace
    /// @param _price of the listed NFT
    function createListedToken(uint256 _tokenId, uint256 _price) private {
        //Check if the minter is a authorized to mint NFT
        /*
        require(
            LTYAccountContract.userAccounts[msg.sender].isBrandRegisterOnPlatform == true,
            "You need to be a registred brand to mint NFT"
        );
        */
        //Make sure the sender sent enough ETH to pay for listing
        require(msg.value == listPrice, "You need to send the listing fee");
        require(_price > 0, "Price need to be positive");

        //Update the mapping of tokenId to Token details
        idToListedToken[_tokenId] = ListedToken(
            _tokenId,
            LTYAccountContract.getIdBrandFromAddress(msg.sender), //brandId -> faire une fonction qui recup l'id de la brand a partir de l'adresse
            payable(address(this)),
            payable(msg.sender),
            _price,
            true
        );

        //Transfer NFT to the marketplace
        _transfer(msg.sender, address(this), _tokenId);

        emit EventTokenTransaction(
            _tokenId,
            address(this),
            address(this),
            msg.sender,
            msg.sender,
            _price,
            "Send to marketplace"
        );

        //Emit the event for successful transfer. The frontend listen to this message
        emit EventTokenListedSuccess(
            _tokenId,
            address(this),
            msg.sender,
            _price,
            true
        );
    }

    /// @notice get Listing price
    /// @return listPrice
     function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    /// @notice Send NFT to a customer
    /// @dev Update Global Variable, Send NFT to a customer and emit event
    /// @param _tokenId of the NFT to list on marketplace
    /// @param _addr of the listed NFT
    function createListedTokenAndSendToAddress(uint256 _tokenId, address _addr)
        private
    {
        //Check if the minter is a authorized to mint NFT
        /*
        require(
            LTYAccountContract.userAccounts[msg.sender].isBrandRegisterOnPlatform == true,
            "You need to be a registred brand to mint NFT"
        );
        */
        //Update the mapping of tokenId to Token details
        idToListedToken[_tokenId] = ListedToken(
            _tokenId,
            LTYAccountContract.getIdBrandFromAddress(msg.sender), //brandId
            payable(_addr),
            payable(_addr),
            0,
            false
        );

        //Transfer NFT to the new Owner (= the customer)
        _transfer(msg.sender, _addr, _tokenId);

        emit EventTokenTransaction(
            _tokenId,
            address(this),
            _addr,
            address(this),
            _addr,
            0,
            "Send to customer"
        );

        //Emit the event for successful transfer. The frontend listen to this message
        emit EventTokenListedSuccess(_tokenId, _addr, _addr, 0, false);
    }

    /// @notice Get all the NFTs that the current user is owner or seller in
    /// @dev return an array of NFT
    /// @return all NFT where the current user is owner or seller
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        
        //we count NFT of the user to create an array of the good size => Gaz optimisation
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        //We store the Owner/seller NFT in an array
        ListedToken[] memory items = new ListedToken[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].owner == msg.sender ||
                idToListedToken[i + 1].seller == msg.sender
            ) {
                uint256 currentId = i + 1;

                ListedToken storage currentItem = idToListedToken[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    /// @notice Get all the NFTs associated with a brand
    /// @dev return an array of NFT
    /// @param _idBrand to get the NFT from
    /// @return all NFT associated with a brand
    function getNFTsByBrand(uint256 _idBrand)
        public
        view
        returns (ListedToken[] memory)
    {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        
        //we count NFT of the brand to create an array of the good size => Gaz optimisation
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].brandId == _idBrand &&
                idToListedToken[i + 1].currentlyListed
            ) {
                itemCount += 1;
            }
        }

        //We store the Brand NFT in an array
        ListedToken[] memory items = new ListedToken[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i + 1].brandId == _idBrand &&
                idToListedToken[i + 1].currentlyListed
            ) {
                uint256 currentId = i + 1;

                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @notice remove listed NFT from marketplace and transfer back to the owner
    ///  @param _idToken of the NFT to remove from marketplace
    function removeTokenFromMarket(uint256 _idToken) public {
        require(_exists(_idToken), "Invalid token ID");

        require(
            msg.sender == idToListedToken[_idToken].seller,
            "YOu need to be the seller of the NFT to sell it"
        );

        idToListedToken[_idToken].owner = payable(msg.sender);
        idToListedToken[_idToken].seller = payable(msg.sender);
        idToListedToken[_idToken].currentlyListed = false;
        _transfer(address(this), msg.sender, _idToken);

        emit EventTokenTransaction(
            _idToken,
            address(this),
            msg.sender,
            msg.sender,
            msg.sender,
            0,
            "Remove from marketplace"
        );

        //Emit the event for successful transfer. The frontend listen to this message
        emit EventTokenListedSuccess(
            _idToken,
            msg.sender,
            msg.sender,
            0,
            false
        );
    }

    /// @notice Buy an NFT on the marketplace
    /// @param _tokenId of the NFT to buy on the marketplace
    function executeSale(uint256 _tokenId) public payable {
        uint256 price = idToListedToken[_tokenId].price;
        address seller = idToListedToken[_tokenId].seller;

        require(
            msg.value == price,
            "You need to set the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[_tokenId].currentlyListed = false;
        idToListedToken[_tokenId].owner = payable(msg.sender);
        idToListedToken[_tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //transfer the NFT to the new owner
        _transfer(address(this), msg.sender, _tokenId);
        //approve the marketplace to sell NFTs for user
        approve(address(this), _tokenId); // a verif l'utilité
        //Transfer the listing fee to the marketplace
        payable(owner).transfer(listPrice);
        //Transfer the buying price to the seller of the NFT
        payable(seller).transfer(msg.value);

        emit EventTokenTransaction(
            _tokenId,
            address(this),
            msg.sender,
            seller,
            msg.sender,
            price,
            "Buy NFT"
        );
    }

    /// @notice List an NFT onthe marketplace at a given price
    /// @param _idToken of the NFT to sell on the marketplace
    /// @param _price of the NFT to sell on the marketplace
    /// TO DO manque l'envoi des fees
    function addTokenToSaleOnTheMarket(uint256 _idToken, uint256 _price)
        public
    {
        require(_exists(_idToken), "Invalid token ID");

        require(
            ownerOf(_idToken) == msg.sender,
            "You are not the owner of this token"
        );

        require(_price > 0, "Price must be greater than zero");

        idToListedToken[_idToken].price = _price;
        idToListedToken[_idToken].currentlyListed = true;
        idToListedToken[_idToken].seller = payable(msg.sender);
        idToListedToken[_idToken].owner = payable(address(this));
        _transfer(msg.sender, address(this), _idToken);

        emit EventTokenTransaction(
            _idToken,
            msg.sender,
            address(this),
            msg.sender,
            msg.sender,
            _price,
            "List on Marketplace"
        );

        emit EventTokenListedSuccess(
            _idToken,
            address(this),
            msg.sender,
            _price,
            true
        );
    }
}
