const hre = require("hardhat");
const fs = require("fs");

/*
async function main() {
  // Déploiement du contrats
  const LoyaltyMarketplace = await hre.ethers.getContractFactory("LoyaltyMarketplace");
  const loyaltyMarketplace = await LoyaltyMarketplace.deploy();

  // Attendre la confirmation du déploiement
  await loyaltyMarketplace.deployed();

  // Récupérer l'adresse déployée du contrat
  console.log("Adresse du contrat déployé :", loyaltyMarketplace.address);

  // Récupérer l'ABI du contrat
  const contractAbi = JSON.stringify(loyaltyMarketplace.interface.abi, null, 2);

  // Enregistrer l'ABI dans un fichier JSON
  fs.writeFileSync("contractABI.json", contractAbi);

  console.log("ABI du contrat enregistrée dans contractABI.json");
}
*/

async function main() {
  const loyaltyMarketplace = await hre.ethers.deployContract("LTYMarketplace");
  const loyaltyAccount = await hre.ethers.deployContract("LTYAccount");

  await loyaltyAccount.waitForDeployment();
  console.log(
    "Adresse du contrat loyaltyAccount déployé :",
    loyaltyAccount.target
  );

  await loyaltyMarketplace.waitForDeployment();
  console.log(
    "Adresse du contratloyaltyMarketplace  déployé :",
    loyaltyMarketplace.target
  );
  // console.log("ABI du contrat déployé :", JSON.stringify(loyaltyMarketplace.interface.format('json')));
  /*
 const data = {
    address: loyaltyMarketplace.target,
    abi: JSON.stringify(loyaltyMarketplace.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('../../frontend/src/LoyaltyMarketplace.json', JSON.stringify(data))
*/
  console.log(`loyaltyMarketplace deployed to ${loyaltyMarketplace.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  //const [deployer] = await ethers.getSigners();
  //const balance = await deployer.getBalance();
  const LoyaltyMarketplace = await hre.ethers.getContractFactory("LoyaltyMarketplace");
  const loyaltyMarketplace = await LoyaltyMarketplace.deploy();

  await loyaltyMarketplace.deployed();

  
  const data = {
    address: loyaltyMarketplace.address,
    abi: JSON.parse(loyaltyMarketplace.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
 // fs.writeFileSync('../../frontend/src/loyaltyMarketplace.json', JSON.stringify(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
*/
