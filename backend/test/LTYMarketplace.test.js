const LTYMarketplace = artifacts.require("./LTYMarketplace.sol");
const LTYAccount = artifacts.require("./LTYAccount.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
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
            new BN(20000000),
            {
              from: _account8,
            }
          ),
          "You need to be a registred brand to mint NFT"
        );
      });
*/
      //check listing value price

      it("createListedToken() => check listing price", async () => {
        //creer le compte Enseigne
        /*
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );

        await truffleAssert.reverts(
          LTYMarketplaceInstance.createListedToken(new BN(1), new BN(-10), {
            from: _account1,
            value: new BN("1000000000000"),
          }),
          "Price need to be positive"
        );
*/
        /*
        await expectRevert(
          LTYMarketplaceInstance.createListedToken(1, new BN(-10), {
            from: _account1,
            value: new BN("1000000000000"),
          }),
          "Price need to be positive"
        );
        */
      });
    });

    context("createListedToken() => Check function", function () {
      console.log("--*****--");
      const tokenId = 1;
      const price = new BN(100);

      /*
      beforeEach(async function () {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );

        await LTYMarketplaceInstance.createListedToken(tokenId, price, {
          from: _account1,
          value: new BN(10000000000000),
        });

        
        console.log(
          "----storage id : ",
          LTYMarketplaceInstance.idToListedToken(1).tokenId
        );

      });
*/
      it("createListedToken() => check storage in idToListedToken mapping", async () => {
        // console.log("----", LTYMarketplaceInstance.idToListedToken(1).tokenId);
        //check token id storage
        /*
        expect(LTYMarketplaceInstance.idToListedToken(1).tokenId).to.equal(
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
          */
      });
    });

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
  describe("Check function getListedTokenForId()", function () {
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
      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );
    });

    //check require
    context("createTokenToMarketplace() => Check function", function () {
      it("createTokenToMarketplace() => check storage", async () => {
        const resultCreateToken =
          await LTYMarketplaceInstance.createTokenToMarketplace(
            "http://test.fr",
            new BN(10000000000000),
            {
              from: _account1,
            }
          );
        const result = await LTYMarketplaceInstance.getListedTokenForId(
          new BN(1)
        );

        // Vérifier si les détails du ListedToken correspondent à ceux attendus
        expect(result.tokenId).equal(new BN(1));
        expect(result.owner).equal(LTYMarketplaceInstance.address);
        expect(result.seller).equal(_account1);
        expect(result.price).equal(new BN(10000000000000));
        expect(result.currentlyListed).equal(true);
      });
    });
  });

  //check getCurrentToken
  describe("Check function getCurrentToken()", function () {
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
      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );
      const result = await LTYMarketplaceInstance.createTokenToMarketplace(
        "http://test.fr",
        new BN(10000000000000),
        {
          from: _account1,
        }
      );
    });

    //check require
    context("createTokenToMarketplace() => Check function", function () {
      it("createTokenToMarketplace() => check storage", async () => {
        const result = await LTYMarketplaceInstance.getCurrentToken();
        expect(result).equal(new BN(1));
      });
    });
  });

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

        // try {
        const result = await LTYMarketplaceInstance.createTokenToMarketplace(
          "http://test.fr",
          new BN(10000000000000),
          {
            from: _account2,
          }
        );

        expectEvent(result, "EventTokenTransaction", {
          tokenId: new BN(1),
          ownerFrom: _account2,
          ownerTo: _account2,
          sellerFrom: _account2,
          sellerTo: _account2,
          price: new BN(0),
          transactionType: "mint",
        });
      });

      it("createTokenToMarketplace() => check createListedToken event EventTokenTransaction", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account2 }
        );

        // try {
        const result = await LTYMarketplaceInstance.createTokenToMarketplace(
          "http://test.fr",
          new BN(10000000000000),
          {
            from: _account2,
          }
        );

        expectEvent(result, "EventTokenTransaction", {
          tokenId: new BN(1),
          ownerFrom: LTYMarketplaceInstance.address,
          ownerTo: LTYMarketplaceInstance.address,
          sellerFrom: _account2,
          sellerTo: _account2,
          price: new BN(10000000000000),
          transactionType: "Send to marketplace",
        });
      });

      it("createTokenToMarketplace() => check createListedToken event EventTokenListedSuccess", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account2 }
        );

        // try {
        const result = await LTYMarketplaceInstance.createTokenToMarketplace(
          "http://test.fr",
          new BN(10000000000000),
          {
            from: _account2,
          }
        );

        expectEvent(result, "EventTokenListedSuccess", {
          tokenId: new BN(1),
          owner: LTYMarketplaceInstance.address,
          seller: _account2,

          price: new BN(10000000000000),
          currentlyListed: true,
        });
      });
    });
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

      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
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
    context("createTokenToAddress() => Check storage", function () {
      it("createTokenToMarketplace() => check createListedTokenAndSendToAddress() storage", async function () {
        await LTYMarketplaceInstance.createTokenToAddress(URI, _account2, {
          from: _account1,
        });

        let currentlyListed = (
          await LTYMarketplaceInstance.idToListedToken(new BN(1))
        ).currentlyListed;
        expect(currentlyListed).to.be.false;

        let brand = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .brandId;
        expect(brand).to.equal(new BN(1));

        let owner = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .owner;
        expect(_account2).to.equal(owner);

        let seller = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .seller;
        expect(_account2).to.equal(seller);
        let price = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .price;
        expect(new BN(0)).to.equal(price);
      });
    });

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

        expectEvent(result, "EventTokenTransaction", {
          tokenId: new BN(1),
          ownerFrom: _account2,
          ownerTo: _account2,
          sellerFrom: _account2,
          sellerTo: _account2,
          price: new BN(0),
          transactionType: "mint",
        });
      });

      it("createTokenToAddress() => check createListedTokenAndSendToAddress() EventTokenTransaction", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account3 }
        );

        const result = await LTYMarketplaceInstance.createTokenToAddress(
          URI,
          _account3,
          {
            from: _account3,
          }
        );

        expectEvent(result, "EventTokenTransaction", {
          tokenId: new BN(1),
          ownerFrom: LTYMarketplaceInstance.address,
          ownerTo: _account3,
          sellerFrom: LTYMarketplaceInstance.address,
          sellerTo: _account3,
          price: new BN(0),
          transactionType: "Send to customer",
        });
      });

      it("createTokenToAddress() => check createListedTokenAndSendToAddress() EventTokenListedSuccess", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account3 }
        );

        const result = await LTYMarketplaceInstance.createTokenToAddress(
          URI,
          _account3,
          {
            from: _account3,
          }
        );

        expectEvent(result, "EventTokenListedSuccess", {
          tokenId: new BN(1),
          owner: _account3,
          seller: _account3,
          price: new BN(0),
          currentlyListed: false,
        });
      });
    });
  });

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
      it("getMyNFTs() => Check length and storage", async () => {
        // Créer quelques NFTs pour les tests
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );
        await LTYMarketplaceInstance.createTokenToMarketplace(
          "http://test.fr",
          new BN(10000000000000),
          {
            from: _account1,
          }
        );
        await LTYMarketplaceInstance.createTokenToMarketplace(
          "http://test.fr",
          new BN(10000000000000),
          {
            from: _account1,
          }
        );
        await LTYMarketplaceInstance.createTokenToMarketplace(
          "http://test.fr",
          new BN(10000000000000),
          {
            from: _account1,
          }
        );

        const brandNFTs = await LTYMarketplaceInstance.getNFTsByBrand(
          new BN(1)
        );

        expect(brandNFTs.length).equal(3);
        expect(Number(brandNFTs[0].brandId)).equal(1);
        expect(Number(brandNFTs[1].brandId)).equal(1);
      });

      it("should return an empty array if no NFTs are listed by the specified brand", async () => {
        const brandNFTs = await LTYMarketplaceInstance.getNFTsByBrand(4);

        expect(brandNFTs.length).equal(0);
      });
    });
  });

  //check removeTokenFromMarket
  describe("Check function removeTokenFromMarket()", function () {
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
      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );
      // let tokenId = 1;
      await LTYMarketplaceInstance.createTokenToMarketplace(
        "http://test.fr",
        new BN(10000000000000),
        {
          from: _account1,
        }
      );
    });
    context("removeTokenFromMarket() => Check require", function () {
      it("createTokenToMarketplace() => check idToken exists", async () => {
        await expectRevert(
          LTYMarketplaceInstance.removeTokenFromMarket(new BN(2), {
            from: _account1,
          }),
          "Invalid token ID"
        );
      });

      it("createTokenToMarketplace() => check the remover it the seller", async () => {
        await expectRevert(
          LTYMarketplaceInstance.removeTokenFromMarket(new BN(1), {
            from: _account8,
          }),
          "YOu need to be the seller of the NFT to sell it"
        );
      });
    });

    context("removeTokenFromMarket() => Check function", function () {
      it("createTokenToMarketplace() => check storage", async function () {
        await LTYMarketplaceInstance.removeTokenFromMarket(new BN(1), {
          from: _account1,
        });

        let currentlyListed = (
          await LTYMarketplaceInstance.idToListedToken(new BN(1))
        ).currentlyListed;
        expect(currentlyListed).to.be.false;

        let owner = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .owner;
        expect(_account1).to.equal(owner);

        let seller = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .seller;
        expect(_account1).to.equal(seller);
      });

      context("removeTokenFromMarket() => Check event", function () {
        it("createTokenToMarketplace() => check event EventTokenTransaction", async function () {
          let result = await LTYMarketplaceInstance.removeTokenFromMarket(
            new BN(1),
            {
              from: _account1,
            }
          );

          expectEvent(result, "EventTokenTransaction", {
            tokenId: new BN(1),
            ownerFrom: LTYMarketplaceInstance.address,
            ownerTo: _account1,
            sellerFrom: _account1,
            sellerTo: _account1,
            price: new BN(0),
            transactionType: "Remove from marketplace",
          });
        });
      });
      it("createTokenToMarketplace() => check event EventTokenListedSuccess", async function () {
        let result = await LTYMarketplaceInstance.removeTokenFromMarket(
          new BN(1),
          {
            from: _account1,
          }
        );

        expectEvent(result, "EventTokenListedSuccess", {
          tokenId: new BN(1),
          owner: _account1,
          seller: _account1,
          price: new BN(0),
          currentlyListed: false,
        });
      });
    });
  });

  //check executeSale
  describe("Check function executeSale()", function () {
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
      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );

      // let tokenId = 1;
      await LTYMarketplaceInstance.createTokenToMarketplace(
        "http://test.fr",
        new BN("10000000000000"),
        {
          from: _account1,
        }
      );
    });
    context("executeSale() => Check require", function () {
      it("executeSale() => check price", async () => {
        //  try {

        await expectRevert(
          LTYMarketplaceInstance.executeSale(new BN(1), {
            from: _account1,
            value: new BN("10000000000"),
          }),
          "You need to set the asking price in order to purchase"
        );
        //  } catch (e) {
        //    console.log(e);
        //  }
      });
    });

    context("executeSale() => Check function", function () {
      it("executeSale() => check storage", async function () {
        await LTYMarketplaceInstance.executeSale(new BN(1), {
          from: _account3,
          value: new BN("10000000000000"),
        });

        let currentlyListed = (
          await LTYMarketplaceInstance.idToListedToken(new BN(1))
        ).currentlyListed;
        expect(currentlyListed).to.be.false;

        let owner = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .owner;
        expect(_account3).to.equal(owner);

        let seller = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .seller;
        expect(_account3).to.equal(seller);
      });
    });

    context("executeSale() => Check event", function () {
      it("executeSale() => check event EventTokenTransaction", async function () {
        let result = await LTYMarketplaceInstance.executeSale(new BN(1), {
          from: _account2,
          value: new BN("10000000000000"),
        });

        expectEvent(result, "EventTokenTransaction", {
          tokenId: new BN(1),
          ownerFrom: LTYMarketplaceInstance.address,
          ownerTo: _account2,
          sellerFrom: _account1,
          sellerTo: _account2,
          price: new BN("10000000000000", 10),
          transactionType: "Buy NFT",
        });
      });
    });
  });

  //addTokenToSaleOnTheMarket
  describe("Check function addTokenToSaleOnTheMarket()", function () {
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
      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );
      // let tokenId = 1;
      await LTYMarketplaceInstance.createTokenToMarketplace(
        "http://test.fr",
        new BN(10000000000000),
        {
          from: _account1,
        }
      );
      await LTYMarketplaceInstance.removeTokenFromMarket(new BN(1), {
        from: _account1,
      });
    });

    context("addTokenToSaleOnTheMarket() => Check require", function () {
      it("addTokenToSaleOnTheMarket() => check idToken exists", async () => {
        await expectRevert(
          LTYMarketplaceInstance.addTokenToSaleOnTheMarket(
            new BN(2),
            new BN(1000000),
            {
              from: _account1,
            }
          ),
          "Invalid token ID"
        );
      });

      it("addTokenToSaleOnTheMarket() => check the seller it the owner", async () => {
        await expectRevert(
          LTYMarketplaceInstance.addTokenToSaleOnTheMarket(
            new BN(1),
            new BN(100000000000000),
            {
              from: _account8,
            }
          ),
          "You are not the owner of this token"
        );
      });

      it("addTokenToSaleOnTheMarket() => check price > 0", async () => {
        await expectRevert(
          LTYMarketplaceInstance.addTokenToSaleOnTheMarket(
            new BN(1),
            new BN(0),
            {
              from: _account1,
            }
          ),
          "Price must be greater than zero"
        );
      });
    });

    context("addTokenToSaleOnTheMarket() => Check function", function () {
      it("addTokenToSaleOnTheMarket() => check storage", async function () {
        await LTYMarketplaceInstance.addTokenToSaleOnTheMarket(
          new BN(1),
          new BN(10000000000),
          {
            from: _account1,
          }
        );

        let price = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .price;
        expect(price).to.equal(new BN(10000000000));

        let currentlyListed = (
          await LTYMarketplaceInstance.idToListedToken(new BN(1))
        ).currentlyListed;
        expect(currentlyListed).to.be.true;

        let owner = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .owner;
        expect(owner).to.equal(LTYMarketplaceInstance.address);

        let seller = (await LTYMarketplaceInstance.idToListedToken(new BN(1)))
          .seller;
        expect(_account1).to.equal(seller);
      });

      context("addTokenToSaleOnTheMarket() => Check event", function () {
        it("addTokenToSaleOnTheMarket() => check event EventTokenTransaction", async function () {
          let result = await LTYMarketplaceInstance.addTokenToSaleOnTheMarket(
            new BN(1),
            new BN(10000000000),
            {
              from: _account1,
            }
          );

          expectEvent(result, "EventTokenTransaction", {
            tokenId: new BN(1),
            ownerFrom: _account1,
            ownerTo: LTYMarketplaceInstance.address,
            sellerFrom: _account1,
            sellerTo: _account1,
            price: new BN(10000000000),
            transactionType: "List on Marketplace",
          });
        });
      });
      it("addTokenToSaleOnTheMarket() => check event EventTokenListedSuccess", async function () {
        let result = await LTYMarketplaceInstance.addTokenToSaleOnTheMarket(
          new BN(1),
          new BN(10000000000),
          {
            from: _account1,
          }
        );

        expectEvent(result, "EventTokenListedSuccess", {
          tokenId: new BN(1),
          owner: LTYMarketplaceInstance.address,
          seller: _account1,
          price: new BN(10000000000),
          currentlyListed: true,
        });
      });
    });
  });
});
