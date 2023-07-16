const LTYAccount = artifacts.require("./LTYAccount.sol");
//const LTYMarketplace = artifacts.require("./LTYMarketplace.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("LTYAccount", (accounts) => {
  const _owner = accounts[0];
  const _account1 = accounts[1];
  const _account2 = accounts[2];
  const _account3 = accounts[3];

  const _brandName = "Buterin";
  const _brandDescription = "Loyalty NFT of Buterin brand !";
  const _brandImage = "url d'une image";

  let LTYAccountInstance;

  //check the deployer of the smart contract is the owner
  describe("Smart contract initialization", function () {
    before(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });
    });

    it("check owner of the smart contract is the deployer", async function () {
      let theOwner = await LTYAccountInstance.owner();
      const addressDeployer = web3.utils.toChecksumAddress(_owner);
      const adressOwner = web3.utils.toChecksumAddress(theOwner);

      expect(addressDeployer).to.equal(adressOwner);
    });
  });

  //Check function createUserAccount()
  describe("Check function createUserAccount()", function () {
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });
    });

    context("createUserAccount() => Check require", function () {
      //check require : Brand already registrer
      //description : we registred a voter, and we try to registered this user again
      it("createUserAccount() => check already register", async () => {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );

        await expectRevert(
          LTYAccountInstance.createUserAccount(
            _brandName,
            _brandDescription,
            _brandImage,
            { from: _account1 }
          ),
          "You already have an account"
        );
      });
    });

    context("createUserAccount() => Check function", function () {
      beforeEach(async function () {
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );

        result = await LTYAccountInstance.getBrandFromId(1, {
          from: _account1,
        });
      });

      //description : we register a Brand, then we call this brand and check if is a brand is true
      it("createUserAccount() => check UserAccount storage isABrand ", async () => {
        expect(result.isABrand).to.be.true;
      });

      //description : we register a Brand, then we call this brand and check if it regstered on plateform is true
      it("createUserAccount() => check UserAccount storage isBrandRegisterOnPlatform ", async () => {
        expect(result.isBrandRegisterOnPlatform).to.be.true;
      });

      //description : we register a Brand, then we call this brand and check if it isAddressAlreadyCreatedAccount on plateform is true
      it("createUserAccount() => check UserAccount storage isAddressAlreadyCreatedAccount ", async () => {
        expect(result.isAddressAlreadyCreatedAccount).to.be.true;
      });

      //description : we register a Brand, then we call this brand and check if name is set
      it("createUserAccount() => check UserAccount storage name ", async () => {
        assert.equal(result.name, _brandName);
      });

      //description : we register a Brand, then we call this brand and check if description is set
      it("createUserAccount() => check UserAccount storage description ", async () => {
        assert.equal(result.description, _brandDescription);
      });

      //description : we register a Brand, then we call this brand and check if image is set
      it("createUserAccount() => check UserAccount storage brand ", async () => {
        assert.equal(result.image, _brandImage);
      });

      //description : we register a Brand, then we call this brand and check if image is set
      it("createUserAccount() => check UserAccount storage brandid ", async () => {
        assert.equal(result.brandId, 1);
      });

      //description : we register a Brand, then we call this brand and check if brandId is set
      it("createUserAccount() => check UserAccount storage brandId ", async () => {
        assert.equal(result.brandId, new BN(1));
      });
    });

    //check idToListedBrand[currentBrandId] = userAccounts[msg.sender];

    context("createUserAccount() => Check event", function () {
      //check well execution of createUserAccount
      //description : check event

      it("createUserAccount() => check event EventUserAccountCreated", async () => {
        const result = await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );

        expectEvent(result, "EventUserAccountCreated", {
          brandId: new BN(1),
          name: _brandName,
          description: _brandDescription,
          image: _brandImage,
        });
      });
    });
  });

  //Check function getIdBrandFromAddress()
  describe("Check function getIdBrandFromAddress()", function () {
    let brand;
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });

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

      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account3 }
      );
    });

    context("getIdBrandFromAddress() => Check function", function () {
      //check address null

      //check well execution of getIdBrandFromAddress
      it("getIdBrandFromAddress() => check get id", async () => {
        const brand1Id = await LTYAccountInstance.getIdBrandFromAddress(
          _account1
        );

        const brand2Id = await LTYAccountInstance.getIdBrandFromAddress(
          _account2
        );

        const brand3Id = await LTYAccountInstance.getIdBrandFromAddress(
          _account3
        );

        expect(brand1Id.toNumber()).to.equal(1);
        expect(brand2Id.toNumber()).to.equal(2);
        expect(brand3Id.toNumber()).to.equal(3);
      });
    });
  });

  //Check function getBrandFromId()
  describe("Check function getBrandFromId()", function () {
    let brand;
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });

      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );

      await LTYAccountInstance.createUserAccount(
        "brand2",
        "brand2 description",
        "brand2 image",
        { from: _account2 }
      );

      await LTYAccountInstance.createUserAccount(
        "brand3",
        "brand3 description",
        "brand3 image",
        { from: _account3 }
      );
    });

    context("getBrandFromId() => Check function", function () {
      //check address null

      //check well execution of getBrandFromId
      it("getBrandFromId() => check get id", async () => {
        const brand = await LTYAccountInstance.getBrandFromId(new BN(1), {
          from: _account1,
        });

        //assert.equal(_brandName,brand.brandName);
        expect(_brandName).to.equal(brand.name);
        expect(_brandDescription).to.equal(brand.description);
        expect(_brandImage).to.equal(brand.image);

        expect(1).to.equal(Number(brand.brandId));
      });
    });
  });

  //Check function setIsBrandRegisterOnPlatform()
  describe("Check function setIsBrandRegisterOnPlatform()", function () {
    let resultFunction;
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });

      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );

      resultFunction = await LTYAccountInstance.setIsBrandRegisterOnPlatform(
        _account1
      );
    });

    context("setIsBrandRegisterOnPlatform() => Check function", function () {
      //check well execution of setIsBrandRegisterOnPlatform
      it("setIsBrandRegisterOnPlatform() => check storage", async () => {
        const brand = await LTYAccountInstance.getBrandFromId(1);
        expect(brand.isBrandRegisterOnPlatform).to.be.true;
      });
    });

    context("setIsBrandRegisterOnPlatform() => Check event", function () {
      //check well execution of createUserAccount
      //description : check event
      it("setIsBrandRegisterOnPlatform() => check event EventBrandRegisterOnPlatform", async () => {
        expectEvent(resultFunction, "EventBrandRegisterOnPlatform", {
          _addr: _account1,
        });
      });
    });
  });

  //Check function setUserIsABrand()
  describe("Check function setUserIsABrand()", function () {
    let resultFunction;
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });

      await LTYAccountInstance.createUserAccount(
        _brandName,
        _brandDescription,
        _brandImage,
        { from: _account1 }
      );

      resultFunction = await LTYAccountInstance.setUserIsABrand(_account1);
    });

    context("setUserIsABrand() => Check function", function () {
      //check well execution of setUserIsABrand
      it("setUserIsABrand() => check storage", async () => {
        const brand = await LTYAccountInstance.getBrandFromId(1);
        expect(brand.isBrandRegisterOnPlatform).to.be.true;
      });
    });

    context("setUserIsABrand() => Check event", function () {
      //check well execution of createUserAccount
      //description : check event
      it("setUserIsABrand() => check event EventUserIsABrand", async () => {
        expectEvent(resultFunction, "EventUserIsABrand", {
          _addr: _account1,
        });
      });
    });
  });

  //Check function getAllBrands()
  describe("Check function getAllBrands()", function () {
    let LTYAccountInstance;
    beforeEach(async function () {
      LTYAccountInstance = await LTYAccount.new({ from: _owner });
    });

    context("getAllBrands() => Check function", function () {
      //check well execution of setUserIsABrand
      it("getAllBrands() => check storage", async () => {
        /*  LTYAccountInstance.idToListedBrand(1).isBrandRegisterOnPlatform = true;
        LTYAccountInstance.idToListedBrand(1).name = "Brand 1";

        LTYAccountInstance.idToListedBrand(2).isBrandRegisterOnPlatform = false;
        LTYAccountInstance.idToListedBrand(2).name = "Brand 2";

        LTYAccountInstance.idToListedBrand(3).isBrandRegisterOnPlatform = true;
        LTYAccountInstance.idToListedBrand(3).name = "Brand 3";
*/
        await LTYAccountInstance.createUserAccount(
          _brandName,
          _brandDescription,
          _brandImage,
          { from: _account1 }
        );

        await LTYAccountInstance.createUserAccount(
          "brand2",
          "brand2 description",
          "brand2 image",
          { from: _account2 }
        );

        await LTYAccountInstance.createUserAccount(
          "brand3",
          "brand3 description",
          "brand3 image",
          { from: _account3 }
        );

        const brands = await LTYAccountInstance.getAllBrands();
        expect(brands.length).to.equal(3);
        expect(brands[1].name).to.equal("Brand2");
        expect(brands[1].description).to.equal("brand2 description");
        expect(brands[1].image).to.equal("brand2 image");
        expect(brands[2].name).to.equal("Brand3");
        expect(brands[2].description).to.equal("brand3 description");
        expect(brands[2].image).to.equal("brand3 image");
      });
    });
  });
});
