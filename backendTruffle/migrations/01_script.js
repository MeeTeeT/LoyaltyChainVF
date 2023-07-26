//const LoyaltyMarketplace = artifacts.require("LoyaltyMarketplace");
const LTYAccount = artifacts.require("LTYAccount");
const LTYMarketplace = artifacts.require("LTYMarketplace");
const fs = require("fs");
const initialiseAccount = false;

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
  if (initialiseAccount) {
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
    /*
    try {
      const accounts = await web3.eth.getAccounts();
      const uri = {
        name: "test 2",
        description: "sdd",
        price: "4",
        image:
          "https://gateway.pinata.cloud/ipfs/QmdJV7KimzPyB76knR2CJacieuJfTieuMM9VAC7JzoLrd7",
      };
      await ltyMarketplaceDeployed.createTokenToMarketplace(uri, 4, {
        from: accounts[1],
      });
    } catch (e) {
      console.log("erreur dans la creation des nfts", e);
    }
    */
  }
};
