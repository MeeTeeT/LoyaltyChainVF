const LoyaltyMarketplace = artifacts.require("LoyaltyMarketplace");
const LTYAccount = artifacts.require("LTYAccount");
const LTYMarketplace = artifacts.require("LTYMarketplace");
const fs = require("fs");

module.exports = async (deployer) => {
  //deployer.deploy(LoyaltyMarketplace);

  const ltyAccount = await deployer.deploy(LTYAccount);
  const ltyAccountDeployed = await LTYAccount.deployed();

  const ltyAccountContractAddress = ltyAccountDeployed.address;
  const ltyAccountContractABI = ltyAccountDeployed.abi;

  const ltyMarketplace = await deployer.deploy(
    LTYMarketplace,
    ltyAccountDeployed.address
  );
  const ltyMarketplaceDeployed = await LTYMarketplace.deployed();

  const ltyAccountContractData = {
    address: ltyAccountDeployed.address,
    abi: ltyAccountDeployed.abi,
  };

  const ltyMarketplaceContractData = {
    address: ltyMarketplaceDeployed.address,
    abi: ltyMarketplaceDeployed.abi,
  };

  if (fs.existsSync("../frontend/src/LTYAccount.json")) {
    fs.unlinkSync("../frontend/src/LTYAccount.json");
  }

  if (fs.existsSync("../frontend/src/LTYMarketplace.json")) {
    fs.unlinkSync("../frontend/src/LTYMarketplace.json");
  }

  fs.writeFileSync(
    "../frontend/src/LTYAccount.json",
    JSON.stringify(ltyAccountContractData, null, 2)
  );
  fs.writeFileSync(
    "../frontend/src/LTYMarketplace.json",
    JSON.stringify(ltyMarketplaceContractData, null, 2)
  );

  try {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log(accounts[1]);
    console.log(accounts[2]);
    console.log(accounts[3]);
    const imageBrasserie =
      "https://gateway.pinata.cloud/ipfs/Qmd6nRQvBtQAqqDAwtL1QWCdkHEuMD8CBYnESPdhkqUqGG";
    const imageSpurs =
      "https://gateway.pinata.cloud/ipfs/QmdV7PdujeDgRc43SbGdcFW6pjNkvyZVN96wteMPkVQKTn";
    const imageChanel =
      "https://gateway.pinata.cloud/ipfs/QmStBVi2rjdbDWQXgww1CgnwLpNmFw78sWyVWx9CKVxqGH";
    const imageNike =
      "https://gateway.pinata.cloud/ipfs/QmdqVGhs2Xegwpvvj1pcxYk3XMHbxuL9xnmVSKVr7K88js";
    const imageAirFrance =
      "https://gateway.pinata.cloud/ipfs/QmNV8WaZN2Gy4oKMiykbTRSTePbPnW94vUBbqo7KXF7j6N ";

    try {
      await ltyAccountDeployed.createUserAccount(
        "Brasserie Belge",
        "Venez déceouvrir nos offres de réduction sur nos bierres du moment",
        imageBrasserie,
        { from: accounts[1] }
      );
    } catch (e) {
      console.log("erreur dans la creation du compte 1", e);
    }

    await ltyAccountDeployed.createUserAccount(
      "San Antonio Spurs",
      "Des réductions sur toutes nos collections de maillots, ainsi que des réductions sur les places des matchs PlayOff",
      imageSpurs,
      { from: accounts[2] }
    );

    await ltyAccountDeployed.createUserAccount(
      "Chanel",
      "Des invitations à tous nos évenements privés",
      imageChanel,
      { from: accounts[3] }
    );

    await ltyAccountDeployed.createUserAccount(
      "Nike",
      "Des prix cassés sur nos dernières collections",
      imageNike,
      { from: accounts[4] }
    );

    await ltyAccountDeployed.createUserAccount(
      "Air France",
      "Des promos exclusives pour nos plus fidèles clients",
      imageAirFrance,
      { from: accounts[5] }
    );

    result = await ltyAccountDeployed.getAllBrands();

    console.log(result);
  } catch (error) {
    console.error("Erreur :", error); // Afficher les erreurs éventuelles dans les logs
    callback(error); // Terminer le script Truffle avec une erreur
  }
};

/*
module.exports = async function (deployer,network,account) => {
  await deployer.deploy(Storage,5,{from:accounts[0], value:1000000000000000});
}
*/

/*
module.exports = async function (callback) {
    try {
        const valueToSend = web3.utils.toWei('1', 'ether'); // Montant d'ether à envoyer (1 ether dans cet exemple)
    const accounts = await web3.eth.getAccounts();

    const contractInstance = await Storage.new(42, { from: accounts[0], value: valueToSend });
    let value = await contractInstance.retrieve(); // Obtenir la valeur initiale du contrat

    console.log('Valeur initiale :', value.toString()); // Afficher la valeur initiale dans les logs

    // Fixer une nouvelle valeur dans le contrat
    await contractInstance.store(100, { from: accounts[0] });
    value = await contractInstance.retrieve(); // Obtenir la nouvelle valeur du contrat

    console.log('Nouvelle valeur :', value.toString()); // Afficher la nouvelle valeur dans les logs

     // callback(); // Terminer le script Truffle
    } catch (error) {
      console.error('Erreur :', error); // Afficher les erreurs éventuelles dans les logs
      callback(error); // Terminer le script Truffle avec une erreur
    }
  };
  */

/*** correction cours */
/*const Storage = artifacts.require("Storage");

  module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Storage, 5, {from: accounts[0], value: 1000000000000000});
  
    const instance = await Storage.deployed();
    let value = await instance.get();
    console.log("initial value : ", value.toString());
  
    await instance.set(10, {from: accounts[0]});
    value = await instance.get();
    console.log("new value : ", value.toString());
  
    
    web3.eth.getAccounts().then(console.log);
  
    let balance = await web3.eth.getBalance(accounts[0]);
  
    console.log(
      "instance.address balance: " +
        web3.utils.fromWei(balance, "ether") +
        " ETH"
    );
  
  };
*/
/** fin correction cours */
