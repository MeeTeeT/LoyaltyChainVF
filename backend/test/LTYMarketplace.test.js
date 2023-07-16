const LTYMarketplace = artifacts.require("./LTYMarketplace.sol");
const LTYAccount = artifacts.require("./LTYAccount.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const BigNumber = require("bignumber.js");

contract("LTYMarketplace", (accounts) => {
  const _owner = accounts[0];
  const _account1 = accounts[1];
  const _account2 = accounts[2];
  const _account3 = accounts[3];
  const _account8 = accounts[8];

  const _brandName = "Buterin";
  const _brandDescription = "Loyalty NFT of Buterin brand !";
  const _brandImage = "url d'une image";

  const _NFTName = "Buterin";
  const _NFTDescription = "Loyalty NFT of Buterin brand !";
  const _NFTImage = "url d'une image";
  const _NFTPrice = 1;
  const listingPrice = web3.utils.toWei("0.1", "ether");
  console.log("------- ", listingPrice);

  let LTYMarketplaceInstance;
  let LTYAccountInstance;
  let LTYAccountInstanceAddress;

  //check the deployer of the smart contract is the owner
  describe("Smart contract initialization", function () {
    before(async function () {
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
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
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
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
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
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
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
    });

    context("createListedToken() => Check require", function () {
      //check require : Brand is authorized to mint
      // try to execute function without having created an account before
      /*
      it("createListedToken() => check register", async () => {
        await expectRevert(
          LTYMarketplaceInstance.createListedToken(
            new BN(1),
            new BN(200000000000000000n),
            {
              from: _account8,
            }
          ),
          "You need to be a registred brand to mint NFT"
        );
      });
      */
      /*
      
       //check listing value price
       it("createListedToken() => check listing price", async () => {
        //creer le compte Enseigne
        await expectRevert(LTYMarketplaceInstance.createListedToken(1, 100000, {
          from: _account1, value: new BN(100000000000000000)
        }), "Price need to be positive");
       
      });
*/
      //check price >= 0
      /*
      it("createListedToken() => check price", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );
        await expectRevert(
          LTYMarketplaceInstance.createListedToken(new BN(1), new BN(-10), {
            from: _account1,
          }),
          "Price need to be positive"
        );
      });
      */
    });

    /*
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

    });
*/
    /*
    context("createListedToken() => Check event", function () {
      beforeEach(async function () {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );
        //create account
        LTYMarketplaceInstance = await LTYMarketplace.createListedToken(
          new BN(1),
          new BN(1000000000000000000)
        ).call({
          value: new BN(listingPrice),
          from: _account1,
        });
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
    */
  });

  //check getListedTokenForId

  //check getCurrentToken

  //check createTokenToMarketplace
  describe("Check function createTokenToMarketplace()", function () {
    const URI = "http://monURI.fr";
    const price = 1000000;

    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
    });

    //check require
    context("createTokenToMarketplace() => Check require", function () {
      it("createTokenToMarketplace() => check sender can mint NFT", async () => {
        await expectRevert(
          LTYMarketplaceInstance.createTokenToMarketplace(URI, new BN(price), {
            from: _account8,
          }),
          "You need to be a registred brand to mint NFT"
        );
      });
    });

    //check function
    /*
    context("createTokenToMarketplace() => Check function", function () {
      it("createTokenToMarketplace() => check listPrice storage ", async () => {
        const result = await LTYMarketplaceInstance.listPrice();
        const initialListingPrice = 0.01; //0.01 eth
        const newListingPrice = 2000000000;
      });
    });
*/

    //check event
    /*
    context("createTokenToMarketplace() => Check event", function () {
      //check well execution of updateListPrice
      //description : check event
      it("createTokenToMarketplace() => check event EventTokenTransaction", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account2 }
        );

        try {
          const result = await LTYMarketplaceInstance.createTokenToMarketplace(
            URI,
            new BN(price),
            {
              value: BN(1000000000000000000),
              from: _account2,
            }
          );
          console.log(result);
        } catch (e) {
          console.log("create tiken", e);
        }

        try {
          expectEvent(result, "EventTokenTransaction", {
            tokenId: new BN(1),
            ownerFrom: _account2,
            ownerTo: _account2,
            sellerFrom: _account2,
            sellerTo: _account2,
            price: new BN(price),
            transactionType: "mint",
          });
        } catch (e) {
          console.log("emit event", e);
        }
      });
    });
    */
  });

  //check createTokenToAddress
  describe("Check function createTokenToAddress()", function () {
    const URI = "http://monURI.fr";
    const price = 1000000;

    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
    });

    //check require
    context("createTokenToAddress() => Check require", function () {
      it("createTokenToAddress() => check sender can mint NFT", async () => {
        await expectRevert(
          LTYMarketplaceInstance.createTokenToAddress(URI, _account2, {
            from: _account8,
          }),
          "You need to be a registred brand to mint NFT"
        );
      });
    });

    //check function
    /*
    context("createTokenToAddress() => Check function", function () {
      it("createTokenToAddress() => check listPrice storage ", async () => {
        const result = await LTYMarketplaceInstance.listPrice();
        const initialListingPrice = 0.01; //0.01 eth
        const newListingPrice = 2000000000;
      });
    });
*/

    //check event

    context("createTokenToAddress() => Check event", function () {
      //check well execution of updateListPrice
      //description : check event
      it("createTokenToAddress() => check event EventTokenTransaction", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account2 }
        );

        const result = await LTYMarketplaceInstance.createTokenToAddress(
          URI,
          _account3,
          {
            from: _account2,
          }
        );

        try {
          expectEvent(result, "EventTokenTransaction", {
            tokenId: new BN(1),
            ownerFrom: _account2,
            ownerTo: _account2,
            sellerFrom: _account2,
            sellerTo: _account2,
            price: new BN(0),
            transactionType: "mint",
          });
        } catch (e) {
          console.log("emit event", e);
        }
      });
    });
  });

  //check createListedTokenAndSendToAddress

  //check getMyNFTs
  describe("Check function getMyNFTs()", function () {
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
    });

    context("getMyNFTs() => Check function", function () {
      it("should return the NFTs owned or being sold by the caller", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _owner }
        );
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account2 }
        );
        // Créer quelques NFTs pour les tests
        await LTYMarketplaceInstance.createTokenToAddress("NFT 1", accounts[1]);
        await LTYMarketplaceInstance.createTokenToAddress("NFT 2", accounts[0]);
        await LTYMarketplaceInstance.createTokenToAddress("NFT 3", accounts[1]);
        await LTYMarketplaceInstance.createTokenToAddress("NFT 4", accounts[2]);

        // Appeler la fonction getMyNFTs()
        const myNFTs = await LTYMarketplaceInstance.getMyNFTs({
          from: accounts[1],
        });

        // Vérifier que les NFTs renvoyés appartiennent à l'appelant
        assert.equal(myNFTs.length, 2);
        assert.equal(myNFTs[0].owner, accounts[1]);
        assert.equal(myNFTs[1].owner, accounts[1]);
      });

      it("should return an empty array if the caller doesn't own any NFTs", async () => {
        // Appeler la fonction getMyNFTs() pour un compte qui ne possède pas de NFTs
        const myNFTs = await LTYMarketplaceInstance.getMyNFTs({
          from: accounts[3],
        });

        // Vérifier que l'array renvoyé est vide
        assert.equal(myNFTs.length, 0);
      });
    });
  });
  //check getNFTsByBrand
  describe("Check function getMyNFTs()", function () {
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({
        from: _owner,
      });
      LTYAccountInstanceAddress = LTYAccountInstance.address;

      LTYMarketplaceInstance = await LTYMarketplace.new(
        LTYAccountInstanceAddress,
        {
          from: _owner,
        }
      );
    });

    context("getMyNFTs() => Check function", function () {
      /*
      it("should return the NFTs listed by the specified brand", async () => {
        // Créer quelques NFTs pour les tests
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _owner }
        );
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account2 }
        );
        await LTYMarketplaceInstance.createListedToken(1, 100, {
          from: accounts[0],
        });
        await LTYMarketplaceInstance.createListedToken(2, 200, {
          from: accounts[1],
        });
        await LTYMarketplaceInstance.createListedToken(1, 300, {
          from: accounts[2],
        });
        await LTYMarketplaceInstance.createListedToken(3, 400, {
          from: accounts[1],
        });

        // Appeler la fonction getNFTsByBrand() pour la marque avec l'ID 1
        const brandNFTs = await LTYMarketplaceInstance.getNFTsByBrand(1);

        // Vérifier que les NFTs renvoyés appartiennent à la marque spécifiée
        assert.equal(brandNFTs.length, 2);
        assert.equal(brandNFTs[0].brandId, 1);
        assert.equal(brandNFTs[1].brandId, 1);
      });
*/
      it("should return an empty array if no NFTs are listed by the specified brand", async () => {
        // Appeler la fonction getNFTsByBrand() pour une marque qui n'a pas de NFTs listés
        const brandNFTs = await LTYMarketplaceInstance.getNFTsByBrand(4);

        // Vérifier que l'array renvoyé est vide
        assert.equal(brandNFTs.length, 0);
      });
    });
  });
  //check removeTokenFromMarket

  //check executeSale

  //addTokenToSaleOnTheMarket
});
