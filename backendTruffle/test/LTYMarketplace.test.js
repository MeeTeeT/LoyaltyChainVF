const LTYMarketplace = artifacts.require("./LTYMarketplace.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const BigNumber = require("bignumber.js");

contract("LTYMarketplace", (accounts) => {
  const _owner = accounts[0];
  const _account1 = accounts[1];
  const _account2 = accounts[2];
  const _account3 = accounts[3];

  const _NFTName = "Buterin";
  const _NFTDescription = "Loyalty NFT of Buterin brand !";
  const _NFTImage = "url d'une image";
  const _NFTPrice = 1;

  let LTYMarketplaceInstance;

  //check the deployer of the smart contract is the owner
  describe("Smart contract initialization", function () {
    before(async function () {
      LTYMarketplaceInstance = await LTYMarketplace.new(_owner, {
        from: _owner,
      });
    });

    it("check owner of the smart contract is the deployer", async function () {
      let theOwner = await LTYMarketplaceInstance.owner();
      console.log("theOwner : ", theOwner);
      const addressDeployer = web3.utils.toChecksumAddress(_owner);
      const adressOwner = web3.utils.toChecksumAddress(theOwner);

      expect(addressDeployer).to.equal(adressOwner);
    });
  });

  //Check function updateListPrice()
  describe("Check function updateListPrice()", function () {
    beforeEach(async function () {
      LTYMarketplaceInstance = await LTYMarketplace.new(_owner, {
        from: _owner,
      });
    });

    //TODO check require

    //check function
    context("updateListPrice() => Check function", function () {
      it("updateListPrice() => check listPrice storage ", async () => {
        const result = await LTYMarketplaceInstance.listPrice();
        const initialListingPrice = 0.01; //0.01 eth
        const newListingPrice = 2000000000;

        //check initial value of listing price
        expect(
          Number(web3.utils.toWei(initialListingPrice.toString(), "ether"))
        ).to.equal(BigNumber(result).toNumber());

        //modify listing price value
        await LTYMarketplaceInstance.updateListPrice(newListingPrice, {
          from: _owner,
        });
        const resultNew = await LTYMarketplaceInstance.listPrice();

        //check new listing price value
        expect(Number(newListingPrice.toString())).to.equal(
          BigNumber(resultNew).toNumber()
        );
      });
    });

    //check event
    context("updateListPrice() => Check event", function () {
      const newListingPrice = 2000000000;
      //check well execution of updateListPrice
      //description : check event
      it("updateListPrice() => check event EventUpdateListPrice", async () => {
        const result = await LTYMarketplaceInstance.updateListPrice(
          newListingPrice,
          { from: _owner }
        );

        expectEvent(result, "EventUpdateListPrice", {
          price: new BN(newListingPrice),
        });
      });
    });
  });

  //Check function getListPrice()
  describe("Check function getListPrice()", function () {
    beforeEach(async function () {
      LTYMarketplaceInstance = await LTYMarketplace.new(_owner, {
        from: _owner,
      });
    });

    context("updateListPrice() => Check function", function () {
      it("getListPrice() => check listPrice storage getter", async () => {
        const result = await LTYMarketplaceInstance.listPrice();
        const initialListingPrice = 0.01; //0.01 eth

        //check initial value of listing price
        expect(
          Number(web3.utils.toWei(initialListingPrice.toString(), "ether"))
        ).to.equal(BigNumber(result).toNumber());
      });
    });
  });

  //Check function createListedToken()
  describe("Check function createListedToken()", function () {
    beforeEach(async function () {
      LTYMarketplaceInstance = await LTYMarketplace.new(_owner, {
        from: _owner,
      });
    });

    /*
    context("createListedToken() => Check require", function () {
      //check require : Brand is authorized to mint
      // try to execute function without having created an account before
      it("createListedToken() => check register", async () => {
        await expectRevert(LTYMarketplaceInstance.createListedToken(1, 20, {
          from: _account1,
        }), "You need to be a registred brand to mint NFT");
       
      });

       //check listing value price
       it("createListedToken() => check register", async () => {
        //creer le compte Enseigne
        await expectRevert(LTYMarketplaceInstance.createListedToken(1, 100000, {
          from: _account1, value: new BN(100000000000000000)
        }), "Price need to be positive");
       
      });

      //check price >= 0
      it("createListedToken() => check register", async () => {
        //creer le compte Enseigne
        await expectRevert(LTYMarketplaceInstance.createListedToken(1, -10, {
          from: _account1,
        }), "Price need to be positive");
       
      });
    });
    */

    context("createListedToken() => Check function", function () {
      console.log("--*****--");
      const tokenId = 1;
      const price = 100;

      beforeEach(async function () {
        //create Account

        await LTYMarketplaceInstance.createListedToken(tokenId, price, {
          from: _account1,
          value: new BN(100000000000000000),
        });

        console.log(
          "----storage id : ",
          LTYMarketplaceInstance.idToListedToken[1].tokenId
        );
      });

      /*
      it("createListedToken() => check storage in idToListedToken mapping", async () => {
        console.log("----", LTYMarketplaceInstance.idToListedToken[1].tokenId);
        //check token id storage
        
        expect(LTYMarketplaceInstance.idToListedToken[1].tokenId).to.equal(
          BN(1)
        );
       
        //check brandId
        expect(LTYMarketplaceInstance.idToListedToken[1].brandId).to.equal(
          BN(1)
        );

        //check owner = contract address (marketplace)
        //TO DO recuperer l'address du smart contract
        expect(LTYMarketplaceInstance.idToListedToken[1].owner).to.equal(
          LTYMarketplaceInstance.address
        );

        //check seller =  msg.sender
        expect(LTYMarketplaceInstance.idToListedToken[1].seller).to.equal(
          msg.sender
        );
        //check price
        expect(LTYMarketplaceInstance.idToListedToken[1].price).to.equal(
          new BN(1000000000000000000)
        );
        //check bool currentlyListed
        expect(LTYMarketplaceInstance.idToListedToken[1].currentlyListed).to.be
          .true;
          
      });
*/
    });

    context("createListedToken() => Check event", function () {
      beforeEach(async function () {
        //create account
        LTYMarketplaceInstance = await LTYMarketplace.createListedToken(
          new BN(1),
          new BN(1000000000000000000),
          {
            from: _account1,
          }
        );
      });

      //check well execution of updateListPrice
      //description : check event EventTokenTransaction
      it("createListedToken() => check event EventTokenTransaction", async () => {
        expectEvent(result, "EventTokenTransaction", {
          price: new BN(newListingPrice),
        });
      });

      //check well execution of updateListPrice
      //description : check event EventTokenListedSuccess
      it("createListedToken() => check event EventTokenListedSuccess", async () => {
        expectEvent(result, "EventTokenListedSuccess", {
          price: new BN(newListingPrice),
        });
      });
    });
  });

  //check getListedTokenForId

  //check getCurrentToken

  //check createTokenToMarketplace

  //check createTokenToAddress

  //check createListedTokenAndSendToAddress

  //checkgetMyNFTs

  //check getNFTsByBrand

  //check removeTokenFromMarket

  //check executeSale

  //addTokenToSaleOnTheMarket
});
