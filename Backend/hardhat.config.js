require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-network-helpers");
require("dotenv").config();
require('hardhat-docgen');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "fantom_testnet",
  networks: {
    fantom: {
      url: "https://rpc.ankr.com/fantom",
      accounts: [process.env.PRIVATE_KEY]
    },
    fantom_testnet: {
      url: "https://rpc.ankr.com/fantom_testnet",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  mocha: {
    timeout: 150000
  },
  etherscan: {
    apiKey: process.env.FTMSCAN_API_KEY
  },
  hardhat : {
    forking: {
      url: "https://rpc.ankr.com/fantom_testnet",
    }
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  }
};
