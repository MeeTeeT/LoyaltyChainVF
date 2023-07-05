const LoyaltyMarketplace = artifacts.require("LoyaltyMarketplace");
const fs = require("fs");

module.exports = (deployer) => {
    deployer.deploy(LoyaltyMarketplace);

    

   /*
    const data = {
      address: LoyaltyMarketplace.address,
      abi: JSON.parse(LoyaltyMarketplace.interface.format('json'))
    }
    console.log(data);
*/
    //This writes the ABI and address to the mktplace.json
   //fs.writeFileSync('../../../frontend/src/LoyaltyMarketplace.json', JSON.stringify(data))
  
}

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