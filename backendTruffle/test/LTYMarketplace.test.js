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

  //Check function createUserAccount()
  describe("Check function updateListPrice()", function () {
    beforeEach(async function () {
      LTYMarketplaceInstance = await LTYMarketplace.new(_owner, {
        from: _owner,
      });
    });

    /*
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

    */
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

    /*
    context("updateListPrice() => Check event", function () {
      //check well execution of updateListPrice
      //description : check event
      it("createUserAccount() => check event xxxx", async () => {
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
    */
  });
  /*
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

  /*

  // console.log("***********************************");
  // console.log("Check startProposalsRegistering function ");
   
describe("Check function startProposalsRegistering()", function() {

    beforeEach(async function(){
      MyVotingInstance = await Voting.new({ from: _owner });
    });

    //check require : Check caller is the owner
    it("startProposalsRegistering() => check require owner", async () => {
      await expectRevert(MyVotingInstance.startProposalsRegistering({from: _voter1}), "Ownable: caller is not the owner");
    });

    //check require : checker workflowStatus
    //description : we set the sessions status to a bad status and we check the startProposalsRegistering() function
    it("startProposalsRegistering() => check require workflowStatus ", async () => {
      await MyVotingInstance.startProposalsRegistering({from: _owner}); 
      await MyVotingInstance.endProposalsRegistering({from: _owner}); //we set the session status to an ineligible status
      await expectRevert(MyVotingInstance.startProposalsRegistering({from: _owner}), "Registering proposals cant be started now");
    });

    //check genesis block
    it("startProposalsRegistering() => check genesis block ", async () => {
      await MyVotingInstance.addVoter(_voter1, { from: _owner });
      await MyVotingInstance.startProposalsRegistering({from: _owner}); 
      let DescriptionGenesis = (await MyVotingInstance.getOneProposal(0, {from: _voter1})).description;
      expect(DescriptionGenesis).to.equal("GENESIS");
    });

    //check status change
    //description : we get initial status, then we execute function, and we check the new status
    it("startProposalsRegistering() => check workflowStatus change", async () => {
    
      const workflowStatutBeforeChange = await MyVotingInstance.workflowStatus(); // contract.status.call()
      expect(workflowStatutBeforeChange.toNumber()).to.equal(0); 
    
      await MyVotingInstance.startProposalsRegistering({ from: _owner });
      
      let workflowStatusAfterChange = await MyVotingInstance.workflowStatus();
      expect(workflowStatusAfterChange.toNumber()).to.equal(1); 
  
      
    });

    //check well execution of startProposalsRegistering
    //description : check event
    it("startProposalsRegistering() => check event startProposalsRegistering", async () => {
        const result = await MyVotingInstance.startProposalsRegistering({ from: _owner });
        expectEvent(result, 'WorkflowStatusChange', {
        previousStatus: new BN(0),newStatus:new BN(1)
      });
    
  });
    
});


   //console.log("***********************************");
   //console.log("Check addProposal function ");

   describe("Check function addProposal()", function() {

    beforeEach(async function(){
      MyVotingInstance = await Voting.new({ from: _owner });
      await MyVotingInstance.addVoter(_voter1, { from: _owner }); //register a voter
      await MyVotingInstance.startProposalsRegistering({ from: _owner }); //start proposal sesssion
    });

    context("addProposal() => Check require", function(){
     
      //check require : Check caller is the owner
      it("addProposal() => check require onlyVoters", async () => {
        await expectRevert(MyVotingInstance.addProposal(_proposalDescription1, {from: _voter2}), "You're not a voter"); // a proposal submit by a non registered user
      });

      //check require : check empty proposal
      it("addProposal() => check require empty proposal", async () => {
      await expectRevert(MyVotingInstance.addProposal(_proposalDescriptionEmpty, {from: _voter1}), "Vous ne pouvez pas ne rien proposer");
      });
    });

    context("addProposal() => Check function", function(){
      
      //check proposal storage
      //description : we add a proposal, then we call the proposal from id 1 (id 0 is GENESIS propoasl)
      //              and we check if they are equal
      it("addProposal() => check proposal storage", async () => {
        await MyVotingInstance.addProposal(_proposalDescription1, {from: _voter1});
        let storeDescription = (await MyVotingInstance.getOneProposal(1, {from: _voter1})).description;
        assert.equal(storeDescription,_proposalDescription1); //check 1 index and not the 0 index  because by default, at startProposalregistering, a "GENESIS" proposal is set.
      });
    });

    context("addProposal() => Check event", function(){
    
      //check well execution of addProposal
      //description : check event
      it("addProposal() => check event ProposalRegistered", async () => {
        result = await MyVotingInstance.addProposal(_proposalDescription1, {from: _voter1});
        expectEvent(result, 'ProposalRegistered', {
          proposalId: new BN(1)
        });
      });

      });
    });

//console.log("***********************************");
//console.log("Check ProposalsRegistrationEnded function ");
   
describe("Check function ProposalsRegistrationEnded()", function() {

    beforeEach(async function(){
      MyVotingInstance = await Voting.new({ from: _owner });
    });

    //check require : Check caller is the owner
   it("ProposalsRegistrationEnded() => check require owner", async () => {
    await expectRevert(MyVotingInstance.startProposalsRegistering({from: _voter1}), "Ownable: caller is not the owner");
  });

  //check require : checker workflowStatus
  //description :  sessions status is initially not the good one 
  //               so we check the startProposalsRegistering() function
  it("ProposalsRegistrationEnded() => check require workflowStatus ", async () => {
    await expectRevert(MyVotingInstance.endProposalsRegistering({from: _owner}), "Registering proposals havent started yet");
  });

  //check status change
  //description : we get initial status, then we execute function, and we check the new status
  it("ProposalsRegistrationEnded() => check workflowStatus change", async () => {
   
   await MyVotingInstance.startProposalsRegistering({ from: _owner });

    let workflowStatutBeforeChange = await MyVotingInstance.workflowStatus();
    expect(workflowStatutBeforeChange.toNumber()).to.equal(1); 
    
    await MyVotingInstance.endProposalsRegistering({ from: _owner });
    
    let workflowStatusAfterChange = await MyVotingInstance.workflowStatus();
    expect(workflowStatusAfterChange.toNumber()).to.equal(2); 
    
  });

   //check well execution of endProposalsRegistering
   //description : check event
  it("ProposalsRegistrationEnded() => check event ProposalsRegistrationEnded", async () => {
    await MyVotingInstance.startProposalsRegistering({ from: _owner });
    const result = await MyVotingInstance.endProposalsRegistering({from: _owner});
    expectEvent(result, 'WorkflowStatusChange', {
      previousStatus: new BN(1),newStatus:new BN(2)
    });
   });
  });


  
  //console.log("***********************************");
  //console.log("Check startVotingSession function ");

  describe("Check function startVotingSession()", function() {

    beforeEach(async function(){
      MyVotingInstance = await Voting.new({ from: _owner });
    });

     //check require : Check caller is the owner
    it("startVotingSession() => check require owner", async () => {
      await MyVotingInstance.startProposalsRegistering({ from: _owner });
      await MyVotingInstance.endProposalsRegistering({ from: _owner });
      await expectRevert(MyVotingInstance.startVotingSession({from: _voter1}), "Ownable: caller is not the owner");
    });
    
   //check require : checker workflowStatus
  //description :  sessions status is initially not the good one 
  //               so we check the startVotingSession() function
  it("startVotingSession() => check require workflowStatus ", async () => {
      await MyVotingInstance.startProposalsRegistering({from: _owner});  //bas status => we expect a revert
      await expectRevert(MyVotingInstance.startVotingSession({from: _owner}), "Registering proposals phase is not finished");
    });

  //check status change
  //description : we get initial status, then we execute function, and we check the new status
  it("startVotingSession() => check workflowStatus change", async () => {
    await MyVotingInstance.startProposalsRegistering({ from: _owner });
    await MyVotingInstance.endProposalsRegistering({ from: _owner });

    let workflowStatutBeforeChange = await MyVotingInstance.workflowStatus();
    expect(workflowStatutBeforeChange.toNumber()).to.equal(2);
    
    await MyVotingInstance.startVotingSession({ from: _owner });
    
    let workflowStatusAfterChange = await MyVotingInstance.workflowStatus();
    expect(workflowStatusAfterChange.toNumber()).to.equal(3);
    
  });

    //check well execution of startVotingSession
   //description : check event
  it("startVotingSession() => check event startVotingSession", async () => {
    await MyVotingInstance.startProposalsRegistering({ from: _owner });
    await MyVotingInstance.endProposalsRegistering({ from: _owner });
    const result = await MyVotingInstance.startVotingSession({ from: _owner });
    expectEvent(result, 'WorkflowStatusChange', {
      previousStatus: new BN(2),newStatus:new BN(3)
    });
   });
  });


 //console.log("***********************************");
 //console.log("Check SetVote function ");

 //console.log("***********************************");
  //console.log("Check startVotingSession function ");

  describe("Check require of function setVote()", function() {
    beforeEach(async function(){
      MyVotingInstance = await Voting.new({ from: _owner });
      await MyVotingInstance.addVoter(_voter1, { from: _owner }); //register a voter
      await MyVotingInstance.startProposalsRegistering({from: _owner});
      await MyVotingInstance.addProposal(_proposalDescription1,{from: _voter1}); 
      await MyVotingInstance.endProposalsRegistering({from: _owner});
      await MyVotingInstance.startVotingSession({from: _owner});
    });

    context("setVote() => Check require", function(){
      
      //check require : Check caller is the owner
      it("setVote() => check require onlyVoters", async () => {
        await expectRevert(MyVotingInstance.setVote(new BN(1), {from: _voter2}), "You're not a voter");
      });

      //check require : checker workflowStatus
      //description :  set sessions status to a bad state
      //               then try to execute the function
      it("setVote() => check require status", async () => {
          await MyVotingInstance.endVotingSession({from: _owner});//status is not the good one -> expect to revert
          await expectRevert(MyVotingInstance.setVote(new BN(0), {from: _voter1}), "Voting session havent started yet");
       });

      //check require : check user has already voted
      //description : set a vote, then set another vote from the same voter
      it("setVote() => check voter has already voted", async () => {
        await MyVotingInstance.setVote(new BN(0), {from: _voter1});
        await expectRevert(MyVotingInstance.setVote(new BN(0), {from: _voter1}), "You have already voted");
      });
    });
  
    context("setVote() => Check function", function(){

      //check input ne depasse pas le tab
      it("setVote() => check input id is Ok", async () => {
        await expectRevert(MyVotingInstance.setVote(new BN(2), {from: _voter1}), "Proposal not found"); // check id > proposal array
      });
      
      //check setvote storage (counter and proposalId)
      //description : check proposalId and count from a voter before vote
      //              then execute setVote and check proposalId and count after vote
      // je fais ici un seul it meme si j'aurais du découper chaque test de modification de variable dans un it séparé
      it("setVote() => check vote storage in voters struct and in proposal array", async () => {
        
        //Check vote value in voter struct before vote
        let valueBeforeVote = (await MyVotingInstance.getVoter(_voter1,{from: _voter1})).votedProposalId;
        assert.equal(valueBeforeVote, new BN(0), 'proposal id should be 0');

        //check count vote in proposals array before vote
        let countValueBeforeVote = (await MyVotingInstance.getOneProposal(new BN(1),{from: _voter1})).voteCount;
        assert.equal(countValueBeforeVote, new BN(0), 'counter vote should be 0');
      
        await MyVotingInstance.setVote(new BN(1), {from: _voter1});

        let valueAfterVote = (await MyVotingInstance.getVoter(_voter1,{from: _voter1})).votedProposalId;
        assert.equal(valueAfterVote, new BN(1), 'proposal id should be 1');

        //check count vote in proposals array after vote
        let countValueAfterVote = (await MyVotingInstance.getOneProposal(new BN(1),{from: _voter1})).voteCount;
        assert.equal(countValueAfterVote, new BN(1), 'counter vote should be 1');

      });
    });

  context("setVote() => Check event", function(){

    //check well execution of setVote
    //description : check event
    it("setVote() => check event", async () => {
      result = await MyVotingInstance.setVote(new BN(1), {from: _voter1});
      expectEvent(result, 'Voted', {
      voter: _voter1,proposalId:new BN(1)
      });
    });
  });
});

 //console.log("***********************************");
 //console.log("Check endVotingSession function ");
 
 describe("Check function endVotingSession()", function() {

  beforeEach(async function(){
    MyVotingInstance = await Voting.new({ from: _owner });
    await MyVotingInstance.startProposalsRegistering({ from: _owner });
    await MyVotingInstance.endProposalsRegistering({ from: _owner });
    await MyVotingInstance.startVotingSession({from: _owner})
  });

  //check require : Check caller is the owner
  it("endVotingSession() => check require owner", async () => {
    await expectRevert(MyVotingInstance.endVotingSession({from: _voter1}), "Ownable: caller is not the owner");
  });

  //check require : checker workflowStatus
  //description :  set sessions status to a bad state
  //               then try to execute function
  it("endVotingSession() => check require workflowStatus ", async () => {
    await MyVotingInstance.endVotingSession({ from: _owner }); //we set bad status
    await expectRevert(MyVotingInstance.endVotingSession({from: _owner}), "Voting session havent started yet");
  });

  //check endVotingSession change workflow statut
  it("endVotingSession() => check workflowStatus change", async () => {
    let workflowStatutBeforeChange = await MyVotingInstance.workflowStatus();
    expect(workflowStatutBeforeChange.toNumber()).to.equal(3);

    await MyVotingInstance.endVotingSession({ from: _owner });
    
    let workflowStatusAfterChange = await MyVotingInstance.workflowStatus();
    expect(workflowStatusAfterChange.toNumber()).to.equal(4);
    
  });

  //check well execution of endVotingSession
  //description : check event
  it("endVotingSession() => check event endVotingSession", async () => {
    const result = await MyVotingInstance.endVotingSession({ from: _owner });
    expectEvent(result, 'WorkflowStatusChange', {
      previousStatus: new BN(3),newStatus:new BN(4)
    });
  });
});


//console.log("***********************************");
// console.log("Check tallyVotes function ");
 
describe("Check function tallyVotes()", function() {
  beforeEach(async function(){
    MyVotingInstance = await Voting.new({ from: _owner });
    await MyVotingInstance.addVoter(_voter1, {from: _owner}); 
    await MyVotingInstance.addVoter(_voter2, {from: _owner});
    await MyVotingInstance.addVoter(_voter3, {from: _owner}); 
    await MyVotingInstance.startProposalsRegistering({from: _owner});
    await MyVotingInstance.addProposal(_proposalDescription1,{from: _voter1});
    await MyVotingInstance.addProposal(_proposalDescription2,{from: _voter2});
    await MyVotingInstance.addProposal(_proposalDescription3,{from: _voter3});
    await MyVotingInstance.endProposalsRegistering({from: _owner});
    await MyVotingInstance.startVotingSession({from: _owner});
    await MyVotingInstance.setVote(new BN(1), {from: _voter1});
    await MyVotingInstance.setVote(new BN(2), {from: _voter2});
    await MyVotingInstance.setVote(new BN(2), {from: _voter3});
    await MyVotingInstance.endVotingSession({from: _owner});
 
  });

  context("tallyVotes() => Check require", function(){

    //check require owner
    it("tallyVotes() => check require owner", async () => {
      await expectRevert(MyVotingInstance.tallyVotes({from: _voter1}), "Ownable: caller is not the owner");
    });

    //check require : checker workflowStatus
    //description :  set sessions status to a bad state
    //               then try to execute function
    it("tallyVotes() => check require status", async () => {
      await MyVotingInstance.tallyVotes({from: _owner}); //we set bad status to expert a revert
      await expectRevert(MyVotingInstance.tallyVotes({from: _owner}), "Current status is not voting session ended");
    });
  });

  context("tallyVotes() => Check function", function(){
   
    //check vote count et winning id
    //description : Winner should be proposal 2 
    it("tallyVotes() => check vote winning id", async () => {
      
      await MyVotingInstance.tallyVotes({from: _owner});

      const winnindId = await MyVotingInstance.winningProposalID();
      expect(winnindId.toNumber()).to.equal(2);
  });
    
    //checker status change after execution of function
    it("tallyVotes() => check workflowStatus change", async () => {
      
      let workflowStatutBeforeChange = await MyVotingInstance.workflowStatus();
      expect(workflowStatutBeforeChange.toNumber()).to.equal(4);
      
      await MyVotingInstance.tallyVotes({ from: _owner });
      
      let workflowStatusAfterChange = await MyVotingInstance.workflowStatus();
      expect(workflowStatusAfterChange.toNumber()).to.equal(5);
      
    });
  });

    context("tallyVotes() => Check event", function(){
    //check well execution of tallyVotes
    //description : check event
    it("tallyVotes() => check event tallyVotes", async () => {
      
      const result = await MyVotingInstance.tallyVotes({from: _owner});
      expectEvent(result, 'WorkflowStatusChange', {
        previousStatus: new BN(4),newStatus:new BN(5)
      });
    });
  });
});
*/
});
