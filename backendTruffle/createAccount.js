const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const contractAbstraction = require("../frontend/src/LTYAccount.json");
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "EventBrandRegisterOnPlatform",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "brandId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "image",
        type: "string",
      },
    ],
    name: "EventUserAccountCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "EventUserIsABrand",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userAccounts",
    outputs: [
      {
        internalType: "uint256",
        name: "brandId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "image",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isABrand",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isBrandRegisterOnPlatform",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isAddressAlreadyCreatedAccount",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_image",
        type: "string",
      },
    ],
    name: "createUserAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "setIsBrandRegisterOnPlatform",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "getIsBrandRegisterOnPlatform",
    outputs: [
      {
        internalType: "bool",
        name: "_isRegistered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "setUserIsABrand",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "getIdBrandFromAddress",
    outputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_idBrand",
        type: "uint256",
      },
    ],
    name: "getBrandFromId",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "brandId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isABrand",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isBrandRegisterOnPlatform",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAddressAlreadyCreatedAccount",
            type: "bool",
          },
        ],
        internalType: "struct LTYAccount.UserAccount",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getAllBrands",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "brandId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isABrand",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isBrandRegisterOnPlatform",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isAddressAlreadyCreatedAccount",
            type: "bool",
          },
        ],
        internalType: "struct LTYAccount.UserAccount[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
]; //contractAbstraction.abi;
const contractAddress = "0x75eb543ae23a1d030432cee4b1bb0772e9b2f55c"; //contractAbstraction.address;
//const connection = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`; //pour mumbai
const connection = "http://localhost:8545";
// Initialise une instance Web3 avec le fournisseur Ethereum approprié

const web3 = new Web3(connection);

// Crée une instance du contrat en utilisant l'ABI et l'adresse
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Exemple de fonction pour interagir avec une fonction view ou pure du contrat
async function createAccount(name, description, image) {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods
      .createUserAccount(name, description, image)
      .call({ from: accounts[1] });
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
