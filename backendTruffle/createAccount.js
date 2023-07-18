const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const mnemonicGanache = process.env.MNEMONICGANACHE;
//"chuckle color crop boy total anxiety very unfold cup awesome embody plunge";

const contractAbstraction = require("../frontend/src/LTYAccount.json");
const contractAbi = contractAbstraction.abi;
const contractAddress = contractAbstraction.address;
console.log("address : ", contractAddress);
const image4 =
  "https://gateway.pinata.cloud/ipfs/QmSsu27rhPY7FTGVNLrQBk2cUxzdfPaLqbpMprfYwYJwLC";

async function interactWithContract() {
  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonicGanache,
    },
    providerOrUrl: "http://localhost:8545",
  });

  const web3 = new Web3(provider);

  const providerUrl = "http://localhost:8545";

  const accounts = await web3.eth.getAccounts();

  console.log("address du compte 0: ", accounts[0]);
  console.log("address du compte 1: ", accounts[1]);
  console.log("address du compte 2: ", accounts[2]);
  console.log("address du compte 3: ", accounts[3]);
  console.log("address du compte 4: ", accounts[4]);
  console.log("address du compte 5: ", accounts[5]);
  console.log("address du compte 6: ", accounts[6]);
  console.log("address du compte 7: ", accounts[7]);
  //console.log("address du compte: ", account);

  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  try {
    const result = await contract.methods
      .createUserAccount(
        "marque déployée en script",
        "description marque scriptée",
        image4
      )
      .send({
        from: accounts[8],
        //value: web3.utils.toWei("0.01", "ether"),
      });

    console.log("Résultat de la transaction :", result);
  } catch (e) {
    console.log("erreur de la transaction ", e);
  }
}

// Appel de la fonction principale
interactWithContract().catch((error) => {
  console.error("Erreur lors de l'interaction avec le smart contract :", error);
});
