const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const contractAbstraction = require("../frontend/src/LTYAccount.json");
const contractABI = contractAbstraction.abi;
const contractAddress = contractAbstraction.address;
//const connection = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`; //pour mumbai
const connection = "http://localhost:8545";
// Initialise une instance Web3 avec le fournisseur Ethereum approprié

const web3 = new Web3(connection);

// Crée une instance du contrat en utilisant l'ABI et l'adresse
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Exemple de fonction pour interagir avec une fonction view ou pure du contrat
async function createAccount(name, description, image) {
  try {
    const result = await contract.methods
      .createUserAccount(name, description, image)
      .call();
    console.log("Résultat de la fonction :", result);
  } catch (e) {
    console.log("erreur de la creation du compte", e);
  }
}

/*
// Exemple de fonction pour interagir avec une fonction payable du contrat et envoyer une transaction
async function interactWithContract() {
  // Composez les arguments nécessaires pour votre fonction
  const arg1 = "Hello";
  const arg2 = 42;

  // Créez l'objet de transaction
  const transactionObject = {
    from: "0xYourAddress", // Remplacez par votre adresse Ethereum
    value: web3.utils.toWei("0.1", "ether"), // Montant en Wei (dans cet exemple, 0.1 ETH)
  };

  // Effectuez l'appel de fonction et envoyez la transaction
  try {
    const result = await contract.methods
      .yourFunctionName(arg1, arg2)
      .send(transactionObject);
    console.log("Résultat de la transaction :", result);
  } catch (error) {
    console.error("Erreur lors de l'interaction avec le contrat :", error);
  }
}
*/

// Appelez les fonctions selon vos besoins
const image4 =
  "https://gateway.pinata.cloud/ipfs/QmeiYiTRip2TByG9FBZHzbpwBhozHAf3UAVXMd9wGUPrvk";

createAccount("marque 4", "description marque 4", image4);
