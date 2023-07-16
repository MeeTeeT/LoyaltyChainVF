require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-truffle5");
require("dotenv").config();
//require("@nomiclabs/hardhat-etherscan")

const PK = process.env.PK || "";
const RPC_URL = process.env.RPC_URL || "";
//const ETHERSCAN = process.env.ETHERSCAN || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: RPC_URL,
      accounts: [`0x${PK}`],
      chainId: 11155111,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
    ],
  } /*
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN
    }
  }
  */,
};

/*
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
//require("@nomicfoundation/hardhat-toolbox")


require("dotenv").config()
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

const PK = process.env.PK || ""
const RPC_URL = process.env.RPC_URL || ""
const ETHERSCAN = process.env.ETHERSCAN || ""


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      //url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    
    sepolia: {
      url: RPC_URL,
      accounts: [`0x${PK}`],
      chainId: 11155111
    }
    
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN
    }
  }
  
};

*/
