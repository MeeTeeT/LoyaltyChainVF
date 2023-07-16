const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const mnemonic = process.env.MNEMONIC;

const contractAbstraction = require("../frontend/src/LTYAccount.json");
const contractAbi = contractAbstraction.abi;
const contractAddress = contractAbstraction.address;

const image4 =
  "https://gateway.pinata.cloud/ipfs/QmeiYiTRip2TByG9FBZHzbpwBhozHAf3UAVXMd9wGUPrvk";

async function interactWithContract() {
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic,
    },
    providerOrUrl: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
  });

  const web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  const result = await contract.methods
    .createAccount("marque 4", "description marque 4", image4)
    .send({
      from: account,
      // value: web3.utils.toWei('0.1', 'ether'),
    });

  console.log("Résultat de la transaction :", result);
}

// Appel de la fonction principale
interactWithContract().catch((error) => {
  console.error("Erreur lors de l'interaction avec le smart contract :", error);
});
