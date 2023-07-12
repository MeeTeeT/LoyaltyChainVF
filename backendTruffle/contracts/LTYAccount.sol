//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
 
contract LTYAccount is Ownable{

    using Counters for Counters.Counter;

    //_Brandids variable has the most recent minted tokenId
    Counters.Counter private _brandsIds;

    struct UserAccount {
        uint brandId;
        string name;
        string description;
        string image;
        bool isABrand; // set if account is a Brand (or a Client)
        bool isBrandRegisterOnPlatform; //allow account to mint NFT
        bool isAddressAlreadyCreatedAccount;
    }

    //the event emitted when a brand is successfully created
    event EventUserAccountCreated (
        uint brandId,
        string name,
        string description,
        string image
    );

    //the event emitted when a brand is registered
    event EventBrandRegisterOnPlatform (address _addr);

    //the event emitted when an address is identify as a brand
    event EventUserIsABrand(address _addr);

    //mapping to store all brands
    mapping(uint256 => UserAccount) private idToListedBrand;

    //Mapping of brand
    mapping(address => UserAccount) public userAccounts;

    /// @notice Create Brand account
    /// @dev add more data in future (brand's category, SIREN, ...)
    /// @param _name of the brand
    /// @param _description of the brand
    /// @param _image (logo) of the brand
    function createUserAccount(

        string memory _name,
        string memory _description,
        string memory _image
    ) public {
        require(!userAccounts[msg.sender].isAddressAlreadyCreatedAccount, "You already have an account");
        userAccounts[msg.sender].name = _name;
        userAccounts[msg.sender].description = _description;
        userAccounts[msg.sender].image = _image;
        userAccounts[msg.sender].isAddressAlreadyCreatedAccount = true;

        //PMV : We registered brand as default
        //Final version : Add admin frontend screen to use this function
        setUserIsABrand(msg.sender);
        //userAccounts[msg.sender].isABrand = true;

        //PMV : We registered brand as default
        //Final version : Add admin frontend screen to use this function
        // userAccounts[msg.sender].isBrandRegisterOnPlatform = true;
        setIsBrandRegisterOnPlatform(msg.sender);

        //Increment the brandId counter, which is keeping track of the number of brand registered
        _brandsIds.increment();
        uint256 currentBrandId = _brandsIds.current();
        userAccounts[msg.sender].brandId = currentBrandId;
        idToListedBrand[currentBrandId] = userAccounts[msg.sender];

        emit EventUserAccountCreated(
            currentBrandId,    
            _name,
            _description,
            _image
        );
    }

 
    /// @notice Set brand account as registered => Functionnaly, it allows account to mint NFT
    /// @param _addr Address to registered
    ///TO DO  a mettre Ownable
    function setIsBrandRegisterOnPlatform(address _addr) public{
        userAccounts[_addr].isBrandRegisterOnPlatform = true;  
        emit EventBrandRegisterOnPlatform(_addr);
    }

    /// @notice Set account as a brand account
    /// @param _addr Address to registered as a brand
    ///TO DO  a mettre Ownable
    function setUserIsABrand(address _addr) public{
        userAccounts[_addr].isABrand = true;
        emit EventUserIsABrand(_addr);
    }

    /// @notice Get id Brand from address
    /// @param _addr address of the future Owner
    function getIdBrandFromAddress(address _addr) public view returns (uint _id){ return userAccounts[_addr].brandId; }
    
    /// @notice Get Brand from Id
    /// @param _idBrand if of tha brand
    /// @return Brand Details
    function getBrandFromId(uint _idBrand) public view returns (UserAccount memory){ return idToListedBrand[_idBrand]; }

    /// @notice Get all brands registered on the marketplace
    /// @dev return an array of brand
    /// @return all brands
    function getAllBrands() public view returns (UserAccount[] memory) {
        uint brandsCount = _brandsIds.current();
        UserAccount[] memory brands = new UserAccount[](brandsCount);
        uint currentIndex = 0;

        for(uint i=0;i<brandsCount;i++)
        {
            uint currentId = i + 1;
            UserAccount storage currentItem = idToListedBrand[currentId];
            if(currentItem.isBrandRegisterOnPlatform){ // we get only registered brand in plateform
                brands[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        //the array 'brands' has the list of all brands in the marketplace
        return brands;
    }

}